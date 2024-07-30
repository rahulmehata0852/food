const { getProduct, addCart, getUserCart, updateUserCart, addUserAddress, getUserAddress, placeOrderDish, getUserOrder, initiatePayment, payMoney, getUserOrderStatus, getAddresUser, getUserCarts, deleteUserCart } = require("../controller/userController")

const router = require("express").Router()


router
    .get("/dish/:productId", getProduct)
    .get("/carts", getUserCarts)
    .delete("/cart-delete/:cartId", deleteUserCart)
    .post("/add-cart", addCart)
    .get("/cart/:cartId", getUserCart)
    .put("/update-cart/:cartId", updateUserCart)

    // address
    .post("/add-address", addUserAddress)
    .get("/address", getUserAddress)
    .get("/user-address/:addressId", getAddresUser)

    // orders

    .post("/place-order", placeOrderDish)
    .get("/user-order", getUserOrder)
    .get("/user-order-status/:orderId", getUserOrderStatus)


    // payment
    .post("/initiatePayment", initiatePayment)
    .post("/pay-money", payMoney)


module.exports = router