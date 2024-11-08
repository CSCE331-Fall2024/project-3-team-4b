// menuController.js
const pool = require("../config/dbConfig");

const getMenuItems = async (req, res) => {
	try {
		const searchQuery = req.query.search;
		let query = "SELECT * FROM menu";
		let params = [];

		if (searchQuery) {
			query += " WHERE name ILIKE $1";
			params.push(`%${searchQuery}%`);
		}

		const { rows } = await pool.query(query, params);
		res.status(200).json(rows);
	} catch (error) {
		console.error("Error fetching menu items:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const createMenuItem = async (req, res) => {
	const { type, extra_cost, name, calories } = req.body;
	try {
		const { rows } = await pool.query(
			"INSERT INTO menu (type, extra_cost, name, calories) VALUES ($1, $2, $3, $4) RETURNING *",
			[type, extra_cost, name, calories]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error creating menu item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const updateMenuItem = async (req, res) => {
	const { id } = req.params;
	const { type, extra_cost, name, calories } = req.body;
	try {
		const { rows } = await pool.query(
			"UPDATE menu SET type = $1, extra_cost = $2, name = $3, calories = $4 WHERE menu_id = $5 RETURNING *",
			[type, extra_cost, name, calories, id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Menu item not found" });
		}
		res.status(200).json(rows[0]);
	} catch (error) {
		console.error("Error updating menu item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const deleteMenuItem = async (req, res) => {
	const { id } = req.params;
	try {
		const { rows } = await pool.query(
			"DELETE FROM menu WHERE menu_id = $1 RETURNING *",
			[id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Menu item not found" });
		}
		res.status(200).json({ message: "Menu item deleted successfully" });
	} catch (error) {
		console.error("Error deleting menu item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getMenuItems,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
};
