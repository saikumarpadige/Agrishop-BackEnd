const express = require("express")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const Seller = require("../../models/sellerModel")

const router = express.Router();

// user signup route and its handeler
router
    .route('/signup')
    .post(async (req, res) => {
        const { name, shopname, password, address, mobileNo } = req.body

        if (!name || !shopname || !password || !address || !mobileNo) {
            return res
                .json({
                    status: "failed",
                    message: "All fields are required."
                })
        }

        if (mobileNo.length !== 10) {
            return res
                .json({
                    status: "failed",
                    message: "Enter valid mobile number"
                })
        }

        if (password.length < 8) {
            return res
                .json({
                    status: "failed",
                    message: "Password must contain atleast 8 characters"
                })
        }

        await Seller
            .findOne({ mobileNo: mobileNo })
            .then(async (user) => {
                if (user) {
                    return res
                        .json({
                            status: "failed",
                            message: "Account with that mobile number already exists"
                        })
                } else {
                    const hashPassword = await bcrypt.hash(password, 12)
                    await Seller
                        .create({
                            name: name,
                            shopname: shopname,
                            mobileNo: parseInt(mobileNo),
                            address: address,
                            password: hashPassword
                        })
                        .then((user) => {
                            user.password = undefined
                            return res
                                .status(201)
                                .json({
                                    status: "success",
                                    message: "Account created succesfully",
                                    user
                                })
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                }
            })
            .catch((err) => {
                console.log(err)
            })

    })

// user signin route and its handeler
router
    .route('/signin')
    .post(async (req, res) => {
        const { mobileNo, password } = req.body

        if (!mobileNo || !password) {
            return res
                .json({
                    status: "failed",
                    message: "All fields are required"
                })
        }

        if (mobileNo.length !== 10) {
            return res
                .json({
                    status: "failed",
                    message: "Enter valid mobile number"
                })
        }

        await Seller
            .findOne({ mobileNo: mobileNo })
            .then((user) => {
                if (!user) {
                    return res
                        .json({
                            status: "failed",
                            message: "Account doesn't exist"
                        })
                } else {
                    bcrypt
                        .compare(password, user.password)
                        .then((match) => {
                            if (match) {
                                user.password = undefined
                                return res
                                    .json({
                                        status: "success",
                                        message: "Login successful",
                                        user
                                    })
                            } else {
                                return res
                                    .json({
                                        status: "failed",
                                        message: "Invalid mobile number or password."
                                    })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }

            })
            .catch((err) => {
                console.log(err)
            })

    })

module.exports = router;