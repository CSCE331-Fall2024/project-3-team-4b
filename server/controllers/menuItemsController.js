const pool = require("../config/dbConfig");

const getMenuItems = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM menu_items");
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createMenuItem = async (req, res) => {
	const { order_item_id, menu_id } = req.body;
	try {
		const result = await pool.query(
			"INSERT INTO menu_items (order_item_id, menu_id) VALUES ($1, $2) RETURNING *",
			[order_item_id, menu_id]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateMenuItem = async (req, res) => {
	const { id } = req.params;
	const { order_item_id, menu_id } = req.body;
	try {
		const result = await pool.query(
			"UPDATE menu_items SET order_item_id = $1, menu_id = $2 WHERE menu_item_id = $3 RETURNING *",
			[order_item_id, menu_id, id]
		);
		if (result.rows.length === 0)
			return res.status(404).json({ error: "Menu item not found" });
		res.status(200).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteMenuItem = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query(
			"DELETE FROM menu_items WHERE menu_item_id = $1 RETURNING *",
			[id]
		);
		if (result.rows.length === 0)
			return res.status(404).json({ error: "Menu item not found" });
		res.status(200).json({ message: "Menu item deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	getMenuItems,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
};
