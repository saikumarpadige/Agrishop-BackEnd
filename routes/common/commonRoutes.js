const express = require("express")
const bcrypt = require('bcryptjs')
const fast2sms = require('fast-two-sms')
const User = require("../../models/userModel");
const Seller = require("../../models/sellerModel");

const router = express.Router();

// send otp
router
    .route('/send_otp')
    .post(async (req, res) => {
        const { mobileNo, role } = req.body

        if (!mobileNo || !role) {
            return res
                .json({
                    status: "failed",
                    message: "Mobile number required"
                })
        }

        if (mobileNo.length !== 10) {
            return res
                .json({
                    status: "failed",
                    message: "Enter valid mobile number"
                })
        }

        if (role == 'buyer') {
            await User
                .findOne({ mobileNo: mobileNo })
                .then(async (user) => {
                    if (!user) {
                        return res
                            .json({
                                status: "failed",
                                message: "Account doesn't exist"
                            })
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            await Seller
                .findOne({ mobileNo: mobileNo })
                .then(async (user) => {
                    if (!user) {
                        return res
                            .json({
                                status: "failed",
                                message: "Account doesn't exist"
                            })
                    }
                })
                .catch(err => console.log(err))
        }

        // generate otp
        let otp = (Math.floor(100000 + Math.random() * 900000)).toString()

        // send otp sms on mobile

        const from = "Agri Shop"
        const text = 'Agrishop \nOTP for reset password is ' + otp

        var options = {
            authorization: process.env.FAST2SMS_API_KEY,
            message: text,
            numbers: [mobileNo],
            sender_id: from
        }
        const response = await fast2sms.sendMessage(options)
        if (response.return == true) {
            return res
                .json({
                    status: "success",
                    message: "OTP sent to mobile",
                    otp
                })
        }
        else {
            return res
                .json({
                    status: "failed",
                    message: "Sorry OTP could not be sent, Please try again later"
                })
        }


    })

// reset user passsword
router
    .route('/reset_password')
    .post(async (req, res) => {
        const { mobileNo, password, role } = req.body

        if (!mobileNo || !password || !role) {
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

        const hashPassword = await bcrypt.hash(password, 12)
        if (role == 'buyer') {
            await User
                .findOneAndUpdate({ mobileNo: mobileNo }, { password: hashPassword })
                .then(async () => {
                    return res
                        .status(201)
                        .json({
                            status: "success",
                            message: "Password successfully updated",
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            await Seller
                .findOneAndUpdate({ mobileNo: mobileNo }, { password: hashPassword })
                .then(async () => {
                    return res
                        .status(201)
                        .json({
                            status: "success",
                            message: "Password successfully updated",
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    })

// Update Profile
router
    .route('/update_profile')
    .post(async (req, res) => {

        const { userId, name, mobileNo, address, shopname, role } = req.body

        if (!name.trim() || !mobileNo || !userId || !address.trim()) {
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
        if (role === 'seller' && !shopname.trim()) {
            return res
                .json({
                    status: "failed",
                    message: "All fields are required."
                })
        }

        if (role == 'buyer') {
            await User
                .findOne({ _id: { $ne: userId }, mobileNo: mobileNo })
                .then(async (user) => {
                    if (user) {
                        return res.json({
                            status: "failed",
                            message: "Account already exist with mobile number"
                        })
                    } else {
                        await User
                            .findByIdAndUpdate({ _id: userId }, { name, mobileNo, address }, { new: true })
                            .then(async (user) => {
                                user.password = undefined
                                return res
                                    .status(201)
                                    .json({
                                        status: "success",
                                        message: "Profile successfully updated",
                                        user
                                    })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            await Seller
                .findOne({ _id: { $ne: userId }, mobileNo: mobileNo })
                .then(async (user) => {
                    if (user) {
                        return res.json({
                            status: "failed",
                            message: "Account already exist with mobile number"
                        })
                    } else {
                        await Seller
                            .findByIdAndUpdate({ _id: userId }, { name, mobileNo, address, shopname }, { new: true })
                            .then(async (user) => {
                                user.password = undefined
                                return res
                                    .status(201)
                                    .json({
                                        status: "success",
                                        message: "Profile successfully updated",
                                        user
                                    })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
                .catch(err => console.log(err))
        }


    })

//Change Password
router
    .route('/change_password')
    .post(async (req, res) => {
        const { userId, oldPassword, newPassword, role } = req.body

        if (!oldPassword || !newPassword || !userId) {
            return res
                .json({
                    status: "failed",
                    message: "All fields are required."
                })
        }

        if (newPassword.length < 8) {
            return res
                .json({
                    status: "failed",
                    message: "Password must contain atleast 8 characters"
                })
        }

        const hashPassword = await bcrypt.hash(newPassword, 12)
        if (role == 'buyer') {
            await User
                .findById(userId)
                .then((user) => {
                    bcrypt
                        .compare(oldPassword, user.password)
                        .then(async (match) => {
                            if (match) {
                                await User
                                    .findByIdAndUpdate(userId, { password: hashPassword }, { new: true })
                                    .then(() => {
                                        return res
                                            .json({
                                                status: "success",
                                                message: "Password successfully updated"
                                            })
                                    })
                                    .catch(err => console.log(err))
                            } else {
                                return res
                                    .json({
                                        status: "failed",
                                        message: "Incorrect old password"
                                    })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            await Seller
                .findById(userId)
                .then((user) => {
                    bcrypt
                        .compare(oldPassword, user.password)
                        .then(async (match) => {
                            if (match) {
                                await Seller
                                    .findByIdAndUpdate(userId, { password: hashPassword }, { new: true })
                                    .then(() => {
                                        return res
                                            .json({
                                                status: "success",
                                                message: "Password successfully updated"
                                            })
                                    })
                                    .catch(err => console.log(err))
                            } else {
                                return res
                                    .json({
                                        status: "failed",
                                        message: "Incorrect old password"
                                    })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    })
module.exports = router;