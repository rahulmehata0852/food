const { getAllUsers, updateUser, getAllOrders, updateOrderStatus } = require("../controller/adminController")
const { getAllDishes, addDishe, updateDish, deleteDish } = require("../controller/dishController")

const router = require("express").Router()



router
    .get("/dishes", getAllDishes)
    .post("/add-dish", addDishe)
    .delete("/delete-dish/:dishId", deleteDish)
    .put("/update-dish/:dishId", updateDish)

    // users
    .get("/users", getAllUsers)
    .put("/update-user/:userId", updateUser)
    .get("/orders", getAllOrders)

    // updateRoute of order admin panel

    .put("/update-order-status/:orderId", updateOrderStatus)





module.exports = router