const mongoose = require("mongoose")



const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "users"
    },
    cartId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "carts"
    },
    address: {
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pcode: {
            type: String,
            required: true
        },
        lmark: {
            type: String,
            required: true
        }
    },
    mode: {
        type: String,
        required: true,
        enum: ["cod", "pay"]
    },
    order_id: String,
    status: {
        type: String,
        required: true,
        enum: ["processing", "dispatched", "delivered"]
    },
    isPaid: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})


module.exports = mongoose.model("orders", orderSchema)