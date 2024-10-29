const express = require("express");
const router = express.Router();

const {
	getmenuItems,
	getmenuItemById,
	createmenuItem,
	updatemenuItem,
	deletemenuItem,
} = require("../controllers/menuController");

router.get("/menu", getmenuItems);
router.get("/menu/:id", getmenuItemById);
router.post("/menu", createmenuItem);
router.put("/menu/:id", updatemenuItem);
router.delete("/menu/:id", deletemenuItem);

module.exports = router;
