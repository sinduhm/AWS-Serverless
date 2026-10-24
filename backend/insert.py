
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
table = dynamodb.Table("studentData")

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
}


def lambda_handler(event, context):
    try:
        # Handle browser CORS preflight
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": HEADERS,
                "body": json.dumps({"message": "OK"})
            }

        # Support both direct Lambda tests and API Gateway proxy requests
        body = event.get("body")

        if isinstance(body, str):
            body = json.loads(body)
        elif body is None:
            body = event

        # Read the exact field names used in your project
        student_id = str(body.get("student_id", "")).strip()
        name = str(body.get("name", "")).strip()
        student_class = str(body.get("class", "")).strip()
        age_value = body.get("age")

        if not student_id or not name or not student_class or age_value is None:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({
                    "error": "student_id, name, class and age are required."
                })
            }

        try:
            age = int(age_value)
        except (ValueError, TypeError):
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({"error": "Age must be a valid integer."})
            }

        if age < 1 or age > 120:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({"error": "Age must be between 1 and 120."})
            }

        # Save to DynamoDB
        table.put_item(
            Item={
                "student_id": student_id,
                "name": name,
                "class": student_class,
                "age": age
            }
        )

        return {
            "statusCode": 201,
            "headers": HEADERS,
            "body": json.dumps({
                "message": "Student data saved successfully!",
                "student_id": student_id
            })
        }

    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"error": "Invalid JSON request body."})
        }

    except Exception as e:
        print("Error saving student:", str(e))
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": str(e)})
        }
