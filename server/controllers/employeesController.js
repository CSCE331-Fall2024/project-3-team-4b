const pool = require("../config/dbConfig");

const getEmployees = async (req, res) => {
	try {
		const { search } = req.query;
		let query = "SELECT * FROM employees";
		let params = [];

		if (search) {
			query +=
				" WHERE LOWER(name) LIKE LOWER($1) OR LOWER(role) LIKE LOWER($1)";
			params.push(`%${search}%`);
		}

		const { rows } = await pool.query(query, params);
		res.json(rows);
	} catch (error) {
		console.error("Error fetching employees:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const createEmployee = async (req, res) => {
	const { name, role, salary } = req.body;
	try {
		const { rows } = await pool.query(
			"INSERT INTO employees (name, role, salary) VALUES ($1, $2, $3) RETURNING *",
			[name, role, salary]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error creating employee:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const updateEmployee = async (req, res) => {
	const { id } = req.params;
	const { name, role, salary } = req.body;
	try {
		const { rows } = await pool.query(
			"UPDATE employees SET name = $1, role = $2, salary = $3 WHERE employee_id = $4 RETURNING *",
			[name, role, salary, id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Employee not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		console.error("Error updating employee:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const deleteEmployee = async (req, res) => {
	const { id } = req.params;
	try {
		const { rowCount } = await pool.query(
			"DELETE FROM employees WHERE employee_id = $1",
			[id]
		);
		if (rowCount === 0) {
			return res.status(404).json({ error: "Employee not found" });
		}
		res.json({ message: "Employee deleted successfully" });
	} catch (error) {
		console.error("Error deleting employee:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
};
