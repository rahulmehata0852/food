const multer = require("multer")
const path = require("path")
const { v4: uuid } = require("uuid")


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const x = uuid() + path.extname(file.originalname)
        cb(null, x)
    },
    destination: (req, file, cb) => {
        cb(null, "dishes")
    },
})

module.exports = multer({ storage }).single("hero")


