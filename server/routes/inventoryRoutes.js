const express = require("express");
const router = express.Router();

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
