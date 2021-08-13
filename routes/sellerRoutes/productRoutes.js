const express = require("express")

const Product = require("../../models/productModel");

const router = express.Router();

//get all products for the seller
router
    .route('/:id/products')
    .get(async (req, res) => {
        const { id } = req.params;
        await Product
            .find({ ownedBy: id }, { __v: 0 })
            .populate('ownedBy', { password: 0, __v: 0 })
            .then((products) => {
                res.json({
                    status: 'success',
                    message: 'Seller products fetched successfully',
                    length: products.length,
                    products: products
                })
            })
            .catch(() => {
                res.json({
                    status: 'failed',
                    message: 'Something went wrong',
                })
            })
    })

// add new product to the products collection and also to the seller 
router
    .route('/addproduct')
    .post(async (req, res) => {
        const { name, price, description, quantity, ownedBy, category, unit } = req.body
        let { image } = req.body

        if (!name || !price || !description || !quantity || !ownedBy || !category || !unit) {
            return res.json({
                status: 'failed',
                message: 'All fields are required'
            })
        }

        // if (image === '') {
        //     image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'
        // }

        if (!/\d/.test(quantity)) {
            return res.json({
                status: 'failed',
                message: 'Quantity must be number'
            })
        }

        if (!/\d/.test(price)) {
            return res.json({
                status: 'failed',
                message: 'Price must be number'
            })
        }

        await Product
            .create({ name, price, description, ownedBy, quantity, category, unit, image })
            .then((product) => {
                res.json({
                    status: 'success',
                    message: 'product added succesfully',
                    product
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })


// Delete the product from products collection and also from seller document
router
    .route('/deleteproduct')
    .post(async (req, res) => {

        const { productId } = req.body

        await Product
            .findByIdAndDelete({ _id: productId })
            .then(() => {
                res.json({
                    status: 'success',
                    message: 'product deleted succesfully'
                })
            })
            .catch((err) => { console.log(err) })
    })

//Modify the product from product collection and also from seller
router
    .route('/updateproduct')
    .post(async (req, res) => {
        const { name, price, description, quantity, productId, category, unit } = req.body
        let { image } = req.body

        if (!name || !price || !description || !quantity || !category || !unit) {
            return res.json({
                status: 'failed',
                message: 'All fields are required'
            })
        }

        if (image === '') {
            image = 'https://listonic.com/wp-content/uploads/2018/12/grocery-bag-1-3.png'
        }

        if (!/\d/.test(quantity)) {
            return res.json({
                status: 'failed',
                message: 'Quantity must be number'
            })
        }

        if (!/\d/.test(price)) {
            return res.json({
                status: 'failed',
                message: 'Price must be number'
            })
        }
        await Product
            .findByIdAndUpdate({ _id: productId }, { name, price, description, quantity, category, unit, image }, { new: true })
            .then((product) => {
                // console.log(product.image)
                res.json({
                    status: 'success',
                    message: 'Product Information updated succesfully',
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

module.exports = router;