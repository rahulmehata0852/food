const mongoose = require("mongoose")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
const { userProtected } = require("./middleware/userProtected")
require("dotenv").config({ path: "./.env" })


mongoose.connect(process.env.MONGO)

const app = express()
app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static("users"))
app.use(express.static("dishes"))
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin, like mobile apps or curl requests

        if (!origin) return callback(null, true);
        callback(null, true);
    },
    credentials: true
};

app.use(cors(corsOptions));


app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/admin", require("./routes/dishRoute"))
app.use("/api/user", userProtected, require("./routes/userRoute"))



app.use("*", (req, res) => {
    console.log('Wildcard');
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    // res.status(404).json({ message: "No resource found" })
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: err.message })
})


mongoose.connection.once("open", (req, res) => {
    console.log(`Mongoose connected ${process.env.PORT} `)
    app.listen(process.env.PORT, () => {
        console.log("Server running");
    })
})

