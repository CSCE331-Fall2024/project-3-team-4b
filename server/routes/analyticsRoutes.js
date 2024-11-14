const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/reports/low-stock", analyticsController.getLowStockReport);
router.get(
	"/reports/high-sales-employees",
	analyticsController.getHighSalesEmployees
);
router.get("/reports/item-sales", analyticsController.getItemSalesReport);
router.get("/reports/hourly-sales", analyticsController.getHourlySales);
router.get("/reports/employee-orders", analyticsController.getEmployeeOrders);
router.get("/reports/eod", analyticsController.getEodReport);

module.exports = router;
