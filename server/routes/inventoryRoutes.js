const express = require("express");
const router = express.Router();

/**
 * @module inventoryRoutes
 * @requires ../controllers/inventoryController
 */

/**
 * @function getInventoryItems
 * @description Retrieves all inventory items.
 */

/**
 * @function getInventoryItemById
 * @description Retrieves a specific inventory item by its ID.
 * @param {string} id - The ID of the inventory item.
 */

/**
 * @function createInventoryItem
 * @description Creates a new inventory item.
 * @param {Object} item - The inventory item to create.
 */

/**
 * @function updateInventoryItem
 * @description Updates an existing inventory item.
 * @param {string} id - The ID of the inventory item to update.
 * @param {Object} item - The updated inventory item data.
 */

/**
 * @function deleteInventoryItem
 * @description Deletes an inventory item.
 * @param {string} id - The ID of the inventory item to delete.
 */
const {
	getInventoryItems,
	getInventoryItemById,
	createInventoryItem,
	updateInventoryItem,
	deleteInventoryItem,
} = require("../controllers/inventoryController");

router.get("/inventory", getInventoryItems);
router.get("/inventory/:id", getInventoryItemById);
router.post("/inventory", createInventoryItem);
router.put("/inventory/:id", updateInventoryItem);
router.delete("/inventory/:id", deleteInventoryItem);

module.exports = router;
