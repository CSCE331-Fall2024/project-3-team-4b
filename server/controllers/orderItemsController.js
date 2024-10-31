const pool = require("../config/dbConfig");

const getOrderItems = async (req, res) => {
	try {
		const { rows } = await pool.query("SELECT * FROM order_items");
		res.status(200).json(rows);
	} catch (error) {
		console.error("Error fetching order items:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

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

