const pool = require("../config/dbConfig");

const getOrders = async (req, res) => {
	try {
		const { search } = req.query;
		let query = `
      SELECT o.order_id, o.time, o.total, o.employee_id, e.name AS employee_name
      FROM orders o
      LEFT JOIN employees e ON o.employee_id = e.employee_id
    `;
		let params = [];

		if (search) {
			query +=
				" WHERE CAST(o.order_id AS TEXT) LIKE $1 OR LOWER(e.name) LIKE LOWER($1)";
			params.push(`%${search}%`);
		}

		query += " ORDER BY o.order_id";

		const { rows } = await pool.query(query, params);
		res.json(rows);
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const createOrder = async (req, res) => {
	const { time, total, employee_id } = req.body;
	try {
		const { rows } = await pool.query(
			"INSERT INTO orders (time, total, employee_id) VALUES ($1, $2, $3) RETURNING *",
			[time, total, employee_id]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const updateOrder = async (req, res) => {
	const { id } = req.params;
	const { time, total, employee_id } = req.body;
	try {
		const { rows } = await pool.query(
			"UPDATE orders SET time = $1, total = $2, employee_id = $3 WHERE order_id = $4 RETURNING *",
			[time, total, employee_id, id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Order not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		console.error("Error updating order:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const deleteOrder = async (req, res) => {
	const { id } = req.params;
	try {
		const { rowCount } = await pool.query(
			"DELETE FROM orders WHERE order_id = $1",
			[id]
		);
		if (rowCount === 0) {
			return res.status(404).json({ error: "Order not found" });
		}
		res.json({ message: "Order deleted successfully" });
	} catch (error) {
		console.error("Error deleting order:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getOrders,
	createOrder,
	updateOrder,
	deleteOrder,
};
