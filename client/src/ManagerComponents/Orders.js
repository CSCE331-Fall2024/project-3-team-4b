import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Orders() {
	const [orderData, setOrderData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [employees, setEmployees] = useState([]);

	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState("");
	const [currentOrder, setCurrentOrder] = useState({
		order_id: "",
		time: "",
		total: "",
		employee_id: "",
	});

	useEffect(() => {
		fetchOrderData();
	}, []);

	const fetchOrderData = async () => {
		try {
			const response = await axios.get("/api/orders");
			setOrderData(response.data);
		} catch (error) {
			console.error("Error fetching order data:", error);
			alert("Error fetching order data.");
		}
	};

	const handleSearch = async () => {
		try {
			const response = await axios.get(`/api/orders?search=${searchText}`);

			setOrderData(response.data);
		} catch (error) {
			console.error("Error searching orders:", error);
			alert("Error searching orders.");
		}
	};

	const handleClearSearch = () => {
		setSearchText("");
		fetchOrderData();
	};

	const handleAddOrder = () => {
		setDialogType("Add");
		setCurrentOrder({
			order_id: "",
			time: "",
			total: "",
			employee_id: "",
		});
		setOpenDialog(true);
	};

	const handleEditOrder = (order) => {
		setDialogType("Edit");
		setCurrentOrder({
			...order,
			total: order.total !== null ? order.total.toString() : "",
			time: order.time ? order.time.slice(0, 19) : "",
		});
		setOpenDialog(true);
	};

	const handleDeleteOrder = async (order_id) => {
		if (window.confirm("Are you sure you want to delete this order?")) {
			try {
				await axios.delete(`/api/orders/${order_id}`);
				fetchOrderData();
				alert("Order deleted successfully.");
			} catch (error) {
				console.error("Error deleting order:", error);
				alert("Error deleting order.");
			}
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleDialogSave = async () => {
		const { order_id, time, total, employee_id } = currentOrder;

		if (!time || total === "" || !employee_id) {
			alert("Please fill all fields.");
			return;
		}

		try {
			if (dialogType === "Add") {
				await axios.post("/api/orders", {
					time,
					total: Number(total),
					employee_id: parseInt(employee_id),
				});
				alert("Order added successfully.");
			} else if (dialogType === "Edit") {
				await axios.put(`/api/orders/${order_id}`, {
					time,
					total: Number(total),
					employee_id: parseInt(employee_id),
				});
				alert("Order updated successfully.");
			}
			fetchOrderData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} order:`,
				error
			);
			alert(`Error ${dialogType === "Add" ? "adding" : "updating"} order.`);
		}
	};

	// Prepare data for DataGrid
	const columns = [
		{ field: "order_id", headerName: "ID", width: 60 },
		{
			field: "time",
			headerName: "Time",
			width: 180,
		},
		{
			field: "total",
			headerName: "Total",
			width: 90,
		},
		{
			field: "employee_name",
			headerName: "Employee",
			flex: 1,
			minWidth: 150,
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 100,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<>
					<IconButton
						color="primary"
						onClick={() => handleEditOrder(params.row)}
					>
						<EditIcon />
					</IconButton>
					<IconButton
						color="error"
						onClick={() => handleDeleteOrder(params.row.order_id)}
					>
						<DeleteIcon />
					</IconButton>
				</>
			),
		},
	];

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h5" gutterBottom>
				Order Management
			</Typography>

			{/* Search and Add Buttons */}
			<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
				<TextField
					label="Search Orders"
					variant="outlined"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					size="small"
				/>
				<Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>
					Search
				</Button>
				<Button variant="outlined" onClick={handleClearSearch} sx={{ ml: 1 }}>
					Clear
				</Button>
				<Box sx={{ flexGrow: 1 }} />
				<Button
					variant="contained"
					color="primary"
					onClick={handleAddOrder}
					startIcon={<AddIcon />}
				>
					Add Order
				</Button>
			</Box>

			{/* Order DataGrid */}
			<Box sx={{ height: "80%", width: "100%" }}>
				<DataGrid
					rows={orderData}
					columns={columns}
					getRowId={(row) => row.order_id}
					disableSelectionOnClick
				/>
			</Box>

			{/* Add/Edit Dialog */}
			<Dialog open={openDialog} onClose={handleDialogClose}>
				<DialogTitle>{dialogType} Order</DialogTitle>
				<DialogContent>
					<TextField
						label="Time"
						variant="outlined"
						fullWidth
						type="datetime-local"
						value={currentOrder.time}
						onChange={(e) =>
							setCurrentOrder({ ...currentOrder, time: e.target.value })
						}
						sx={{ mt: 1 }}
					/>
					<TextField
						label="Total"
						variant="outlined"
						fullWidth
						type="number"
						value={currentOrder.total}
						onChange={(e) =>
							setCurrentOrder({ ...currentOrder, total: e.target.value })
						}
						sx={{ mt: 2 }}
						inputProps={{ step: "0.01" }}
					/>
					<FormControl variant="outlined" fullWidth sx={{ mt: 2, mb: 1 }}>
						<InputLabel>Employee</InputLabel>
						<Select
							value={currentOrder.employee_id}
							onChange={(e) =>
								setCurrentOrder({
									...currentOrder,
									employee_id: e.target.value,
								})
							}
							label="Employee"
						>
							{employees.map((employee) => (
								<MenuItem
									key={employee.employee_id}
									value={employee.employee_id}
								>
									{employee.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button
						onClick={handleDialogSave}
						variant="contained"
						color="primary"
					>
						{dialogType === "Add" ? "Add" : "Update"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default Orders;
