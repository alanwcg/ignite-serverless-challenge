import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async event => {
  const { userId } = event.pathParameters;

  const response = await document.scan({
    TableName: 'todos',
    FilterExpression: 'user_id = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  }).promise();

  const userTodos = response.Items;

  if (userTodos) {
    return {
      statusCode: 200,
      body: JSON.stringify(userTodos),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Todos not found for this user!',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}