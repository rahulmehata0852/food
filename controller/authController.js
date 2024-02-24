const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Auth = require("../model/Auth")
const profileUpload = require("../utils/profileUpload")

exports.registerUser = asyncHandler(async (req, res) => {
    profileUpload(req, res, async (err) => {
        const { email, password, name } = req.body

        if (validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(name)) {
            return res.status(400).json({ message: "All field are required" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter valid email" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Enter strong password" })
        }

        const result = await Auth.findOne({ email })
        if (result) {
            return res.status(400).json({ message: "Email already register with us" })
        }

        const hashPass = await bcrypt.hash(password, 10)
        // createUser
        const createUser = await Auth.create({ name, email, password: hashPass, user: req.file.filename, role: "user" })
        const token = jwt.sign({ id: createUser._id }, process.env.JWT_KEY, { expiresIn: "7d" })
        res.cookie("user", token)
        res.status(201).json({ message: "Register Success", result: { name, email, _id: createUser._id, user: req.file.filename } })
    })

})



exports.loginUser = asyncHandler(async (req, res) => {

    const { email, password, role } = req.body
    if (validator.isEmpty(email), validator.isEmpty(password)) {
        return res.status(400).json({ message: "All field are required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Enter valid email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Enter strong password" })
    }

    const result = await Auth.findOne({ email })
    console.log(result);
    if (!result) {
        return res.status(400).json({ message: "Email not found" })
    }
    if (result.role === 'admin' && role === "admin") {
        const comparePass = await bcrypt.compare(password, result.password)
        if (!comparePass) {
            return res.status(400).json({ message: "Oh owner, Wrong password" })
        }
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, { expiresIn: "7d" })
        res.cookie("admin", token)
        return res.status(201).json({ message: "Admin Login Success", result: { name: result.name, email: result.email, _id: result._id, user: result.user, role: "admin" } })
    }


    const comparePass = await bcrypt.compare(password, result.password)
    if (!comparePass) {
        return res.status(400).json({ message: "Wrong password" })
    }
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, { expiresIn: "7d" })
    res.cookie("user", token)
    res.status(201).json({ message: "Login Success", result: { name: result.name, email: result.email, _id: result._id, user: result.user, role: "user" } })
})


exports.logOut = asyncHandler(async (req, res) => {

    res.clearCookie("user")
    res.clearCookie("admin")
    res.status(200).json({ message: "Log Out success" })
})