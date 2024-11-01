const express = require("express");
const router = express.Router();

const {
	getMenuItems,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
} = require("../controllers/menuController");

router.get("/menu", getMenuItems);
router.post("/menu", createMenuItem);
router.put("/menu/:id", updateMenuItem);
router.delete("/menu/:id", deleteMenuItem);

module.exports = router;
