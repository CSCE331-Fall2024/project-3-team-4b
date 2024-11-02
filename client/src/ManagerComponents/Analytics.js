import React, { useState } from "react";
import { Button, Modal, TextField, Typography, Box } from "@mui/material";
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
	const [modalOpen, setModalOpen] = useState(false);
	const [limit, setLimit] = useState(10);
	const [reportData, setReportData] = useState(null);
	const [error, setError] = useState("");

	const handleOpenModal = () => {
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

	const fetchReportData = async () => {
		try {
			const response = await axios.get("/api/reports/low-stock", {
				params: {
					limit: limit || 10,
				},
			});
			setReportData(response.data);
			setModalOpen(false);
		} catch (err) {
			console.error(err);
			setError("Error fetching report data.");
		}
	};

	const renderModalContent = () => (
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
				<Button variant="contained" onClick={fetchReportData} sx={{ mr: 1 }}>
					Generate Report
				</Button>
				<Button onClick={handleCloseModal}>Cancel</Button>
			</Box>
			{error && <Typography color="error">{error}</Typography>}
		</Box>
	);

	const renderReportVisualization = () => {
		if (!reportData) return null;

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
								value: "Stock %",
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
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Analytics Dashboard
			</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
				<Button variant="contained" onClick={handleOpenModal}>
					Low Stock Report
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
