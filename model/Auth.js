const mongoose = require("mongoose")


const authSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    user: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    active: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("users", authSchema)