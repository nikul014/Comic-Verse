const { SNSClient, SubscribeCommand, UnsubscribeCommand, ListSubscriptionsByTopicCommand } = require('@aws-sdk/client-sns');
const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

const snsClient = new SNSClient({ region: process.env.AWS_REGION });
const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    console.log('Event received:', event);

    const { email, category, action } = JSON.parse(event.body);
    console.log('Parsed event body:', { email, category, action });

    let topicArn;
    switch (category) {
        case 'Superhero':
            topicArn = process.env.SuperheroTopicArn;
            break;
        case 'Fantasy':
            topicArn = process.env.FantasyTopicArn;
            break;
        case 'Sci-Fi':
            topicArn = process.env.SciFiTopicArn;
            break;
        case 'Mystery':
            topicArn = process.env.MysteryTopicArn;
            break;
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid category provided' }),
            };
    }

    try {
        // Retrieve current user from DynamoDB
        const getParams = {
            TableName: process.env.USER_TABLE_NAME,
            Key: { email: { S: email } },
        };
        const { Item } = await dbClient.send(new GetItemCommand(getParams));

        // Check if the user exists
        if (!Item) {
            console.log('User not found:', email);
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        const existingCategories = Item?.category?.S || '';
        const categoriesArray = existingCategories.split(',').map(cat => cat.trim().toLowerCase());

        if (action === 'remove') {
            // Remove the category if it exists
            if (categoriesArray.includes(category.toLowerCase())) {
                // List subscriptions by topic to find the SubscriptionArn
                const listParams = {
                    TopicArn: topicArn,
                };
                const listSubscriptionsCommand = new ListSubscriptionsByTopicCommand(listParams);
                const listSubscriptionsResponse = await snsClient.send(listSubscriptionsCommand);

                const subscription = listSubscriptionsResponse.Subscriptions.find(sub => sub.Endpoint === email);

                if (subscription && subscription.SubscriptionArn && subscription.SubscriptionArn.split(':').length >= 6) {
                    const unsubscribeParams = {
                        SubscriptionArn: subscription.SubscriptionArn,
                    };
                    const unsubscribeCommand = new UnsubscribeCommand(unsubscribeParams);
                    await snsClient.send(unsubscribeCommand);
                    console.log('User unsubscribed from SNS topic:', { email, topicArn });

                    // Remove the category from the list
                    const updatedCategories = categoriesArray.filter(cat => cat !== category.toLowerCase()).join(',');

                    // Update the DynamoDB table
                    const updateParams = {
                        TableName: process.env.USER_TABLE_NAME,
                        Key: { email: { S: email } },
                        UpdateExpression: 'SET category = :category',
                        ExpressionAttributeValues: {
                            ':category': { S: updatedCategories },
                        },
                        ReturnValues: 'ALL_NEW',
                    };
                    const data = await dbClient.send(new UpdateItemCommand(updateParams));
                    const updatedUser = data.Attributes;
                    console.log('User table updated in DynamoDB:', updatedUser);

                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: `Successfully removed category ${category} for user and unsubscribed from topicArn ${topicArn}.`,
                            data: updatedUser,
                        }),
                    };
                } else {
                    console.log('Subscription not found or invalid ARN for the user.');
                    // Remove the category from the DynamoDB table even if the subscription was not found
                    const updatedCategories = categoriesArray.filter(cat => cat !== category.toLowerCase()).join(',');

                    const updateParams = {
                        TableName: process.env.USER_TABLE_NAME,
                        Key: { email: { S: email } },
                        UpdateExpression: 'SET category = :category',
                        ExpressionAttributeValues: {
                            ':category': { S: updatedCategories },
                        },
                        ReturnValues: 'ALL_NEW',
                    };
                    const data = await dbClient.send(new UpdateItemCommand(updateParams));
                    const updatedUser = data.Attributes;
                    console.log('User table updated in DynamoDB:', updatedUser);

                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: `Category ${category} not found in subscription list but removed from DynamoDB.`,
                            data: updatedUser,
                        }),
                    };
                }
            } else {
                console.log('Category not found in the user\'s subscription list.');
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: `Category ${category} not found in user's subscription list.`,
                    }),
                };
            }
        } else {
            // Check if the category already exists
            if (!categoriesArray.includes(category.toLowerCase())) {
                // Subscribe user to SNS topic
                const subscribeParams = {
                    Protocol: 'email',
                    TopicArn: topicArn,
                    Endpoint: email,
                };
                const subscribeCommand = new SubscribeCommand(subscribeParams);
                await snsClient.send(subscribeCommand);
                console.log('User subscribed to SNS topic:', { email, topicArn });

                // Append the new category
                categoriesArray.push(category.toLowerCase());
                const updatedCategories = categoriesArray.join(',');

                // Update the DynamoDB table with the new category
                const updateParams = {
                    TableName: process.env.USER_TABLE_NAME,
                    Key: { email: { S: email } },
                    UpdateExpression: 'SET category = :category',
                    ExpressionAttributeValues: {
                        ':category': { S: updatedCategories },
                    },
                    ReturnValues: 'ALL_NEW',
                };
                const data = await dbClient.send(new UpdateItemCommand(updateParams));
                const updatedUser = data.Attributes;
                console.log('User table updated in DynamoDB:', updatedUser);

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: `Successfully updated user with category ${category} and topicArn ${topicArn}.`,
                        data: updatedUser,
                    }),
                };
            } else {
                console.log('Category already exists for the user.');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: `Category ${category} already exists for user.`,
                    }),
                };
            }
        }
    } catch (error) {
        console.error('Error subscribing/unsubscribing from SNS topic or updating DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to subscribe/unsubscribe from SNS topic or update DynamoDB',
                error: error.message,
                stack: error.stack,
            }),
        };
    }
};
