const { registerUser, loginUser, logOut } = require("../controller/authController")

const router = require("express").Router()


router
    .post("/register-user", registerUser)
    .post("/login-user", loginUser)
    .post("/logOut-user", logOut)


module.exports = router