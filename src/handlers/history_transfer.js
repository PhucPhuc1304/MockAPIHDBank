const mongoose = require('mongoose');
const connectDatabase = require('../database/db');
const Transaction = require('../models/transaction');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const { headers, body } = event;
    const accessToken = headers['access-token'];
    const apiKey = headers['x-api-key'];

    // Check API key and token
    if (accessToken !== 'phucphuctest123' || apiKey !== 'hutech_hackathon@123456') {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' }),
      };
    }

    await connectDatabase();

    // Parse the request body into a JSON object
    const requestBody = JSON.parse(body);

    // Extract account_number from the request body
    const accountNumber = requestBody.account_number;
    console.log(accountNumber)
    if (!accountNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Account number is required in the request body' }),
      };
    }

    // Find transaction history for the account
    const transactions = await Transaction.find({ account_number: accountNumber }).exec();

    return {
      statusCode: 200,
      body: JSON.stringify({ transactions }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: 'Failed to fetch transaction history' }),
    };
  }
};
