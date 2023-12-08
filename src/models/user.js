const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add the name'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 6,
        select: false,
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
    },
    phone_number: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
});

UserSchema.pre('save', async function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;