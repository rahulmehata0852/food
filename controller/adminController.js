const asyncHandler = require("express-async-handler")
const Auth = require("../model/Auth")
const validator = require("validator")
const Order = require("../model/Order")

exports.getAllUsers = asyncHandler(async (req, res) => {
    const result = await Auth.find()
    res.status(200).json({ message: "User fetch Success", result })
})


exports.updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (validator.isEmpty(userId)) {
        return res.status(400).json({ message: "User id required" })
    }

    await Auth.findByIdAndUpdate(userId, req.body)
    res.status(200).json({ message: "User update success" })
})


exports.getAllOrders = asyncHandler(async (req, res) => {


    const result = await Order.find().populate("userId").populate("cartId")

    // let totalData = [...result]

    // for (let i = 0; i < result.length; i++) {
    //     const user = await Auth.findById(result[i].userId)
    //     totalData[i].userName = user.name
    // }

    console.log(result);
    res.json({ message: "Order fetch success", result })
})


exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { mode, status } = req.body
    if (validator.isEmpty(status) || validator.isEmpty(mode)) {
        return res.status(400).json({ message: "Status and mode is required" })
    }


    if (status === "delivered" && mode === "cod") {

        await Order.findByIdAndUpdate(orderId, { status, isPaid: true })
        return res.json({ message: "Status update Success" })
    }


    await Order.findByIdAndUpdate(orderId, { status })
    res.json({ message: "Status update Success" })
})

