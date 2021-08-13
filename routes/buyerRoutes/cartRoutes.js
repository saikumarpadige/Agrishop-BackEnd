const express = require("express")

const Cart = require('../../models/cartModel')

const router = express.Router();

// get user cart
router
    .route('/:id/cart')
    .get(async (req, res) => {
        const userId = req.params.id
        Cart.find({ ownedBy: userId }, { __v: 0 })
            .populate('items.product')
            .then(cart => {
                res.json({
                    status: 'success',
                    message: 'Cart items successfully fetched',
                    cart: cart[0]
                })
            })
            .catch(() => {
                res.json({
                    status: 'failed',
                    message: 'Something went wrong',
                })
            })
    })

// add to cart
router
    .route('/cart/add')
    .post(async (req, res) => {
        const { cartId, item } = req.body

        let { items } = await Cart.findOne({ _id: cartId })

        // if item already present in array
        if (items.some(ele => item.product._id == ele.product)) {
            let updateIndex = items.findIndex(ele => item.product._id == ele.product)
            items[updateIndex].quantity += item.quantity
            Cart.findByIdAndUpdate({ _id: cartId }, { 'items': items }, { new: true })
                .populate('items.product')
                .then(cart => {
                    res.json({
                        status: 'success',
                        message: 'Cart successfully updated',
                        cart: cart
                    })
                })
                .catch(() => {
                    res.json({
                        status: 'failed',
                        message: 'Something went wrong',
                    })
                })
        }
        // if item not present in array
        else {
            Cart.findByIdAndUpdate({ _id: cartId }, { $push: { 'items': item } }, { new: true })
                .populate('items items.product')
                .then(cart => {
                    res.json({
                        status: 'success',
                        message: 'Product added to cart successfully',
                        cart: cart
                    })
                    console.log('item added')
                })
                .catch(() => {
                    res.json({
                        status: 'failed',
                        message: 'Something went wrong',
                    })
                })
        }
    })

// update cart
router
    .route('/cart/update')
    .post(async (req, res) => {
        const { cartId, items } = req.body
        Cart.findByIdAndUpdate({ _id: cartId }, { 'items': items }, { new: true })
            .populate('items.product')
            .then(cart => {
                res.json({
                    status: 'success',
                    message: 'Cart successfully updated',
                    cart: cart
                })
            })
            .catch(() => {
                res.json({
                    status: 'failed',
                    message: 'Something went wrong',
                })
            })
    })

module.exports = router