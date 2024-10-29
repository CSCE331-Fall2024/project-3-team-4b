const express = require("express");
const router = express.Router();
const { getMenuItems } = require("../controllers/menuItemsController");

router.get("/menuItems", getMenuItems);

module.exports = router;
