import React, { useState } from "react";
import {
	Box,
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Snackbar,
	Alert,
	CircularProgress,
} from "@mui/material";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";

import { Card, CardContent, CardActions, Grid, Icon } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

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
		{ value: "lowStock", label: "Low Stock Report" },
		{ value: "highSalesEmployees", label: "Highest Performing Employees" },
		{ value: "itemSales", label: "Item Sales Report" },
		{ value: "hourlySales", label: "Hourly Sales Report" },
		{ value: "employeeOrders", label: "Employee Orders Report" },
		{ value: "eodReport", label: "End of Day Report" },
	];

	const handleOpenDialog = (report) => {
		setSelectedReport(report);
		setReportParams({});
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

	const handleGenerateReport = async () => {
		setError("");
		setLoading(true);
		try {
			let response;
			switch (selectedReport) {
				case "lowStock":
					response = await axios.get("/api/reports/low-stock", {
						params: {
							limit: reportParams.limit || 10,
						},
					});
					setReportData(response.data);
					break;
				case "highSalesEmployees":
					if (!reportParams.startDate || !reportParams.endDate) {
						setError("Please provide both start and end dates.");
						setLoading(false);
						return;
					}
					response = await axios.get("/api/reports/high-sales-employees", {
						params: {
							startDate: reportParams.startDate,
							endDate: reportParams.endDate,
							limit: reportParams.limit || 10,
						},
					});
					setReportData(response.data);
					break;
				case "itemSales":
					if (!reportParams.startDateTime || !reportParams.endDateTime) {
						setError("Please provide both start and end date-times.");
						setLoading(false);
						return;
					}
					response = await axios.get("/api/reports/item-sales", {
						params: {
							startDateTime: reportParams.startDateTime,
							endDateTime: reportParams.endDateTime,
							limit: reportParams.limit || 10,
						},
					});
					setReportData(response.data);
					break;
				case "hourlySales":
					if (!reportParams.date) {
						setError("Please provide a date.");
						setLoading(false);
						return;
					}
					response = await axios.get("/api/reports/hourly-sales", {
						params: {
							date: reportParams.date,
						},
					});
					setReportData(response.data);
					break;
				case "employeeOrders":
					if (!reportParams.employeeName || !reportParams.date) {
						setError("Please provide employee name and date.");
						setLoading(false);
						return;
					}
					response = await axios.get("/api/reports/employee-orders", {
						params: {
							employeeName: reportParams.employeeName,
							date: reportParams.date,
						},
					});
					setReportData(response.data);
					break;
				case "eodReport":
					if (!reportParams.date) {
						setError("Please provide a date.");
						setLoading(false);
						return;
					}
					response = await axios.get("/api/reports/eod", {
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
		if (loading) {
			return (
				<Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</Box>
			);
		}

		if (!reportData && !eodData) return null;

		switch (selectedReport) {
			case "lowStock":
				return (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h6" gutterBottom>
							Low Stock Items
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={reportData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis
									label={{
										value: "Stock Percentage",
										angle: -90,
										position: "insideLeft",
									}}
								/>
								<Tooltip />
								<Legend />
								<Bar dataKey="stock_percentage" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				);
			case "highSalesEmployees":
				return (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h6" gutterBottom>
							Highest Performing Employees
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={reportData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis
									label={{
										value: "Total Sales",
										angle: -90,
										position: "insideLeft",
									}}
								/>
								<Tooltip formatter={(value) => `$${value}`} />
								<Legend />
								<Bar dataKey="total_sales" fill="#82ca9d" />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				);
			case "itemSales":
				return (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h6" gutterBottom>
							Item Sales
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={reportData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="item_name" />
								<YAxis
									label={{
										value: "Total Quantity Sold",
										angle: -90,
										position: "insideLeft",
									}}
								/>
								<Tooltip />
								<Legend />
								<Bar dataKey="total_quantity_sold" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				);
			case "hourlySales":
				return (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h6" gutterBottom>
							Hourly Sales for {reportParams.date}
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={reportData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="hour" />
								<YAxis
									label={{
										value: "Total Sales",
										angle: -90,
										position: "insideLeft",
									}}
								/>
								<Tooltip formatter={(value) => `$${value}`} />
								<Legend />
								<Bar dataKey="total_sales" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				);
			case "employeeOrders":
				return (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h6" gutterBottom>
							Orders Processed by {reportParams.employeeName} on{" "}
							{reportParams.date}
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={reportData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="hour" />
								<YAxis
									label={{
										value: "Order Count",
										angle: -90,
										position: "insideLeft",
									}}
								/>
								<Tooltip formatter={(value) => `${value} orders`} />
								<Legend />
								<Bar dataKey="order_count" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				);
			case "eodReport":
				if (!eodData) return null;
				const { totalSales, employeeOrders } = eodData;
				return (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h6" gutterBottom>
							End of Day Report for {reportParams.date}
						</Typography>
						<Typography variant="subtitle1">
							Total Sales: ${totalSales}
						</Typography>
						<Typography variant="subtitle1" sx={{ mt: 2 }}>
							Employee Orders:
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={employeeOrders}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis
									label={{
										value: "Total Orders",
										angle: -90,
										position: "insideLeft",
									}}
								/>
								<Tooltip formatter={(value) => `${value} orders`} />
								<Legend />
								<Bar dataKey="total_orders" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<Box
			sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}
		>
			<Typography variant="h5" gutterBottom>
				Analytics & Reports
			</Typography>

			{/* Report Selection */}
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
				{reportOptions.map((report) => (
					<Button
						key={report.value}
						variant="contained"
						onClick={() => handleOpenDialog(report.value)}
					>
						{report.label}
					</Button>
				))}
			</Box>

			{/* Report Dialog */}
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
					<Button variant="contained" onClick={handleGenerateReport}>
						Generate Report
					</Button>
				</DialogActions>
			</Dialog>

			{/* Report Visualization */}
			{renderReportVisualization()}

			{/* Snackbar */}
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
