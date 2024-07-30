const asyncHandler = require("express-async-handler")
// const Dish = require("../model/Dish")
const Cart = require("../model/Cart")
const validator = require("validator")
const { Dish } = require("../model/Dish")
const { findByIdAndDelete } = require("../model/Auth")
const Address = require("../model/Address")
const razorpay = require("razorpay")
const crypto = require("crypto")
const { v4: uuid } = require("uuid")
const Order = require("../model/Order")
const Auth = require("../model/Auth")






exports.getProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await Dish.findById(productId)

    res.status(200).json({ message: "Product get Success", result })
})


exports.addCart = asyncHandler(async (req, res) => {
    const { userId, dishes } = req.body
    console.warn(dishes);
    // if (validator.isEmpty(req.body.dishes)) {
    //     return res.status(400).json({ message: "Dishes is required" })
    // }
    const x = await Cart.create({ userId, dishes, isComplete: false })
    res.status(201).json({ message: "addCart success", id: x._id })
})


exports.getUserCart = asyncHandler(async (req, res) => {
    const { cartId } = req.params
    const result = await Cart.findById(cartId)

    res.status(200).json({ message: "cart fetch success", result })
})



exports.updateUserCart = asyncHandler(async (req, res) => {
    const { userId, dishes, qty } = req.body
    const { cartId } = req.params

    const result = await Cart.findOne({ userId })
    if (result && result.dishes.length === 1 && !qty) {
        await Cart.findByIdAndDelete(result._id)
        return res.status(200).json({ message: "Dish close success" })
    }
    await Cart.findByIdAndUpdate(cartId, { dishes })
    res.status(200).json({ message: "cart Update success" })
})



exports.addUserAddress = asyncHandler(async (req, res) => {
    const { fname, lname, email, mobile, address, city, pcode, lmark, userId } = req.body

    let result
    result = await Address.findOne({ pcode })
    if (result) {
        return res.json({ message: "Address already existing", id: result._id })
    } else {
        result = await Address.create({ fname, lname, email, mobile, address, city, pcode, lmark, userId })
        res.status(200).json({ message: "address add success", id: result._id })
    }
})




exports.getUserAddress = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const result = await Address.find({ userId });
    res.status(200).json({ message: "address fetch success", result })
});

exports.getAddresUser = asyncHandler(async (req, res) => {
    const { addressId } = req.params
    const result = await Address.findById(addressId);
    if (!result) {
        return res.status(400).json({ message: "No Address found with this id" })
    }
    res.status(200).json({ message: "address fetch success", result })
});



// orders
exports.placeOrderDish = asyncHandler(async (req, res) => {
    const { userId, cartId, address } = req.body
    console.log(req.body);

    const x = await Order.create({ userId, cartId, address, status: "processing", isPaid: false, mode: "cod" })
    await Cart.findByIdAndUpdate(cartId, { isComplete: false });
    res.status(201).json({ message: "Place order successfully", id: x._id })
})


exports.getUserOrder = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const result = await Order.find({ userId }).populate("cartId");

    res.status(200).json({ message: "Order fetch success", result });
})


exports.getUserCarts = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const result = await Cart.find({ userId, isComplete: false });
    res.status(200).json({ message: "Carts fetch success", result });
})

exports.deleteUserCart = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const { cartId } = req.params;
    const result = await Cart.findByIdAndDelete(cartId);
    res.status(200).json({ message: "Carts delete success", result });
})

exports.getUserOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const result = await Order.findById(orderId).populate("userId").populate("cartId");
    if (!result) {
        return res.status(400).json({ message: "Unable to fetch order" });
    }
    res.status(200).json({ message: "Order Status fetch success", result });
})





// payment


exports.initiatePayment = asyncHandler(async (req, res) => {
    const { amount } = req.body
    const instance = new razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY
    })

    instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: uuid()
    }, (err, order) => {
        if (err) {
            return res.status(500).json({ message: err.message || "unable to proces request" })
        }
        res.status(200).json({ message: "initiate success", id: order.id, totalAmout: amount })

    })
})


exports.payMoney = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, cartId, address, orderId } = req.body

    const key = `${razorpay_order_id}|${razorpay_payment_id}`
    const x = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY).update(key.toString()).digest("hex")
    if (x === razorpay_signature) {
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { isPaid: true, mode: "pay" })
            return res.status(200).json({ message: "Payment success" })
        } else {
            const x = await Order.create({ userId, cartId, address, status: "processing", order_id: razorpay_order_id, isPaid: true, mode: "pay" })
            await Cart.findByIdAndUpdate(cartId, { isComplete: false });
            return res.status(201).json({ message: "order place success", id: x._id })
        }
    } else {
        res.status(400).json({ message: "Unable to complete your payment. plz get in touch with bank" })
    }
})

