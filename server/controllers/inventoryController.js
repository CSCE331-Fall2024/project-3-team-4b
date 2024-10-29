const pool = require("../config/dbConfig");

const getInventoryItems = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM inventory ORDER BY inventory_id ASC"
		);
		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const getInventoryItemById = async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await pool.query(
			"SELECT * FROM inventory WHERE inventory_id = $1",
			[id]
		);
		if (rows.length === 0) {
			res.status(404).json({ error: "Error 404: Item Not Found" });
		} else {
			res.status(200).json(rows[0]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const createInventoryItem = async (req, res) => {
	try {
		const { name, cost, max_qty, qty } = req.body;
		const { rows } = await pool.query(
			"INSERT INTO inventory (name, cost, max_qty, qty) VALUES ($1, $2, $3, $4) RETURNING *",
			[name, cost, max_qty, qty]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const updateInventoryItem = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, cost, max_qty, qty } = req.body;
		const { rows } = await pool.query(
			"UPDATE inventory SET name = $1, cost = $2, max_qty = $3, qty = $4 WHERE inventory_id = $5 RETURNING *",
			[name, cost, max_qty, qty, id]
		);
		if (rows.length === 0) {
			res.status(404).json({ error: "Error 404: Item Not Found" });
		} else {
			res.status(200).json(rows[0]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const deleteInventoryItem = async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await pool.query(
			"DELETE FROM inventory WHERE inventory_id = $1 RETURNING *",
			[id]
		);
		if (rows.length === 0) {
			res.status(404).json({ error: "Error 404: Item Not Found" });
		} else {
			res
				.status(200)
				.json({ message: "Status 200: Item Deleted Successfully" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

module.exports = {
	getInventoryItems,
	getInventoryItemById,
	createInventoryItem,
	updateInventoryItem,
	deleteInventoryItem,
};
