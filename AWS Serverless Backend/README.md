# ComicVerse - AWS Serverless Architecture

## Project Overview
**Application Name**: ComicVerse  
**Purpose**: A platform where users can create and read comic books.

---

## Services Used in AWS CloudFormation

### 1. **Compute**
We are utilizing two key AWS compute services for the application:

#### a. **AWS EC2**
- **Purpose**: Hosts the frontend React application, ensuring that the platform is accessible to users over the internet.

#### b. **AWS Lambda**
- **Purpose**: Handles the backend APIs for ComicVerse, enabling serverless execution for various actions, such as creating comics, fetching user data, etc.

---

### 2. **Storage**

#### a. **AWS S3**
- **Purpose**: All generated comic files, such as images or PDFs, are stored in S3 buckets. The comics are saved and retrieved from these buckets.

#### b. **AWS DynamoDB**
- **Purpose**: User data, including account information, preferences, and comic-related data, is stored in DynamoDB. It ensures quick, scalable, and low-latency access to the data.

---

### 3. **Network**

#### a. **API Gateway**
- **Purpose**: Serves as the entry point for the frontend application to interact with the Lambda functions. API Gateway manages the HTTP request/response lifecycle and routes requests to the appropriate Lambda functions.

#### b. **VPC**
- **Purpose**: Configures a Virtual Private Cloud (VPC) with public and private subnets to securely host the React application. The VPC ensures proper isolation and networking between resources.

---

### 4. **General Services**

#### a. **AWS SNS (Simple Notification Service)**
- **Purpose**: Users can subscribe to specific comic categories, and when a new comic is added to that category, SNS sends email notifications to all subscribers.

#### b. **AWS SQS (Simple Queue Service)**
- **Purpose**: When a user is creating a comic, the process includes generating a PDF from the comic's content, which takes time. An SQS queue is used to manage this process asynchronously, allowing for efficient handling of load without affecting user experience.

---

## Architecture Flow

1. **User Interaction**:
    - Users can create, update, and read comic books on the ComicVerse platform.
    - When a new comic is created, the system processes the comic content to generate a PDF file.

2. **Backend Services**:
    - **Lambda Functions**: Handle requests like comic creation, updates, user management, and more.
    - **API Gateway**: Exposes the Lambda functions to the frontend, allowing seamless communication between the client and backend.

3. **Storage**:
    - Comic files and user data are stored in **S3** and **DynamoDB** respectively.
    - The PDF files for comics are generated and queued via **SQS** for further processing.

4. **User Subscriptions**:
    - Users can subscribe to different comic categories through **SNS**.
    - Once a new comic is added to a subscribed category, the users receive email notifications via SNS.

5. **Queue Management**:
    - The SQS queue manages the PDF generation process asynchronously, ensuring that the frontend is not impacted by the time-consuming process of generating PDFs.

---

## Benefits of this Architecture
- **Scalability**: Using AWS Lambda and DynamoDB ensures that the platform can handle growth in both user base and comic content without worrying about resource provisioning.
- **Cost Efficiency**: Serverless compute (AWS Lambda) and storage services (S3 and DynamoDB) scale based on demand, ensuring cost-effective operations.
- **Asynchronous Processing**: SQS enables the efficient handling of long-running tasks like PDF generation, offloading the burden from the user-facing experience.
- **Notifications**: SNS allows easy subscription and notification management for users, keeping them updated on the comics they are interested in.

---

## How to Deploy

1. **CloudFormation**: Use the provided CloudFormation template to deploy the entire infrastructure in AWS.
2. **Frontend Setup**: The React application can be hosted on an EC2 instance or through S3 as a static website.
3. **Lambda Functions**: Lambda functions are already defined to handle the necessary API endpoints and logic.

---

## Conclusion
This serverless architecture provides a robust and scalable backend for the **ComicVerse** platform, with seamless integration between compute, storage, network, and messaging services. With this design, ComicVerse can grow efficiently while providing a smooth experience for users creating and reading comics.
