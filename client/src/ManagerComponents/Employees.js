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
	InputLabel,
	FormControl,
	Select,
	MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Employees() {
	const [employeeData, setEmployeeData] = useState([]);
	const [searchText, setSearchText] = useState("");

	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState("");
	const [currentEmployee, setCurrentEmployee] = useState({
		employee_id: "",
		name: "",
		role: "",
		salary: "",
	});

	useEffect(() => {
		fetchEmployeeData();
	}, []);

	const fetchEmployeeData = async () => {
		try {
			const response = await axios.get("/api/employees");
			const data = response.data.map((employee) => ({
				...employee,
				salary: employee.salary !== null ? Number(employee.salary) : 0.0,
			}));
			setEmployeeData(data);
		} catch (error) {
			console.error("Error fetching employee data:", error);
			alert("Error fetching employee data.");
		}
	};

	const handleSearch = async () => {
		try {
			const response = await axios.get(`/api/employees?search=${searchText}`);
			const data = response.data.map((employee) => ({
				...employee,
				salary: employee.salary !== null ? Number(employee.salary) : 0.0,
			}));
			setEmployeeData(data);
		} catch (error) {
			console.error("Error searching employees:", error);
			alert("Error searching employees.");
		}
	};

	const handleClearSearch = () => {
		setSearchText("");
		fetchEmployeeData();
	};

	const handleAddEmployee = () => {
		setDialogType("Add");
		setCurrentEmployee({
			employee_id: "",
			name: "",
			role: "",
			salary: "",
		});
		setOpenDialog(true);
	};

	const handleEditEmployee = (employee) => {
		setDialogType("Edit");
		setCurrentEmployee({
			...employee,
			salary: employee.salary !== null ? employee.salary.toString() : "",
		});
		setOpenDialog(true);
	};

	const handleDeleteEmployee = async (employee_id) => {
		if (window.confirm("Are you sure you want to delete this employee?")) {
			try {
				await axios.delete(`/api/employees/${employee_id}`);
				fetchEmployeeData();
				alert("Employee deleted successfully.");
			} catch (error) {
				console.error("Error deleting employee:", error);
				alert("Error deleting employee.");
			}
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleDialogSave = async () => {
		const { employee_id, name, role, salary } = currentEmployee;

		if (!name || !role || salary === "") {
			alert("Please fill all fields.");
			return;
		}

		try {
			if (dialogType === "Add") {
				await axios.post("/api/employees", {
					name,
					role,
					salary: Number(salary),
				});
				alert("Employee added successfully.");
			} else if (dialogType === "Edit") {
				await axios.put(`/api/employees/${employee_id}`, {
					name,
					role,
					salary: Number(salary),
				});
				alert("Employee updated successfully.");
			}
			fetchEmployeeData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} employee:`,
				error
			);
			alert(`Error ${dialogType === "Add" ? "adding" : "updating"} employee.`);
		}
	};

	// Prepare data for DataGrid
	const columns = [
		{ field: "employee_id", headerName: "ID", width: 60 },
		{ field: "name", headerName: "Name", flex: 1, minWidth: 150 },
		{ field: "role", headerName: "Role", width: 120 },
		{
			field: "salary",
			headerName: "Salary",
			width: 120,
			valueFormatter: (params) => {
				const value = params.value;
				if (value === null || value === undefined || isNaN(value)) {
					return "$0.00";
				} else {
					return `$${value.toFixed(2)}`;
				}
			},
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
						onClick={() => handleEditEmployee(params.row)}
					>
						<EditIcon />
					</IconButton>
					<IconButton
						color="error"
						onClick={() => handleDeleteEmployee(params.row.employee_id)}
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
				Employee Management
			</Typography>

			{/* Search and Add Buttons */}
			<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
				<TextField
					label="Search Employees"
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
					onClick={handleAddEmployee}
					startIcon={<AddIcon />}
				>
					Add Employee
				</Button>
			</Box>

			{/* Employees DataGrid */}
			<Box sx={{ height: "80%", width: "100%" }}>
				<DataGrid
					rows={employeeData}
					columns={columns}
					getRowId={(row) => row.employee_id}
					disableSelectionOnClick
				/>
			</Box>

			{/* Add/Edit Dialog */}
			<Dialog open={openDialog} onClose={handleDialogClose}>
				<DialogTitle>{dialogType} Employee</DialogTitle>
				<DialogContent>
					<TextField
						label="Name"
						variant="outlined"
						fullWidth
						value={currentEmployee.name}
						onChange={(e) =>
							setCurrentEmployee({ ...currentEmployee, name: e.target.value })
						}
						sx={{ mt: 1 }}
					/>
					<FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
						<InputLabel>Role</InputLabel>
						<Select
							value={currentEmployee.role}
							onChange={(e) =>
								setCurrentEmployee({ ...currentEmployee, role: e.target.value })
							}
							label="Role"
						>
							<MenuItem value="Cashier">Cashier</MenuItem>
							<MenuItem value="Manager">Manager</MenuItem>
							<MenuItem value="Chef">Chef</MenuItem>
							{/* Add more roles as needed */}
						</Select>
					</FormControl>
					<TextField
						label="Salary"
						variant="outlined"
						fullWidth
						type="number"
						value={currentEmployee.salary}
						onChange={(e) =>
							setCurrentEmployee({ ...currentEmployee, salary: e.target.value })
						}
						sx={{ mt: 2, mb: 1 }}
						inputProps={{ step: "0.01" }}
					/>
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

export default Employees;
