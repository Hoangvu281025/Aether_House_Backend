const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController");
const  middlewares  = require('../middlewares/middlewares');

// CRUD cơ bản
router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);

// 👉 cập nhật trạng thái đơn hàng
router.patch("/:id/status", orderController.updateOrderStatus);


router.get("/me/list",middlewares.verifyToken, orderController.getMyOrders); 
module.exports = router;
