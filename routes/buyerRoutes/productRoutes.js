const express = require("express")

const Product = require("../../models/productModel");

const router = express.Router();

// get all products 
router
    .route('/products')
    .get(async (req, res) => {

        await Product
            .find({}, { __v: 0 })
            .populate('ownedBy', { password: 0, __v: 0 })
            .then((products) => {
                res.json({
                    status: "success",
                    message: "All products",
                    length: products.length,
                    products: products
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

// search products
router
    .route('/products/search')
    .get(async (req, res) => {
        let { q, category } = req.query
        if (category == 'All') {
            category = ''
        }
        const namePattern = new RegExp('^.*' + q + '.*$', 'i')
        const categoryPattern = new RegExp('^.*' + category + '.*$', 'i')

        await Product
            .find({ $and: [{ name: { $regex: namePattern } }, { category: { $regex: categoryPattern } }] }, { __v: 0 })
            .populate('ownedBy', { password: 0, __v: 0 })
            .then((products) => {
                res.json({
                    status: "success",
                    message: "All products",
                    length: products.length,
                    products: products
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

module.exports = router