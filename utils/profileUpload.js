const multer = require("multer")
const { v4: uuid } = require("uuid")
const path = require("path")
const Auth = require("../model/Auth")

const storage = multer.diskStorage({
    filename: async (req, file, cb) => {
        const { email } = req.body
        const result = await Auth.findOne({ email })
        if (!result) {
            const x = uuid() + path.extname(file.originalname)
            cb(null, x)
        } else {
            cb({ message: "Email already exits" })
        }
    },
     destination: (req, file, cb) => {
        cb(null, "users")
    },
})



module.exports = multer({ storage }).single("user")