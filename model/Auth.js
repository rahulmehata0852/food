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
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("users", authSchema)