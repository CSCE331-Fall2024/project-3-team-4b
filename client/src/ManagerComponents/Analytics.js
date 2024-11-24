import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Snackbar,
	Alert,
	CircularProgress,
	Card,
	CardContent,
	CardActions,
	Grid,
	Paper,
} from "@mui/material";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LabelList,
} from "recharts";
import axios from "axios";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DateRangeIcon from "@mui/icons-material/DateRange";

/**
 * Analytics component for generating and displaying various reports.
 *
 * @returns {JSX.Element} The rendered Analytics component.
 */
function Analytics() {
	const [selectedReport, setSelectedReport] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const [reportParams, setReportParams] = useState({});
	const [reportData, setReportData] = useState(null);
	const [eodData, setEodData] = useState(null);
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "error",
	});
	const [loading, setLoading] = useState(false);

	const reportOptions = [
		{
			value: "lowStock",
			label: "Low Stock Report",
			icon: <InventoryIcon fontSize="large" color="primary" />,
			description: "Identify items with low stock levels.",
		},
		{
			value: "highSalesEmployees",
			label: "Top Performing Employees",
			icon: <PeopleIcon fontSize="large" color="primary" />,
			description: "See which employees have the highest sales.",
		},
		{
			value: "itemSales",
			label: "Product Usage Report",
			icon: <AttachMoneyIcon fontSize="large" color="primary" />,
			description: "Depicts inventory usage for a specified time period.",
		},
		{
			value: "hourlySales",
			label: "Hourly Sales Report (X-Report)",
			icon: <QueryBuilderIcon fontSize="large" color="primary" />,
			description: "View sales data by hour.",
		},
		{
			value: "employeeOrders",
			label: "Employee Orders Report",
			icon: <ReceiptIcon fontSize="large" color="primary" />,
			description: "Track orders processed by an employee.",
		},
		{
			value: "eodReport (Z-Report)",
			label: "End of Day Report",
			icon: <DateRangeIcon fontSize="large" color="primary" />,
			description: "Summary of daily sales and orders.",
		},
	];

	/**
	 * Opens the dialog for generating a report.
	 *
	 * @param {string} report - The selected report type.
	 */
	const handleOpenDialog = (report) => {
		if (report !== selectedReport) {
			setReportParams({});
			setReportData(null);
			setEodData(null);
		}
		setSelectedReport(report);
		setOpenDialog(true);
		setError("");
	};

	/**
	 * Closes the report generation dialog.
	 */
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setError("");
	};

	/**
	 * Handles changes to report parameters input fields.
	 *
	 * @param {Object} e - The event object from the input field.
	 */
	const handleParamChange = (e) => {
		const { name, value } = e.target;
		setReportParams((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * Validates the report parameters based on the selected report.
	 *
	 * @returns {boolean} True if parameters are valid, false otherwise.
	 */
	const validateParams = () => {
		let isValid = true;
		let errorMsg = "";

		switch (selectedReport) {
			case "lowStock":
				const limitLowStock = parseInt(reportParams.limit, 10);
				if (isNaN(limitLowStock) || limitLowStock <= 0) {
					errorMsg = "Limit must be a positive integer.";
					isValid = false;
				}
				break;
			case "highSalesEmployees":
				if (!reportParams.startDate || !reportParams.endDate) {
					errorMsg = "Please provide both start and end dates.";
					isValid = false;
				} else if (
					new Date(reportParams.startDate) > new Date(reportParams.endDate)
				) {
					errorMsg = "Start date cannot be after end date.";
					isValid = false;
				}
				const limitHighSales = parseInt(reportParams.limit, 10);
				if (isNaN(limitHighSales) || limitHighSales <= 0) {
					errorMsg = "Limit must be a positive integer.";
					isValid = false;
				}
				break;
			case "itemSales":
				if (!reportParams.startDateTime || !reportParams.endDateTime) {
					errorMsg = "Please provide both start and end date-times.";
					isValid = false;
				} else if (
					new Date(reportParams.startDateTime) >
					new Date(reportParams.endDateTime)
				) {
					errorMsg = "Start date-time cannot be after end date-time.";
					isValid = false;
				}
				const limitItemSales = parseInt(reportParams.limit, 10);
				if (isNaN(limitItemSales) || limitItemSales <= 0) {
					errorMsg = "Limit must be a positive integer.";
					isValid = false;
				}
				break;
			case "hourlySales":
				if (!reportParams.date) {
					errorMsg = "Please provide a date.";
					isValid = false;
				}
				break;
			case "employeeOrders":
				if (!reportParams.employeeName || !reportParams.date) {
					errorMsg = "Please provide employee name and date.";
					isValid = false;
				}
				break;
			case "eodReport":
				if (!reportParams.date) {
					errorMsg = "Please provide a date.";
					isValid = false;
				}
				break;
			default:
				errorMsg = "Invalid report type.";
				isValid = false;
				break;
		}

		if (!isValid) {
			setError(errorMsg);
		}

		return isValid;
	};

	/**
	 * Parses a date string in 'YYYY-MM-DD HH:MM:SS' format to a Date object.
	 *
	 * @param {string} dateString - The date string to parse.
	 * @returns {Date} The parsed Date object.
	 */
	const parseDateString = (dateString) => {
		const isoString = dateString.replace(" ", "T");
		const date = new Date(isoString);

		date.setTime(date.getTime() + 6 * 60 * 60 * 1000);
		return date;
	};

	/**
	 * Generates the selected report by fetching data from the server.
	 */
	const handleGenerateReport = async () => {
		setError("");
		if (!validateParams()) {
			return;
		}

		setLoading(true);
		try {
			let response;
			switch (selectedReport) {
				case "lowStock":
					response = await axios.get(
						"https://project-3-team-4b-server.vercel.app/api/reports/low-stock",
						{
							params: {
								limit: parseInt(reportParams.limit, 10) || 10,
							},
						}
					);
					// Ensure stock_percentage is a number
					const lowStockData = response.data.map((item) => ({
						...item,
						stock_percentage: Number(item.stock_percentage),
					}));
					setReportData(lowStockData);
					break;
				case "highSalesEmployees":
					response = await axios.get(
						"https://project-3-team-4b-server.vercel.app/api/reports/high-sales-employees",
						{
							params: {
								startDate: reportParams.startDate,
								endDate: reportParams.endDate,
								limit: parseInt(reportParams.limit, 10) || 10,
							},
						}
					);
					// Ensure total_sales is a number
					const highSalesData = response.data.map((item) => ({
						...item,
						total_sales: Number(item.total_sales),
					}));
					setReportData(highSalesData);
					break;
				case "itemSales":
					response = await axios.get(
						"https://project-3-team-4b-server.vercel.app/api/reports/item-sales",
						{
							params: {
								startDateTime: reportParams.startDateTime,
								endDateTime: reportParams.endDateTime,
								limit: parseInt(reportParams.limit, 10) || 10,
							},
						}
					);
					// Ensure total_quantity_sold is a number
					const itemSalesData = response.data.map((item) => ({
						...item,
						total_quantity_sold: Number(item.total_quantity_sold),
					}));
					setReportData(itemSalesData);
					break;
				case "hourlySales":
					response = await axios.get(
						"https://project-3-team-4b-server.vercel.app/api/reports/hourly-sales",
						{
							params: {
								date: reportParams.date,
							},
						}
					);
					// Ensure total_sales is a number and hour is a timestamp
					const hourlySalesData = response.data.map((item) => ({
						...item,
						total_sales: Number(item.total_sales),
						hour: parseDateString(item.hour).getTime(),
					}));
					setReportData(hourlySalesData);
					break;
				case "employeeOrders":
					response = await axios.get(
						"https://project-3-team-4b-server.vercel.app/api/reports/employee-orders",
						{
							params: {
								employeeName: reportParams.employeeName,
								date: reportParams.date,
							},
						}
					);
					// Ensure order_count is a number and hour is a timestamp
					const employeeOrdersData = response.data.map((item) => ({
						...item,
						order_count: Number(item.order_count),
						hour: parseDateString(item.hour).getTime(),
					}));
					setReportData(employeeOrdersData);
					break;
				case "eodReport":
					response = await axios.get(
						"https://project-3-team-4b-server.vercel.app/api/reports/eod",
						{
							params: {
								date: reportParams.date,
							},
						}
					);
					// Ensure totalSales is a number and total_orders in employeeOrders are numbers
					const eodDataResponse = {
						totalSales: Number(response.data.totalSales),
						employeeOrders: response.data.employeeOrders.map((item) => ({
							...item,
							total_orders: Number(item.total_orders),
						})),
					};
					setEodData(eodDataResponse);
					break;
				default:
					setError("Invalid report type.");
					setLoading(false);
					return;
			}
			setOpenDialog(false);
			setSnackbar({
				open: true,
				message: "Report generated successfully.",
				severity: "success",
			});
		} catch (err) {
			console.error(err);
			setSnackbar({
				open: true,
				message: "Error generating report.",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Formatter function for currency values
	 * @param {any} value - The value to format
	 * @returns {string} Formatted currency string
	 */
	const formatCurrency = (value) => {
		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			return `$${numValue.toFixed(2)}`;
		} else {
			return "N/A";
		}
	};

	/**
	 * Renders the content of the report generation dialog based on the selected report.
	 *
	 * @returns {JSX.Element|null} The dialog content elements.
	 */
	const renderDialogContent = () => {
		switch (selectedReport) {
			case "lowStock":
				return (
					<>
						<TextField
							label="Limit"
							name="limit"
							value={reportParams.limit || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="number"
							InputLabelProps={{ shrink: true }}
						/>
					</>
				);
			case "highSalesEmployees":
				return (
					<>
						<TextField
							label="Start Date"
							name="startDate"
							value={reportParams.startDate || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="date"
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="End Date"
							name="endDate"
							value={reportParams.endDate || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="date"
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="Limit"
							name="limit"
							value={reportParams.limit || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="number"
							InputLabelProps={{ shrink: true }}
						/>
					</>
				);
			case "itemSales":
				return (
					<>
						<TextField
							label="Start Date Time"
							name="startDateTime"
							value={reportParams.startDateTime || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="datetime-local"
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="End Date Time"
							name="endDateTime"
							value={reportParams.endDateTime || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="datetime-local"
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="Limit"
							name="limit"
							value={reportParams.limit || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="number"
							InputLabelProps={{ shrink: true }}
						/>
					</>
				);
			case "hourlySales":
				return (
					<>
						<TextField
							label="Date"
							name="date"
							value={reportParams.date || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="date"
							InputLabelProps={{ shrink: true }}
						/>
					</>
				);
			case "employeeOrders":
				return (
					<>
						<TextField
							label="Employee Name"
							name="employeeName"
							value={reportParams.employeeName || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Date"
							name="date"
							value={reportParams.date || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="date"
							InputLabelProps={{ shrink: true }}
						/>
					</>
				);
			case "eodReport":
				return (
					<>
						<TextField
							label="Date"
							name="date"
							value={reportParams.date || ""}
							onChange={handleParamChange}
							fullWidth
							margin="normal"
							type="date"
							InputLabelProps={{ shrink: true }}
						/>
					</>
				);
			default:
				return null;
		}
	};

	/**
	 * Renders the report visualization based on the selected report and fetched data.
	 *
	 * @returns {JSX.Element} The report visualization elements.
	 */
	const renderReportVisualization = () => {
		return (
			<Paper
				sx={{
					minHeight: "500px",
					backgroundColor: "#333",
					color: "#fff",
					height: "100%",
				}}
			>
				{loading ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
						}}
					>
						<CircularProgress color="inherit" />
					</Box>
				) : (
					(() => {
						if (!reportData && !eodData) {
							return (
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "100%",
									}}
								></Box>
							);
						}

						const commonProps = {
							margin: { top: 20, right: 30, left: 80, bottom: 100 },
						};

						switch (selectedReport) {
							case "lowStock":
								return (
									<Box
										sx={{
											height: "100%",
											p: 2,
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Typography variant="h6" gutterBottom>
											Low Stock Items
										</Typography>
										<ResponsiveContainer width="100%" height="90%">
											<BarChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="4 4" stroke="#555" />
												<XAxis
													dataKey="name"
													tick={{ angle: -45, textAnchor: "end", fill: "#fff" }}
													interval={0}
													fontSize={10}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, 100]}
													label={{
														value: "Stock Percentage",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dx: -40,
														dy: 0,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
												/>
												<Bar dataKey="stock_percentage" fill="#D1282E">
													<LabelList
														dataKey="stock_percentage"
														position="top"
														fill="#fff"
														formatter={(value) => `${value.toFixed(1)}%`}
													/>
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</Box>
								);
							case "highSalesEmployees":
								return (
									<Box
										sx={{
											height: "100%",
											p: 2,
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Typography variant="h6" gutterBottom>
											Top Performing Employees
										</Typography>
										<ResponsiveContainer width="100%" height="90%">
											<BarChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="name"
													tick={{ angle: -45, textAnchor: "end", fill: "#fff" }}
													interval={0}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
													label={{
														value: "Total Sales ($)",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dx: -40,
														dy: 0,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
													formatter={formatCurrency}
												/>
												<Bar dataKey="total_sales" fill="#4CAF50">
													<LabelList
														dataKey="total_sales"
														position="top"
														fill="#fff"
														formatter={formatCurrency}
													/>
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</Box>
								);

							case "itemSales":
								return (
									<Box
										sx={{
											height: "100%",
											p: 2,
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Typography variant="h6" gutterBottom>
											Product Usage Chart
										</Typography>
										<ResponsiveContainer width="100%" height="90%">
											<BarChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="item_name"
													tick={{
														angle: -45,
														textAnchor: "end",
														fill: "#fff",
														fontSize: 10, // Reduced font size
													}}
													interval={0}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
													label={{
														value: "Total Quantity Used",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dx: -40,
														dy: 0,
													}}
													allowDataOverflow={false}
												/>

												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
												/>
												<Bar dataKey="total_quantity_sold" fill="#2196F3">
													<LabelList
														dataKey="total_quantity_sold"
														position="top"
														fill="#fff"
													/>
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</Box>
								);
							case "hourlySales":
								return (
									<Box
										sx={{
											height: "100%",
											p: 2,
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Typography variant="h6" gutterBottom>
											Hourly Sales for {reportParams.date}
										</Typography>
										<ResponsiveContainer width="100%" height="90%">
											<LineChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="hour"
													tickFormatter={(tick) => {
														const date = new Date(tick);
														if (!isNaN(date)) {
															return date.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															});
														} else {
															return tick;
														}
													}}
													tick={{ fill: "#fff" }}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
													label={{
														value: "Total Sales ($)",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dx: -40,
														dy: 0,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
													labelFormatter={(label) => {
														const date = new Date(label);
														if (!isNaN(date)) {
															return date.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															});
														} else {
															return label;
														}
													}}
													formatter={formatCurrency}
												/>
												<Line
													type="monotone"
													dataKey="total_sales"
													stroke="#FF9800"
													dot={{ r: 5 }}
													activeDot={{ r: 7 }}
												>
													<LabelList
														dataKey="total_sales"
														position="top"
														fill="#fff"
														formatter={formatCurrency}
													/>
												</Line>
											</LineChart>
										</ResponsiveContainer>
									</Box>
								);
							case "employeeOrders":
								return (
									<Box
										sx={{
											height: "100%",
											p: 2,
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Typography variant="h6" gutterBottom>
											Orders Processed by {reportParams.employeeName} on{" "}
											{reportParams.date}
										</Typography>
										<ResponsiveContainer width="100%" height="90%">
											<LineChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="hour"
													tickFormatter={(tick) => {
														const date = new Date(tick);
														if (!isNaN(date)) {
															return date.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															});
														} else {
															return tick;
														}
													}}
													tick={{ fill: "#fff" }}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[
														(dataMin) => Math.floor(dataMin * 0.9),
														(dataMax) => Math.ceil(dataMax * 1.1),
													]}
													label={{
														value: "Order Count",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dx: -40,
														dy: 0,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
													labelFormatter={(label) => {
														const date = new Date(label);
														if (!isNaN(date)) {
															return date.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															});
														} else {
															return label;
														}
													}}
													formatter={(value) => `${value} orders`}
												/>
												<Line
													type="monotone"
													dataKey="order_count"
													stroke="#9C27B0"
													dot={{ r: 5 }}
													activeDot={{ r: 7 }}
												>
													<LabelList
														dataKey="order_count"
														position="top"
														fill="#fff"
													/>
												</Line>
											</LineChart>
										</ResponsiveContainer>
									</Box>
								);
							case "eodReport":
								if (!eodData) return null;
								const { totalSales, employeeOrders } = eodData;
								return (
									<Box
										sx={{
											height: "100%",
											p: 2,
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Typography variant="h6" gutterBottom>
											End of Day Report for {reportParams.date}
										</Typography>
										<Typography variant="subtitle1" sx={{ mb: 2 }}>
											Total Sales: ${parseFloat(totalSales).toFixed(2)}
										</Typography>
										<Typography variant="subtitle1" sx={{ mt: 2 }}>
											Employee Orders:
										</Typography>
										<ResponsiveContainer width="100%" height="80%">
											<BarChart data={employeeOrders} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="name"
													tick={{ angle: -45, textAnchor: "end", fill: "#fff" }}
													interval={0}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
													label={{
														value: "Total Orders",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dx: -40,
														dy: 0,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
												/>
												<Bar dataKey="total_orders" fill="#FF5722">
													<LabelList
														dataKey="total_orders"
														position="top"
														fill="#fff"
													/>
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</Box>
								);
							default:
								return null;
						}
					})()
				)}
			</Paper>
		);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<Box sx={{ flexGrow: 1 }}>{renderReportVisualization()}</Box>
			<Box sx={{ flexShrink: 0, mb: 4, mt: 4 }}>
				<Grid container spacing={3}>
					{reportOptions.map((report) => (
						<Grid item xs={12} sm={6} md={4} key={report.value}>
							<Card variant="outlined" sx={{ height: "100%" }}>
								<CardContent>
									<Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
										{report.icon}
										<Typography variant="h6" sx={{ ml: 0 }}>
											{report.label}
										</Typography>
									</Box>
									<Typography variant="body2" color="textSecondary">
										{report.description}
									</Typography>
								</CardContent>
								<CardActions>
									<Button
										size="small"
										color="primary"
										onClick={() => handleOpenDialog(report.value)}
									>
										Generate Report
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>

			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>
					{reportOptions.find((r) => r.value === selectedReport)?.label}
				</DialogTitle>
				<DialogContent>
					{renderDialogContent()}
					{error && (
						<Typography color="error" variant="body2" sx={{ mt: 0 }}>
							{error}
						</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button
						variant="contained"
						onClick={handleGenerateReport}
						disabled={loading}
						startIcon={loading ? <CircularProgress size={20} /> : null}
					>
						{loading ? "Generating..." : "Generate Report"}
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			>
				<Alert
					onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default Analytics;
