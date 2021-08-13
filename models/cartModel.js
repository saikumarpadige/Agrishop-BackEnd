const mongoose = require('mongoose');
const Product = require('./productModel');
const User = require('./userModel');
const { ObjectId } = mongoose.Schema.Types

// const itemSchema = new mongoose.Schema({
//     productId: {
//         type: ObjectId,
//         ref: Product,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     }
// })
// const Item = mongoose.model('Item', itemSchema)

const cartSchema = new mongoose.Schema({
    ownedBy: {
        type: ObjectId,
        ref: User,
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
    }
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart