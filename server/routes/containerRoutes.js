const express = require("express");
const router = express.Router();

const {
	getAllContainerData,
	createContainer,
	updateContainer,
	deleteContainer,
} = require("../controllers/containerController");

router.get("/containers", getAllContainerData);
router.post("/containers", createContainer);
router.put("/containers/:id", updateContainer);
router.delete("/containers/:id", deleteContainer);

module.exports = router;
