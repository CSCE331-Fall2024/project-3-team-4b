const express = require("express");
const router = express.Router();

const {
	getEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
} = require("../controllers/employeesController");

router.get("/employees", getEmployees);
router.post("/employees", createEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

module.exports = router;
