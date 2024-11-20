const express = require("express");
const router = express.Router();

/**
 * Routes for employee-related operations.
 * 
 * @module routes/employeesRoutes
 * @requires ../controllers/employeesController
 */

/**
 * @function getEmployees
 * @description Retrieves a list of employees.
 */

/**
 * @function createEmployee
 * @description Creates a new employee.
 */

/**
 * @function updateEmployee
 * @description Updates an existing employee.
 */

/**
 * @function deleteEmployee
 * @description Deletes an employee.
 */
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
