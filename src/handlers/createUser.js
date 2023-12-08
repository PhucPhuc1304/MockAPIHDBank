const mongoose = require('mongoose');
const connectDatabase = require('../database/db');
const User = require('../models/user');
const Account = require('../models/account');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const { headers, body } = event;
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
    const { name, email, password, address, phone_number } = JSON.parse(body);
    const userObj = {
      name,
      email,
      password,
      address,
      phone_number,
    };
    const newUser = await User.create(userObj);

    const accountObj = {
      user_id: newUser._id,
      account_number: generateAccountNumber(),
      balance: 0,
    };
    const newAccount = await Account.create(accountObj);

    return {
      statusCode: 201,
      body: JSON.stringify({ newUser, newAccount }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function generateAccountNumber() {
  const min = 100000000; // Minimum 9-digit number
  const max = 999999999; // Maximum 9-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}