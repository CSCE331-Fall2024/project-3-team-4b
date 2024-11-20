const express = require("express");
const router = express.Router();

/**
 * @module orderItemsRoutes
 * @requires ../controllers/orderItemsController
 */

/**
 * @function getOrderItems
 * @description Retrieves order items from the database.
 */

/**
 * @function createOrderItem
 * @description Creates a new order item in the database.
 */

/**
 * @function updateOrderItem
 * @description Updates an existing order item in the database.
 */

/**
 * @function deleteOrderItem
 * @description Deletes an order item from the database.
 */
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
