const mongoose = require('mongoose');
const Seller = require('./sellerModel');
const { ObjectId } = mongoose.Schema.Types

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://listonic.com/wp-content/uploads/2018/12/grocery-bag-1-3.png'
    },
    price: {
        type: Number,
        required: true,
    },
    // discount: {
    //     type: Number,
    //     default: 0
    // },
    // highlights: {
    //     type: [String],
    //     required: true,
    // },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    ownedBy: {
        type: ObjectId,
        ref: Seller,
        required: true
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;