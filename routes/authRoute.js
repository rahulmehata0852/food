const { registerUser, loginUser, logOut, continueWithGoogle } = require("../controller/authController")

const router = require("express").Router()


router
    .post("/register-user", registerUser)
    .post("/login-user", loginUser)
    .post("/continueWithGoogle", continueWithGoogle)
    .post("/logOut-user", logOut)


module.exports = router