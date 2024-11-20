const pool = require("../config/dbConfig");

/**
 * Retrieves all inventory items from the database and sends them as a JSON response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
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

/**
 * Retrieves an inventory item by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.id - The ID of the inventory item to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
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

/**
 * Creates a new inventory item.
 *
 * @async
 * @function createInventoryItem
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The name of the inventory item.
 * @param {number} req.body.cost - The cost of the inventory item.
 * @param {number} req.body.max_qty - The maximum quantity of the inventory item.
 * @param {number} req.body.qty - The current quantity of the inventory item.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - Throws an error if there is an issue with the database query.
 */
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

/**
 * Updates an inventory item in the database.
 *
 * @async
 * @function updateInventoryItem
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the inventory item to update.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The new name of the inventory item.
 * @param {number} req.body.cost - The new cost of the inventory item.
 * @param {number} req.body.max_qty - The new maximum quantity of the inventory item.
 * @param {number} req.body.qty - The new quantity of the inventory item.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the inventory item is updated.
 * @throws {Error} - Throws an error if there is an issue with the database query.
 */
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

/**
 * Deletes an inventory item from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the inventory item to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the item is deleted.
 *
 * @throws {Error} - If there is an error during the deletion process.
 */
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
