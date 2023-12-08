const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  sender: String,
  id_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  account_number: String,
  transaction_type: String,
  amount: Number,
  transaction_date: Date,
  transaction_des: String,
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;