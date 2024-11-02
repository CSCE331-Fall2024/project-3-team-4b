// ManagerComponents/Analytics.js

import React, { useState } from "react";
import { Button, Modal, TextField, Typography, Box } from "@mui/material";
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};

const Analytics = () => {
	const [selectedReport, setSelectedReport] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [limit, setLimit] = useState(10);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [startDateTime, setStartDateTime] = useState("");
	const [endDateTime, setEndDateTime] = useState("");
	const [reportData, setReportData] = useState(null);
	const [error, setError] = useState("");

	const handleOpenModal = (report) => {
		setSelectedReport(report);
		setLimit(10);
		setStartDate("");
		setEndDate("");
		setStartDateTime("");
		setEndDateTime("");
		setModalOpen(true);
		setError("");
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setError("");
	};

	const handleLimitChange = (e) => {
		setLimit(e.target.value);
	};

	const handleStartDateChange = (e) => {
		setStartDate(e.target.value);
	};

	const handleEndDateChange = (e) => {
		setEndDate(e.target.value);
	};

	const handleStartDateTimeChange = (e) => {
		setStartDateTime(e.target.value);
	};

	const handleEndDateTimeChange = (e) => {
		setEndDateTime(e.target.value);
	};

	const fetchReportData = async () => {
		try {
			let response;
			if (selectedReport === "lowStock") {
				response = await axios.get("/api/reports/low-stock", {
					params: {
						limit: limit || 10,
					},
				});
			} else if (selectedReport === "highSalesEmployees") {
				if (!startDate || !endDate) {
					setError("Please provide both start and end dates.");
					return;
				}
				response = await axios.get("/api/reports/high-sales-employees", {
					params: {
						startDate,
						endDate,
						limit: limit || 10,
					},
				});
			} else if (selectedReport === "itemSales") {
				if (!startDateTime || !endDateTime) {
					setError("Please provide both start and end date-times.");
					return;
				}
				response = await axios.get("/api/reports/item-sales", {
					params: {
						startDateTime,
						endDateTime,
						limit: limit || 10,
					},
				});
			}
			setReportData(response.data);
			setModalOpen(false);
		} catch (err) {
			console.error(err);
			setError("Error fetching report data.");
		}
	};

	const renderModalContent = () => {
		if (selectedReport === "lowStock") {
			return (
				<Box sx={modalStyle}>
					<Typography variant="h6" component="h2" gutterBottom>
						Low Stock Report
					</Typography>
					<TextField
						label="Limit"
						name="limit"
						value={limit}
						onChange={handleLimitChange}
						fullWidth
						margin="normal"
						type="number"
					/>
					<Box sx={{ mt: 2 }}>
						<Button
							variant="contained"
							onClick={fetchReportData}
							sx={{ mr: 1 }}
						>
							Generate Report
						</Button>
						<Button onClick={handleCloseModal}>Cancel</Button>
					</Box>
					{error && <Typography color="error">{error}</Typography>}
				</Box>
			);
		} else if (selectedReport === "highSalesEmployees") {
			return (
				<Box sx={modalStyle}>
					<Typography variant="h6" component="h2" gutterBottom>
						Highest Performing N-Employees Report
					</Typography>
					<TextField
						label="Start Date"
						name="startDate"
						value={startDate}
						onChange={handleStartDateChange}
						fullWidth
						margin="normal"
						type="date"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						label="End Date"
						name="endDate"
						value={endDate}
						onChange={handleEndDateChange}
						fullWidth
						margin="normal"
						type="date"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						label="Limit (Number of Employees)"
						name="limit"
						value={limit}
						onChange={handleLimitChange}
						fullWidth
						margin="normal"
						type="number"
					/>
					<Box sx={{ mt: 2 }}>
						<Button
							variant="contained"
							onClick={fetchReportData}
							sx={{ mr: 1 }}
						>
							Generate Report
						</Button>
						<Button onClick={handleCloseModal}>Cancel</Button>
					</Box>
					{error && <Typography color="error">{error}</Typography>}
				</Box>
			);
		} else if (selectedReport === "itemSales") {
			return (
				<Box sx={modalStyle}>
					<Typography variant="h6" component="h2" gutterBottom>
						Item Sales Report
					</Typography>
					<TextField
						label="Start Date Time"
						name="startDateTime"
						value={startDateTime}
						onChange={handleStartDateTimeChange}
						fullWidth
						margin="normal"
						type="datetime-local"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						label="End Date Time"
						name="endDateTime"
						value={endDateTime}
						onChange={handleEndDateTimeChange}
						fullWidth
						margin="normal"
						type="datetime-local"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						label="Limit"
						name="limit"
						value={limit}
						onChange={handleLimitChange}
						fullWidth
						margin="normal"
						type="number"
					/>
					<Box sx={{ mt: 2 }}>
						<Button
							variant="contained"
							onClick={fetchReportData}
							sx={{ mr: 1 }}
						>
							Generate Report
						</Button>
						<Button onClick={handleCloseModal}>Cancel</Button>
					</Box>
					{error && <Typography color="error">{error}</Typography>}
				</Box>
			);
		}
		return <Box />; // Return an empty Box instead of null
	};

	const getColor = (index) => {
		const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];
		return colors[index % colors.length];
	};

	const renderReportVisualization = () => {
		if (!reportData) return null;

		if (selectedReport === "lowStock") {
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
		} else if (selectedReport === "highSalesEmployees") {
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
		} else if (selectedReport === "itemSales") {
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
		}

		return null;
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Analytics Dashboard
			</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
				<Button variant="contained" onClick={() => handleOpenModal("lowStock")}>
					Low Stock Report
				</Button>
				<Button
					variant="contained"
					onClick={() => handleOpenModal("highSalesEmployees")}
				>
					Highest Performing N-Employees Report
				</Button>
				<Button
					variant="contained"
					onClick={() => handleOpenModal("itemSales")}
				>
					Item Sales Report
				</Button>
			</Box>
			<Modal open={modalOpen} onClose={handleCloseModal}>
				{renderModalContent()}
			</Modal>
			{renderReportVisualization()}
		</Box>
	);
};

export default Analytics;
