const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController");

// CRUD cơ bản
router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);

// 👉 cập nhật trạng thái đơn hàng
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
