const mongoose = require('mongoose');
const connectDatabase = require('../database/db');
const Account = require('../models/account');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const { headers, body } = event;
    console.log(body);
    const accessToken = headers['access-token'];
    const apiKey = headers['x-api-key'];
    
    // Kiểm tra API key và token
    if (accessToken !== 'phucphuctest123' || apiKey !== 'hutech_hackathon@123456') {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' }),
      };
    }

    await connectDatabase();

    // Add null check for body
    if (!body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request body' }),
      };
    }

    const parsedBody = JSON.parse(body);

    // Add null check for account_number property
    const { account_number } = parsedBody || {};

    if (!account_number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid account number' }),
      };
    }

    const account = await Account.findOne({ account_number });

    if (!account) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Account not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ balance: account.balance }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: 'Failed to fetch balance' }),
    };
  }
};