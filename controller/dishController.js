const asyncHandler = require("express-async-handler")
// const Dish = require("../model/Dish")
const fs = require("fs/promises")
const path = require("path")
const dishUpload = require("../utils/dishUpload")
const { Dish } = require("../model/Dish")


exports.getAllDishes = asyncHandler(async (req, res) => {
    const result = await Dish.find()
    res.json({ message: "dish fetch success", result })
})


exports.addDishe = asyncHandler(async (req, res) => {


    const { name, price, desc, hero } = req.body

    dishUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || "unable to upload img " })
        }
        console.log(req.body.desc);
        const imgName = req.file.filename
        await Dish.create({ name: req.body.name, desc: req.body.desc, price: req.body.price, hero: imgName, class: req.body.class })
        res.status(201).json({ message: "dish add success" })
    })
})




exports.deleteDish = asyncHandler(async (req, res) => {
    const { dishId } = req.params
    if (!dishId) {
        res.status(400).json({ message: "No id found" })
    }
    const result = await Dish.findById(dishId)

    if (!result) {
        res.status(400).json({ message: "provide valid id" })
    }

    await fs.unlink(path.join(__dirname, "..", "dishes", result.hero))

    await Dish.findByIdAndDelete(dishId)
    res.json({ message: "Dish delete success" })
})



exports.updateDish = asyncHandler(async (req, res) => {

    dishUpload(req, res, async (err) => {

        const { dishId } = req.params

        if (req.file) {
            if (err) {
                return res.status(400).json({ message: err.message })
            }
            const result = await Dish.findById(dishId)
            await fs.unlink(path.join(__dirname, "..", "dishes", result.hero))
            await Dish.findByIdAndUpdate(dishId, { ...req.body, hero: req.file.filename })
            return res.json({ message: "Dish update success" })
        }

        await Dish.findByIdAndUpdate(dishId, req.body)
        res.json({ message: "Dish update success" })
    })


})



