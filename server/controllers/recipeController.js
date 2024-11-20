const pool = require("../config/dbConfig");

const getRecipe = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM recipes ORDER BY recipe_id ASC"
		);
		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const getRecipeById = async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await pool.query(
			"SELECT * FROM recipes WHERE recipe_id = $1",
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

const createRecipe = async (req, res) => {
	try {
		const { menu_id, qty, inventory_id } = req.body;
		const { rows } = await pool.query(
			"INSERT INTO recipes (menu_id, qty, inventory_id) VALUES ($1, $2, $3) RETURNING *",
			[menu_id, qty, inventory_id]
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Error 500: Internal Server Error" });
	}
};

const updateRecipe = async (req, res) => {
	try {
		const { recipe_id } = req.params;
		const { menu_id, qty, inventory_id } = req.body;
		const { rows } = await pool.query(
			"UPDATE recipes SET menu_id = $2, qty = $3, inventory_id = $4 WHERE recipe_id = $1 RETURNING *",
			[recipe_id, menu_id, qty, inventory_id]
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

const deleteRecipe = async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await pool.query(
			"DELETE FROM recipes WHERE recipe_id = $1 RETURNING *",
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


const getRecipesByMenuId = async (req, res) => {
	try {
		const { menu_id } = req.params;
		const { rows } = await pool.query(
			`SELECT r.recipe_id, r.menu_id, r.inventory_id, r.qty, i.name, i.cost
       FROM recipes r
       JOIN inventory i ON r.inventory_id = i.inventory_id
       WHERE r.menu_id = $1`,
			[menu_id]
		);
		res.status(200).json(rows);
	} catch (error) {
		console.error("Error fetching recipes by menu_id:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Delete recipes by menu_id
const deleteRecipesByMenuId = async (req, res) => {
	try {
		const { menu_id } = req.params;
		await pool.query("DELETE FROM recipes WHERE menu_id = $1", [menu_id]);
		res.status(200).json({ message: "Recipes deleted successfully" });
	} catch (error) {
		console.error("Error deleting recipes by menu_id:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	getRecipe,
	getRecipeById,
	createRecipe,
	updateRecipe,
	deleteRecipe,
	getRecipesByMenuId,
	deleteRecipesByMenuId,
};
