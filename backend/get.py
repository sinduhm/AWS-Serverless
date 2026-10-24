
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


def convert_decimal(value):
    # Convert DynamoDB Decimal values into JSON-compatible numbers
    if isinstance(value, list):
        return [convert_decimal(item) for item in value]

    if isinstance(value, dict):
        return {
            key: convert_decimal(item)
            for key, item in value.items()
        }

    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)

    return value


def lambda_handler(event, context):
    try:
        # Handle browser CORS preflight
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": HEADERS,
                "body": json.dumps({"message": "OK"})
            }

        # Retrieve records, including subsequent scan pages
        items = []
        response = table.scan()
        items.extend(response.get("Items", []))

        while "LastEvaluatedKey" in response:
            response = table.scan(
                ExclusiveStartKey=response["LastEvaluatedKey"]
            )
            items.extend(response.get("Items", []))

        items = convert_decimal(items)

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps(items)
        }

    except Exception as e:
        print("Error retrieving students:", str(e))

        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": str(e)})
        }
