const express = require("express");
const router = express.Router();
const {
	getOrders,
	createOrder,
	updateOrder,
	deleteOrder,
} = require("../controllers/orderController");

router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

module.exports = router;
