const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  account_number: {
    type: String,
    unique: true,
  },
  balance: Number,
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;