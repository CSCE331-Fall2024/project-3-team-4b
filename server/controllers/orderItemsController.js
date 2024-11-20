const pool = require("../config/dbConfig");

/**
 * Retrieves all order items from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
const getOrderItems = async (req, res) => {
	try {
		const { rows } = await pool.query("SELECT * FROM order_items");
		res.status(200).json(rows);
	} catch (error) {
		console.error("Error fetching order items:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Creates a new order item.
 *
 * @async
 * @function createOrderItem
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {number} req.body.order_id - The ID of the order.
 * @param {number} req.body.quantity - The quantity of the order item.
 * @param {number} req.body.container_id - The ID of the container.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - Throws an error if there is an issue creating the order item.
 */
const createOrderItem = async (req, res) => {
	const { order_id, quantity, container_id } = req.body;
	try {
		const { rows } = await pool.query(
			"INSERT INTO order_items (order_id, quantity, container_id) VALUES ($1, $2, $3) RETURNING *",
			[order_id, quantity, container_id]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error creating order item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Updates an order item in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the order item to update.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.order_id - The ID of the order associated with the order item.
 * @param {number} req.body.quantity - The quantity of the order item.
 * @param {string} req.body.container_id - The ID of the container associated with the order item.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the order item is updated.
 */
const updateOrderItem = async (req, res) => {
	const { id } = req.params;
	const { order_id, quantity, container_id } = req.body;
	try {
		const { rows } = await pool.query(
			"UPDATE order_items SET order_id = $1, quantity = $2, container_id = $3 WHERE order_item_id = $4 RETURNING *",
			[order_id, quantity, container_id, id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Order item not found" });
		}
		res.status(200).json(rows[0]);
	} catch (error) {
		console.error("Error updating order item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Deletes an order item by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the order item to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the order item is deleted.
 *
 * @throws {Error} - If there is an error during the deletion process.
 */
const deleteOrderItem = async (req, res) => {
	const { id } = req.params;
	try {
		const { rows } = await pool.query(
			"DELETE FROM order_items WHERE order_item_id = $1 RETURNING *",
			[id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Order item not found" });
		}
		res.status(200).json({ message: "Order item deleted successfully" });
	} catch (error) {
		console.error("Error deleting order item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getOrderItems,
	createOrderItem,
	updateOrderItem,
	deleteOrderItem,
};

