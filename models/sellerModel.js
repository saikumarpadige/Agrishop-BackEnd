const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        reuired: true
    },
    shopname: {
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
        required: true,
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true
    },
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;