# ComicVerse

## Introduction

**ComicVerse** is a web platform designed for comic fans everywhere. It allows users to read, create, and stay updated on the latest comics. Whether you're a reader or a creator, ComicVerse offers an engaging environment where comic lovers can easily connect and explore comic content. The platform features a user-friendly interface, comic creation tools, and interactive features for readers, creators, and subscribers alike.

---

## ComicVerse - AWS Serverless Architecture


![Screenshot 2](/App%20Preview%20Shots/Serverless%20Architecture.png)

![Screenshot 2](/App%20Preview%20Shots/CloudFormation%20Architecture.png)



## App Preview Shots

Here are some preview shots of the ComicVerse app:

![Screenshot 1](/App%20Preview%20Shots/ComicVerse%20App%20(2).png)
![Screenshot 1](/App%20Preview%20Shots/ComicVerse%20App%20(3).png)
![Screenshot 1](/App%20Preview%20Shots/ComicVerse%20App%20(4).png)
![Screenshot 1](/App%20Preview%20Shots/ComicVerse%20App%20(1).png)
![Screenshot 1](/App%20Preview%20Shots/ComicVerse%20App%20(5).png)
![Screenshot 1](/App%20Preview%20Shots/ComicVerse%20App%20(6).png)
![Screenshot 1](/App%20Preview%20Shots/ComicVerse%20App%20(7).png)


Here are some preview shots of the Cloud Formation Execution:

![Screenshot 2](/App%20Preview%20Shots/CloudFormation%20Execution%20(3).png)
![Screenshot 2](/App%20Preview%20Shots/CloudFormation%20Execution%20(1).png)
![Screenshot 2](/App%20Preview%20Shots/CloudFormation%20Execution%20(2).png)


## Key Features

### User Authentication
- **Register an Account**: Users can sign up with an email and password.
- **Login**: Secure user login with session management.
- **Password Recovery**: Ability to recover forgotten passwords.

### Profile Management
- **Manage Your Profile**: Users can update personal information, profile picture, and preferences.

### Comic Creation
- **Create Comics**: Users can create comics using text input or by uploading PDF files.
- **Comic Viewer**: Read comics in an easy-to-use viewer.

### Comic Engagement
- **Like Comics**: Users can like their favorite comics.
- **Comic Subscription**: Subscribe to various comic categories to receive notifications when new comics are released.
- **Comic Downloads**: Download comics as PDFs.

---

## Target Users
- **Creators**: Individuals looking to create and publish their own comic content.
- **Readers**: Users who enjoy reading and discovering new comics.
- **Subscribers**: Users who want to stay updated on the latest comics in their preferred categories.

---

## Performance Targets
- **Fast Loading Times**: Ensure a seamless user experience with quick page and comic load times.
- **High Availability**: Ensure the platform remains available with 99.9% uptime or higher.
- **Scalability**: The system must be able to scale as the user base and comic library grow.
- **Security**: Ensure strong protection for user data and personal information.
- **Efficient Resource Management**: Optimize resources for minimal operational costs while maintaining performance.
- **Real-time Notifications**: Provide timely updates to users on new comic releases.

---

## Technology Stack

### Backend Services (AWS)
- **AWS Lambda (Node.js 20)**: Used for handling serverless backend processes like comic creation, notifications, and user management.
- **Amazon SQS (Simple Queue Service)**: Manages queuing for processes like PDF generation and storage.
- **Amazon SNS (Simple Notification Service)**: Enables users to subscribe to comic categories and receive notifications when new comics are published.
- **Amazon S3**: Stores comic PDF files and other static assets.
- **Amazon DynamoDB**: A NoSQL database used for storing user data, comic details, and subscription information.

### Frontend Hosting
- **Amazon EC2**: Hosts the React-based frontend application, ensuring a scalable and secure environment.
- **Amazon VPC (Virtual Private Cloud)**: Provides a secure network configuration for hosting the application.
- **React**: JavaScript framework used for building the frontend user interface.

---

## Architecture Overview

### Backend (AWS Serverless)

1. **AWS Lambda** handles all backend processes such as:
   - User management (registration, login, password recovery)
   - Comic creation (text input and PDF upload)
   - Sending notifications via SNS
   - Processing comic subscriptions

2. **Amazon SQS** is used to manage long-running tasks such as PDF generation. This helps ensure efficient handling of tasks without overloading the system.

3. **Amazon SNS** enables real-time notifications for users who subscribe to different comic categories. When a new comic is released in a subscribed category, users will receive notifications.

4. **Amazon DynamoDB** stores user data, comic details, and subscription information, ensuring fast and scalable data access.

5. **Amazon S3** is used for storing all static content, such as comic PDFs and images, ensuring reliable and scalable storage.

### Frontend (React Application)

1. **React** powers the frontend user interface, providing an intuitive and interactive experience for users to browse, read, create, and subscribe to comics.

2. **Amazon EC2** hosts the React frontend, ensuring that the application is scalable, secure, and always available.

3. **API Gateway** connects the React frontend to the AWS Lambda backend via RESTful API endpoints, allowing users to interact with the platform.

---

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
    - The SQS queue manages the PDF generation process asynchronously, ensuring that the time-consuming process of generating PDFs does not impact the frontend.

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
