const mongoose = require("mongoose")


const dishSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    hero: {
        type: String,
        required: true
    },
    class: {
        type: String,
        default: "veg",
        enum: ["veg", "non-veg"]
    }
})


module.exports = { Dish: mongoose.model("dishes", dishSchema), dishSchema }