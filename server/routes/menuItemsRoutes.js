const express = require("express");
const router = express.Router();

/**
 * @module routes/menuItemsRoutes
 * @requires ../controllers/menuItemsController
 */

/**
 * @function getMenuItems
 * @description Retrieves all menu items.
 */

/**
 * @function createMenuItem
 * @description Creates a new menu item.
 */

/**
 * @function updateMenuItem
 * @description Updates an existing menu item.
 */

/**
 * @function deleteMenuItem
 * @description Deletes a menu item.
 */
const {
	getMenuItems,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
} = require("../controllers/menuItemsController");

router.get("/menu-items", getMenuItems);
router.post("/menu-items", createMenuItem);
router.put("/menu-items/:id", updateMenuItem);
router.delete("/menu-items/:id", deleteMenuItem);

module.exports = router;
