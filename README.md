Student Management System

A serverless student record application built with HTML, JavaScript, Amazon S3, Amazon API Gateway, AWS Lambda, and Amazon DynamoDB.

### Deployed URLs
- **Website:** http://aws-serverless-buket28.s3-website.ap-south-1.amazonaws.com
- **API Base URL:** https://szig0qfkk0.execute-api.ap-south-1.amazonaws.com/prod
- **GitHub:** https://github.com/sinduhm/AWS-Serverless

### ArchitectureBrowser → S3 Static Website → API Gateway → Lambda → DynamoDB (studentData)javascript
### Features
- Add a student record
- Load and display student records
- Validate required form fields
- Display success and error messages
- Ignore incomplete legacy records in the GET response
- Prevent duplicate student IDs in the POST Lambda

### Project StructureAWS-Serverless/
├── frontend/
│   ├── index.html
│   └── script.js
├── backend/
│   ├── inser.py
│   └── get.py
├── docs/
│   └── screenshots
└── README.mdjavascript
### DynamoDB Setup
- **Table name:** `studentData`
- **Partition key:** `student_id` (String)
- **Region:** `ap-south-1`

**Example Item:**
``json
{
  "student_id": "STU001",
  "name": "Rahul",
  "class": "BCA",
  "age": 21
}

Lambda Deployment

Create two Lambda functions in ap-south-1.
1. POST - post-student
Runtime: Python 3.xHandler: inser.lambda_handlerFile: backend/inser.pyEnv: TABLE_NAME=studentDataPermission: dynamodb:PutItem2. GET - get-student
Runtime: Python 3.xHandler: get.lambda_handlerFile: backend/get.pyEnv: TABLE_NAME=studentDataPermission: dynamodb:ScanBoth use built-in boto3.

API Gateway Setup
POST /post → post-studentGET /get → get-studentBase URL: https://szig0qfkk0.execute-api.ap-south-1.amazonaws.com/prod
Enable CORS for S3 origin (GET, POST, OPTIONS, Content-Type)Deploy to prod stage after changesS3 Deployment
Upload frontend files to bucket aws-serverless-buket28Enable Static Website Hosting with index.html as indexOpen: http://aws-serverless-buket28.s3-website.ap-south-1.amazonaws.comHard refresh with Ctrl+F5 after updatesHow to Test
Enter unique Student ID, Name, Class, AgeClick Save StudentClick Load StudentsCheck record appears in tableImportant Notes
If API routes differ, update frontend/script.jsGET Lambda filters incomplete legacy records (does not delete them)S3 website uses HTTP, use CloudFront + HTTPS for productionDo not put AWS keys in frontendCurrent version supports Create and Read only

Author
Sindu HM
