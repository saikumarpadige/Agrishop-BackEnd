const mongoose = require('mongoose');
const Product = require('./productModel');
const Seller = require('./sellerModel');
const User = require('./userModel');
const { ObjectId } = mongoose.Schema.Types

const orderSchema = new mongoose.Schema({
    buyer: {
        type: ObjectId,
        ref: User,
        required: true
    },
    seller: {
        type: ObjectId,
        ref: Seller,
        required: true
    },
    items: {
        type: [{
            product: {
                type: ObjectId,
                ref: Product,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        default: []
    },
    total: {
        type: Number,
        required: true
    },
    deliveryCharges: {
        type: Number,
        required: true
    },
    buyerAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Confirmed'
    },
    deliveryDate: {
        type: Date,
        default: new Date()
    }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

module.exports = Order