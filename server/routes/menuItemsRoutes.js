const express = require("express");
const router = express.Router();

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
