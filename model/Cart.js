const mongoose = require("mongoose")
const { dishSchema } = require("./Dish")


const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId
    },
    dishes: [
        {
            name: String,
            price: String,
            hero: String,
            class: String,
            qty: {
                type: Number,
                default: 1
            },

        }
    ],
    isComplete: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    })




module.exports = mongoose.model("carts", cartSchema)


