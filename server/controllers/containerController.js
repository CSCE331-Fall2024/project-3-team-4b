const pool = require("../config/dbConfig");

// Fetch all container or search by name or type
const getContainers = async (req, res) => {
	try {
		const { search } = req.query;
		let query = "SELECT * FROM container";
		let params = [];

		if (search) {
			query += " WHERE LOWER(name) LIKE LOWER($1) OR LOWER(type) LIKE LOWER($1)";
			params.push(`%${search}%`);
		}

		const { rows } = await pool.query(query, params);
		res.json(rows);
	} catch (error) {
		console.error("Error fetching containers:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Create a new container entry
const createContainer = async (req, res) => {
	const { name, type, capacity } = req.body;
	try {
		const { rows } = await pool.query(
			"INSERT INTO container (name, type, capacity) VALUES ($1, $2, $3) RETURNING *",
			[name, type, capacity]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error creating container:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Update a container by ID
const updateContainer = async (req, res) => {
	const { id } = req.params;
	const { name, type, capacity } = req.body;
	try {
		const { rows } = await pool.query(
			"UPDATE container SET name = $1, type = $2, capacity = $3 WHERE container_id = $4 RETURNING *",
			[name, type, capacity, id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Container not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		console.error("Error updating container:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Delete a container by ID
const deleteContainer = async (req, res) => {
	const { id } = req.params;
	try {
		const { rowCount } = await pool.query(
			"DELETE FROM container WHERE container_id = $1",
			[id]
		);
		if (rowCount === 0) {
			return res.status(404).json({ error: "Container not found" });
		}
		res.json({ message: "Container deleted successfully" });
	} catch (error) {
		console.error("Error deleting container:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getContainers,
	createContainer,
	updateContainer,
	deleteContainer,
};
