const pool = require("../config/dbConfig");

const getmenuItems = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM menu ORDER BY menu_id ASC"
		);
		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const getmenuItemById = async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await pool.query(
			"SELECT * FROM menu WHERE menu_id = $1",
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

const createmenuItem = async (req, res) => {
	try {
		const {type, extra_cost, name, calories} = req.body;
		const { rows } = await pool.query(
			"INSERT INTO menu (type, extra_cost, name, calories) VALUES ($1, $2, $3, $4) RETURNING *",
			[type, extra_cost, name, calories]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const updatemenuItem = async (req, res) => {
	try {
		const { menu_id } = req.params;
		const {type, extra_cost, name, calories} = req.body;
		const { rows } = await pool.query(
			"UPDATE menu SET type = $2, extra_cost = $3, name = $4 calories = $5 WHERE menu_id = $1 RETURNING *",
			[menu_id, type, extra_cost, name, calories]
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

const deletemenuItem = async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await pool.query(
			"DELETE FROM menu WHERE menu_id = $1 RETURNING *",
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
	getmenuItems,
	getmenuItemById,
	createmenuItem,
	updatemenuItem,
	deletemenuItem,
};
