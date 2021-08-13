const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    address: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;