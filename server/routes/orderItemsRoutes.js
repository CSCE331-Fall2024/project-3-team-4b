const express = require("express");
const router = express.Router();

const {
	getOrderItems,
	createOrderItem,
	updateOrderItem,
	deleteOrderItem,
} = require("../controllers/orderItemsController");

router.get("/order-items", getOrderItems);
router.post("/order-items", createOrderItem);
router.put("/order-items/:id", updateOrderItem);
router.delete("/order-items/:id", deleteOrderItem);

module.exports = router;
