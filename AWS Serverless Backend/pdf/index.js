const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const PDFDocument = require('pdfkit');

const db = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const { body } = record;
      const comic = JSON.parse(body);
      const comicId = comic.id;
      const comicText = comic.comicText;
      const pdfUrl = comic.pdfUrl;

      if (pdfUrl) {
        // Log a message or handle as needed
        console.log(`Comic with ID ${comicId} already has a PDF URL defined: ${pdfUrl}`);
        continue; // Move to the next record
      }
      console.log(`Comic with ID ${comicId} already has a PDF URL defined: ${pdfUrl}`);
      console.log(`Comic with ID ${comicText}`);

      // Create a new PDF document
      const doc = new PDFDocument();
      const texts = ''+comicText;
      // Add text to the document
      for (const textLine of texts.split('\n')) {
        doc.text(textLine);
      }

      // Generate the PDF buffer
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.end();

      // Wait for the document to finish
      await new Promise((resolve) => {
        doc.on('end', resolve);
      });

      const pdfBuffer = Buffer.concat(buffers);

      // Upload the PDF to S3
      const pdfKey = `comics/${comicId}.pdf`;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
      }));

      // Update DynamoDB with S3 URL
      const updateParams = {
        TableName: process.env.COMIC_TABLE_NAME,
        Key: { id: { S: comicId } },
        UpdateExpression: 'SET pdfUrl = :pdfUrl',
        ExpressionAttributeValues: {
          ':pdfUrl': { S: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${pdfKey}` },
        }
      };
      await db.send(new UpdateItemCommand(updateParams));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Processing completed successfully' })
    };
  } catch (error) {
    console.error('Error processing comics:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process comics', error: error.message })
    };
  }
};
