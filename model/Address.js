const mongoose = require("mongoose")


const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "users"
    },
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
})


module.exports = mongoose.model("addresses", addressSchema)
