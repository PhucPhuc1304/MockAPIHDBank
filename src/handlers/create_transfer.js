const mongoose = require('mongoose');
const connectDatabase = require('../database/db');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

module.exports.handler = async (event, context) => {
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

    // Parse nội dung yêu cầu thành một đối tượng JSON
    const parsedBody = JSON.parse(body);
    console.log(parsedBody);

    // Kiểm tra xem các trường cần thiết đã được cung cấp hay chưa
    const requiredFields = ['sender', 'receiver', 'transaction_type', 'amount'];
    if (!requiredFields.every(field => parsedBody[field])) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid transaction data' }),
      };  
    }

    // Kiểm tra loại giao dịch và thực hiện các xử lý tương ứng
    if (parsedBody.transaction_type === 'receive') {
      // Tìm tài khoản của người nhận
      const receiverAccount = await Account.findOne({ account_number: parsedBody.receiver });

      if (!receiverAccount) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Receiver account not found' }),
        };
      }

      // Tính toán số tiền cần cộng cho người nhận
      const receivedAmount = +parsedBody.amount;
      const transactionDate = new Date(); // Tạo đối tượng Date hiện tại

      // Cập nhật số dư tài khoản người nhận
      receiverAccount.balance += receivedAmount;
      await receiverAccount.save();

      // Tạo và lưu giao dịch
      const transaction = new Transaction({
        sender: parsedBody.sender,
        id_account: receiverAccount._id,
        account_number : receiverAccount.account_number,
        transaction_type: parsedBody.transaction_type,
        amount: receivedAmount,
        transaction_date: transactionDate,
        transaction_des: parsedBody.transaction_des,
      });
      try {
        await transaction.save();
        return {
          statusCode: 201,
          body: JSON.stringify({transaction}),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to save transaction' }),
        };
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save transaction' }),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: 'Failed to create transaction' }),
    };
  }
};
