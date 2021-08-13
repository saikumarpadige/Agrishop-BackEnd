const express = require("express");
const Cart = require("../../models/cartModel");
const Order = require("../../models/orderModel");

const router = express.Router();

// get my all orders  
router
    .route('/:_id/orders')
    .get(async (req, res) => {
        const { _id } = req.params
        await Order
            .find({ buyer: _id })
            .populate('seller buyer items.product')
            .sort('-createdAt')
            .then((orders) => {
                res.json({
                    status: "success",
                    message: "fetched my orders",
                    orders
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

// create new order  
router
    .route('/order/create')
    .post(async (req, res) => {
        const { sellerId, buyerId, total, items, buyerAddress, deliveryCharges } = req.body
        await Order
            .create({ seller: sellerId, buyer: buyerId, total, deliveryCharges, items, buyerAddress })
            .then((order) => {
                // empty user cart
                Cart.findOneAndUpdate({ ownedBy: buyerId }, { 'items': [] })
                    .then()
                    .catch((err) => console.log(err))

                res.json({
                    status: "success",
                    message: "order successful",
                    order
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

module.exports = router