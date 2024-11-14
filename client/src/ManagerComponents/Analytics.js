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
	Legend,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DateRangeIcon from "@mui/icons-material/DateRange";

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
			label: "Item Sales Report",
			icon: <AttachMoneyIcon fontSize="large" color="primary" />,
			description: "Analyze sales of items over a period.",
		},
		{
			value: "hourlySales",
			label: "Hourly Sales Report",
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
			value: "eodReport",
			label: "End of Day Report",
			icon: <DateRangeIcon fontSize="large" color="primary" />,
			description: "Summary of daily sales and orders.",
		},
	];

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

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setError("");
	};

	const handleParamChange = (e) => {
		const { name, value } = e.target;
		setReportParams((prev) => ({ ...prev, [name]: value }));
	};

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
					response = await axios.get("https://project-3-team-4b-server.vercel.app/api/reports/low-stock", {
						params: {
							limit: parseInt(reportParams.limit, 10) || 10,
						},
					});
					setReportData(response.data);
					break;
				case "highSalesEmployees":
					response = await axios.get("https://project-3-team-4b-server.vercel.app/api/reports/high-sales-employees", {
						params: {
							startDate: reportParams.startDate,
							endDate: reportParams.endDate,
							limit: parseInt(reportParams.limit, 10) || 10,
						},
					});
					setReportData(response.data);
					break;
				case "itemSales":
					response = await axios.get("https://project-3-team-4b-server.vercel.app/api/reports/item-sales", {
						params: {
							startDateTime: reportParams.startDateTime,
							endDateTime: reportParams.endDateTime,
							limit: parseInt(reportParams.limit, 10) || 10,
						},
					});
					setReportData(response.data);
					break;
				case "hourlySales":
					response = await axios.get("https://project-3-team-4b-server.vercel.app/api/reports/hourly-sales", {
						params: {
							date: reportParams.date,
						},
					});
					setReportData(response.data);
					break;
				case "employeeOrders":
					response = await axios.get("https://project-3-team-4b-server.vercel.app/api/reports/employee-orders", {
						params: {
							employeeName: reportParams.employeeName,
							date: reportParams.date,
						},
					});
					setReportData(response.data);
					break;
				case "eodReport":
					response = await axios.get("https://project-3-team-4b-server.vercel.app/api/reports/eod", {
						params: {
							date: reportParams.date,
						},
					});
					setEodData(response.data);
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

	const formatTimeLabel = (tickItem) => {
		const date = new Date(tickItem);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

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

	const renderReportVisualization = () => {
		return (
			<Paper
				sx={{
					mt: 4,
					p: 2,
					minHeight: "500px",
					backgroundColor: "#333",
					color: "#fff",
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
							margin: { top: 20, right: 30, left: 60, bottom: 80 },
						};

						switch (selectedReport) {
							case "lowStock":
								return (
									<Box>
										<Typography variant="h6" gutterBottom>
											Low Stock Items
										</Typography>
										<ResponsiveContainer width="100%" height={500}>
											<BarChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="name"
													tick={{ angle: -45, textAnchor: "end", fill: "#fff" }}
													interval={0}
													height={100}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, 100]}
													label={{
														value: "Stock Percentage",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dy: -10,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
												/>
												<Legend />
												<Bar dataKey="stock_percentage" fill="#82ca9d" />
											</BarChart>
										</ResponsiveContainer>
									</Box>
								);
							case "highSalesEmployees":
								return (
									<Box>
										<Typography variant="h6" gutterBottom>
											Top Performing Employees
										</Typography>
										<ResponsiveContainer width="100%" height={500}>
											<BarChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="name"
													tick={{ angle: -45, textAnchor: "end", fill: "#fff" }}
													interval={0}
													height={100}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
													label={{
														value: "Total Sales ($)",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dy: -10,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
													formatter={(value) => `$${value}`}
												/>
												<Legend />
												<Bar dataKey="total_sales" fill="#8884d8" />
											</BarChart>
										</ResponsiveContainer>
									</Box>
								);
							case "itemSales":
								return (
									<Box>
										<Typography variant="h6" gutterBottom>
											Item Sales
										</Typography>
										<ResponsiveContainer width="100%" height={500}>
											<BarChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="item_name"
													tick={{ angle: -45, textAnchor: "end", fill: "#fff" }}
													interval={0}
													height={100}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
													label={{
														value: "Total Quantity Sold",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dy: -10,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
												/>
												<Legend />
												<Bar dataKey="total_quantity_sold" fill="#82ca9d" />
											</BarChart>
										</ResponsiveContainer>
									</Box>
								);
							case "hourlySales":
								return (
									<Box>
										<Typography variant="h6" gutterBottom>
											Hourly Sales for {reportParams.date}
										</Typography>
										<ResponsiveContainer width="100%" height={500}>
											<LineChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="hour"
													tickFormatter={(tick) =>
														new Date(tick).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})
													}
													tick={{ fill: "#fff" }}
													height={50}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[
														(dataMin) => Math.floor(dataMin * 0.9),
														(dataMax) => Math.ceil(dataMax * 1.1),
													]}
													label={{
														value: "Total Sales ($)",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dy: -10,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
													labelFormatter={(label) =>
														new Date(label).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})
													}
													formatter={(value) => `$${value}`}
												/>
												<Legend />
												<Line
													type="monotone"
													dataKey="total_sales"
													stroke="#8884d8"
												/>
											</LineChart>
										</ResponsiveContainer>
									</Box>
								);
							case "employeeOrders":
								return (
									<Box>
										<Typography variant="h6" gutterBottom>
											Orders Processed by {reportParams.employeeName} on{" "}
											{reportParams.date}
										</Typography>
										<ResponsiveContainer width="100%" height={500}>
											<LineChart data={reportData} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="hour"
													tickFormatter={(tick) =>
														new Date(tick).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})
													}
													tick={{ fill: "#fff" }}
													height={50}
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
														dy: -10,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
													labelFormatter={(label) =>
														new Date(label).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})
													}
													formatter={(value) => `${value} orders`}
												/>
												<Legend />
												<Line
													type="monotone"
													dataKey="order_count"
													stroke="#8884d8"
												/>
											</LineChart>
										</ResponsiveContainer>
									</Box>
								);
							case "eodReport":
								if (!eodData) return null;
								const { totalSales, employeeOrders } = eodData;
								return (
									<Box>
										<Typography variant="h6" gutterBottom>
											End of Day Report for {reportParams.date}
										</Typography>
										<Typography variant="subtitle1">
											Total Sales: ${totalSales}
										</Typography>
										<Typography variant="subtitle1" sx={{ mt: 2 }}>
											Employee Orders:
										</Typography>
										<ResponsiveContainer width="100%" height={500}>
											<BarChart data={employeeOrders} {...commonProps}>
												<CartesianGrid strokeDasharray="3 3" stroke="#555" />
												<XAxis
													dataKey="name"
													tick={{ angle: -45, textAnchor: "end", fill: "#fff" }}
													interval={0}
													height={100}
												/>
												<YAxis
													tick={{ fill: "#fff" }}
													domain={[
														(dataMin) => Math.floor(dataMin * 0.9),
														(dataMax) => Math.ceil(dataMax * 1.1),
													]}
													label={{
														value: "Total Orders",
														angle: -90,
														position: "insideLeft",
														fill: "#fff",
														dy: -10,
													}}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#444",
														color: "#fff",
													}}
												/>
												<Legend />
												<Bar dataKey="total_orders" fill="#82ca9d" />
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
		<Box sx={{ height: "100%", p: 2 }}>
			<Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={3}>
					{reportOptions.map((report) => (
						<Grid item xs={12} sm={6} md={4} key={report.value}>
							<Card variant="outlined" sx={{ height: "100%" }}>
								<CardContent>
									<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
										{report.icon}
										<Typography variant="h6" sx={{ ml: 2 }}>
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

			{renderReportVisualization()}

			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>
					{reportOptions.find((r) => r.value === selectedReport)?.label}
				</DialogTitle>
				<DialogContent>
					{renderDialogContent()}
					{error && (
						<Typography color="error" variant="body2" sx={{ mt: 1 }}>
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
