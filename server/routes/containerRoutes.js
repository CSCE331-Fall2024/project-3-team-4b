const express = require("express");
const router = express.Router();

const {
	getContainers,
	createContainer,
	updateContainer,
	deleteContainer,
} = require("../controllers/containerController");

router.get("/containers", getContainers);
router.post("/containers", createContainer);
router.put("/containers/:id", updateContainer);
router.delete("/containers/:id", deleteContainer);

module.exports = router;
