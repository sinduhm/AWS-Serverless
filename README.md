AWS Serverless Student Management System

Project Overview

A serverless web application built using AWS services to submit and retrieve student information through a simple frontend.

Technologies Used

- Frontend: HTML, JavaScript
- AWS Services: S3, CloudFront, API Gateway, Lambda, DynamoDB, IAM
- Backend: Python

Key Features

- Submit student information through a web form.
- Process requests using AWS Lambda functions.
- Store and retrieve records from DynamoDB.
- Host the frontend using Amazon S3 and CloudFront.

Usage

1. Configure the frontend with the correct API Gateway endpoints.
2. Deploy the Python Lambda functions.
3. Configure API Gateway routes, DynamoDB permissions, and CORS.
4. Host the frontend and test the submission and retrieval workflows.

Security Notes

- Follow least-privilege IAM permissions.
- Never commit AWS credentials, secrets, or real student data.
- Configure API access and CORS appropriately.

Project Status

The AWS infrastructure is currently inactive. Redeployment and end-to-end testing are required before the application can be used live.

Learning Outcomes

Gained practical experience with serverless architecture, AWS service integration, API development, and database operations.
