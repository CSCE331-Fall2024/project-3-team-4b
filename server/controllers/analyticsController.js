const pool = require("../config/dbConfig");

const getLowStockReport = async (req, res) => {
	const limit = parseInt(req.query.limit) || 10;
	console.log(limit);
	const query = `
    SELECT inventory_id, name, cost, max_qty, qty,
    (CAST(qty AS FLOAT) / max_qty) * 100 AS stock_percentage
    FROM inventory
    WHERE qty < max_qty
    ORDER BY stock_percentage ASC LIMIT $1
  `;
	try {
		const result = await pool.query(query, [limit]);
		res.json(result.rows);
		console.log(result.rows);
	} catch (error) {
		console.error("Error generating low stock report:", error);
		res.status(500).json({ error: "Error generating low stock report." });
	}
};

const getHighSalesEmployees = async (req, res) => {
	const { startDate, endDate, limit } = req.query;
	const limitNum = parseInt(limit) || 10;

	if (!startDate || !endDate) {
		return res
			.status(400)
			.json({ error: "Please provide startDate and endDate." });
	}

	const query = `
    SELECT e.employee_id, e.name, e.role, SUM(o.total) AS total_sales
    FROM employees e
    JOIN orders o ON e.employee_id = o.employee_id
    WHERE o.time BETWEEN $1 AND $2
    GROUP BY e.employee_id, e.name, e.role
    ORDER BY total_sales DESC
    LIMIT $3
  `;
	try {
		const result = await pool.query(query, [startDate, endDate, limitNum]);
		res.json(result.rows);
		console.log(result.rows);
	} catch (error) {
		console.error("Error generating high sales employees report:", error);
		res
			.status(500)
			.json({ error: "Error generating high sales employees report." });
	}
};

const getItemSalesReport = async (req, res) => {
	const { startDateTime, endDateTime, limit } = req.query;
	const limitNum = parseInt(limit) || 10;

	if (!startDateTime || !endDateTime) {
		return res
			.status(400)
			.json({ error: "Please provide startDateTime and endDateTime." });
	}

	const query = `
    SELECT m.name AS item_name, m.type AS item_type, SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.quantity * c.price + COALESCE(m.extra_cost, 0)) AS total_sales
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu_items mi ON oi.order_item_id = mi.order_item_id
    JOIN menu m ON mi.menu_id = m.menu_id
    JOIN container c ON oi.container_id = c.container_id
    WHERE o.time BETWEEN $1 AND $2
    GROUP BY m.name, m.type
    ORDER BY total_quantity_sold DESC
    LIMIT $3
  `;
	try {
		const result = await pool.query(query, [
			startDateTime,
			endDateTime,
			limitNum,
		]);
		res.json(result.rows);
		console.log(result.rows);
	} catch (error) {
		console.error("Error generating item sales report:", error);
		res.status(500).json({ error: "Error generating item sales report." });
	}
};

const getHourlySales = async (req, res) => {
	const { date } = req.query;
	let dateString;

	if (date) {
		dateString = date;
	} else {
		const today = new Date();
		dateString = today.toISOString().split("T")[0];
	}

	const query = `
    SELECT DATE_TRUNC('hour', time) AS hour, SUM(total) AS total_sales
    FROM orders
    WHERE CAST(time AS DATE) = $1
    GROUP BY hour
    ORDER BY hour ASC
  `;
	try {
		const result = await pool.query(query, [dateString]);
		res.json(result.rows);
		console.log(result.rows);
	} catch (error) {
		console.error("Error fetching hourly sales data:", error);
		res.status(500).json({ error: "Error fetching hourly sales data." });
	}
};

const getEmployeeOrders = async (req, res) => {
	const { employeeName, date } = req.query;

	if (!employeeName) {
		return res.status(400).json({ error: "Please provide employeeName." });
	}

	if (!date) {
		return res.status(400).json({ error: "Please provide date." });
	}

	try {
		const employeeResult = await pool.query(
			"SELECT employee_id FROM employees WHERE name = $1",
			[employeeName]
		);

		if (employeeResult.rows.length === 0) {
			return res.status(404).json({ error: "Employee not found." });
		}

		const employeeId = employeeResult.rows[0].employee_id;

		const query = `
      SELECT DATE_TRUNC('hour', time) AS hour, COUNT(order_id) as order_count
      FROM orders
      WHERE employee_id = $1 AND CAST(time AS DATE) = $2
      GROUP BY hour
      ORDER BY hour ASC
    `;
		const result = await pool.query(query, [employeeId, date]);
		res.json(result.rows);
		console.log(result.rows);
	} catch (error) {
		console.error("Error fetching employee orders data:", error);
		res.status(500).json({ error: "Error fetching employee orders data." });
	}
};

const getEodReport = async (req, res) => {
	const openingTime = "09:01:00";
	const closingTime = "20:59:00";
	const todayDate = new Date().toISOString().split("T")[0];
	const startDateTime = `${todayDate} ${openingTime}`;
	const endDateTime = `${todayDate} ${closingTime}`;

	try {
		const totalSalesQuery = `
      SELECT SUM(total) as total_sales
      FROM orders
      WHERE time >= $1 AND time <= $2
    `;
		const totalSalesResult = await pool.query(totalSalesQuery, [
			startDateTime,
			endDateTime,
		]);
		const totalSales = totalSalesResult.rows[0].total_sales || 0;

		const employeeOrdersQuery = `
      SELECT e.name, COUNT(o.order_id) as total_orders
      FROM orders o
      JOIN employees e ON o.employee_id = e.employee_id
      WHERE o.time >= $1 AND o.time <= $2
      GROUP BY e.name
      ORDER BY e.name ASC
    `;
		const employeeOrdersResult = await pool.query(employeeOrdersQuery, [
			startDateTime,
			endDateTime,
		]);

		res.json({
			totalSales,
			employeeOrders: employeeOrdersResult.rows,
		});

		console.log(employeeOrdersResult.rows);
	} catch (error) {
		console.error("Error generating EOD report:", error);
		res.status(500).json({ error: "Error generating EOD report." });
	}
};

module.exports = {
	getLowStockReport,
	getHighSalesEmployees,
	getItemSalesReport,
	getHourlySales,
	getEmployeeOrders,
	getEodReport,
};
