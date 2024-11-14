import React, { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Snackbar,
	Alert,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Orders() {
	const [orderData, setOrderData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState("");
	const [currentOrder, setCurrentOrder] = useState({
		order_id: "",
		time: "",
		total: "",
		employee_id: "",
		employee_name: "",
	});

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [orderToDelete, setOrderToDelete] = useState(null);

	const [employeeList, setEmployeeList] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchOrderData();
		fetchEmployeeList();
	}, []);

	const fetchOrderData = async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/orders");

			const data = response.data.map((order) => ({
				...order,
				time: order.time ? order.time.replace("T", " ").replace("Z", " ") : "",
			}));

			setOrderData(data);
		} catch (error) {
			console.error("Error fetching order data:", error);
			setSnackbarMessage("Error fetching order data.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		} finally {
			setLoading(false);
		}
	};

	const fetchEmployeeList = async () => {
		try {
			const response = await axios.get("/api/employees");
			setEmployeeList(response.data);
		} catch (error) {
			console.error("Error fetching employee list:", error);
			setSnackbarMessage("Error fetching employee list.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleSearch = async () => {
		try {
			const response = await axios.get(`/api/orders?search=${searchText}`);

			const data = response.data.map((order) => ({
				...order,
				time: order.time ? order.time.replace("T", " ").replace("Z", " ") : "",
			}));

			setOrderData(data);
		} catch (error) {
			console.error("Error searching orders:", error);
			setSnackbarMessage("Error searching orders.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
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
		const date = new Date(order.time);
		const isoString = date.toISOString().slice(0, 16);
		setCurrentOrder({
			...order,
			total: order.total !== null ? order.total.toString() : "",
			time: isoString,
		});
		setOpenDialog(true);
	};

	const handleDeleteOrder = (order_id) => {
		setOrderToDelete(order_id);
		setConfirmDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		try {
			await axios.delete(`/api/orders/${orderToDelete}`);
			fetchOrderData();
			setSnackbarMessage("Order deleted successfully.");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
		} catch (error) {
			console.error("Error deleting order:", error);
			setSnackbarMessage("Error deleting order.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		} finally {
			setConfirmDialogOpen(false);
			setOrderToDelete(null);
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const validateOrder = () => {
		const { time, total, employee_id } = currentOrder;

		if (!time || total === "" || !employee_id) {
			setSnackbarMessage("Please fill all fields.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}


		const orderTime = new Date(time);
		if (isNaN(orderTime.getTime())) {
			setSnackbarMessage("Invalid date and time.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}

		const now = new Date();
		if (orderTime > now) {
			setSnackbarMessage("Order time cannot be in the future.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}

		const totalValue = parseFloat(total);
		if (isNaN(totalValue) || totalValue < 0) {
			setSnackbarMessage("Total must be a non-negative number.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}


		const employeeIdValue = parseInt(employee_id);
		if (
			isNaN(employeeIdValue) ||
			employeeIdValue <= 0 ||
			!employeeList.some((emp) => emp.employee_id === employeeIdValue)
		) {
			setSnackbarMessage("Please select a valid employee.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}

		return true;
	};

	const handleDialogSave = async () => {
		if (!validateOrder()) {
			return;
		}

		const { order_id, time, total, employee_id } = currentOrder;

		try {
			if (dialogType === "Add") {
				await axios.post("/api/orders", {
					time,
					total: parseFloat(total),
					employee_id: parseInt(employee_id),
				});
				setSnackbarMessage("Order added successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			} else if (dialogType === "Edit") {
				await axios.put(`/api/orders/${order_id}`, {
					time,
					total: parseFloat(total),
					employee_id: parseInt(employee_id),
				});
				setSnackbarMessage("Order updated successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			}
			fetchOrderData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} order:`,
				error
			);
			setSnackbarMessage(
				`Error ${dialogType === "Add" ? "adding" : "updating"} order.`
			);
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

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
			renderCell: (params) => {
				const value = parseFloat(params.row.total);
				if (isNaN(value)) {
					return "$0.00";
				}
				return `$${value.toFixed(2)}`;
			},
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
		<Box sx={{ height: "100%" }}>
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
					Add New Order
				</Button>
			</Box>

			<Box sx={{ height: "95%", width: "100%" }}>
				{loading ? (
					<CircularProgress />
				) : (
					<DataGrid
						rows={orderData}
						columns={columns}
						getRowId={(row) => row.order_id}
						disableSelectionOnClick
						autoPageSize
					/>
				)}
			</Box>

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
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						label="Total"
						variant="outlined"
						fullWidth
						type="number"
						inputProps={{ min: 0, step: "0.01" }}
						value={currentOrder.total}
						onChange={(e) =>
							setCurrentOrder({ ...currentOrder, total: e.target.value })
						}
						sx={{ mt: 2 }}
					/>
					<FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
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
							{employeeList.map((employee) => (
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

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			>
				<Alert
					onClose={() => setSnackbarOpen(false)}
					severity={snackbarSeverity}
					sx={{ width: "100%" }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>

			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
			>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					Are you sure you want to delete this order?
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={handleConfirmDelete}
						color="error"
						variant="contained"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default Orders;
