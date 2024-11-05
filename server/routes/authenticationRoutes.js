const express = require("express");
const router = express.Router();

const {
	verifyUserToken,
	verifyRole
} = require("../controllers/authenticationController");

router.post("/verify-token", verifyUserToken);
router.post("/verify-role", verifyRole);

module.exports = router;
