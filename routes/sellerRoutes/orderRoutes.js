const express = require("express");
const Order = require("../../models/orderModel");

const router = express.Router();

// get my all orders  
router
    .route('/:_id/orders')
    .get(async (req, res) => {
        const { _id } = req.params
        await Order
            .find({ seller: _id })
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

// edit order

// update order status
router
    .route('/order/update_status')
    .post(async (req, res) => {
        const { orderId, status } = req.body
        await Order
            .findOneAndUpdate({ _id: orderId }, { 'status': status }, { new: true })
            .populate('seller buyer items.product')
            .then((order) => {
                res.json({
                    status: "success",
                    message: "order updated successfully",
                    order
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

// update order delivery dates
router
    .route('/order/update_date')
    .post(async (req, res) => {
        const { orderId, date } = req.body
        await Order
            .findOneAndUpdate({ _id: orderId }, { 'deliveryDate': date }, { new: true })
            .populate('seller buyer items.product')
            .then((order) => {
                res.json({
                    status: "success",
                    message: "order updated successfully",
                    order
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })


module.exports = router