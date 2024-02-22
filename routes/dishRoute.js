const { getAllDishes, addDishe, updateDish, deleteDish } = require("../controller/dishController")

const router = require("express").Router()



router
    .get("/dishes", getAllDishes)
    .post("/add-dish", addDishe)
    .delete("/delete-dish/:dishId", deleteDish)
    .put("/update-dish/:dishId", updateDish)





module.exports = router