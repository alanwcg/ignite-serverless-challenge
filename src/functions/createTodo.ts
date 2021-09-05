import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

interface ITodo {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async event => {
  const {
    id,
    user_id,
    title,
    done,
    deadline,
  } = JSON.parse(event.body) as ITodo;

  const response = await document.query({
    TableName: 'todos',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
  }).promise();

  const todoAlreadyExists = response.Items[0];

  if (todoAlreadyExists) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Todo already exists!',
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }
  }

  await document.put({
    TableName: 'todos',
    Item: {
      id,
      user_id,
      title,
      done,
      deadline: new Date(deadline),
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created!',
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  }
}