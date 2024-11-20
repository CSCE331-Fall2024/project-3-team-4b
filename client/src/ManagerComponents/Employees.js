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
	InputLabel,
	FormControl,
	Select,
	MenuItem,
	Snackbar,
	Alert,
	CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Employees component for managing and displaying employee data.
 *
 * @returns {JSX.Element} The rendered Employees component.
 */
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

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [employeeToDelete, setEmployeeToDelete] = useState(null);

	const [loading, setLoading] = useState(false);

	const roles = ["Cashier", "Manager", "Chef"];

	useEffect(() => {
		fetchEmployeeData();
	}, []);

	/**
	 * Fetches employee data from the server.
	 */
	const fetchEmployeeData = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/employees"
			);
			setEmployeeData(response.data);
		} catch (error) {
			console.error("Error fetching employee data:", error);
			setSnackbarMessage("Error fetching employee data.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handles the search functionality.
	 */
	const handleSearch = async () => {
		try {
			const response = await axios.get(
				`https://project-3-team-4b-server.vercel.app/api/employees?search=${searchText}`
			);
			setEmployeeData(response.data);
		} catch (error) {
			console.error("Error searching employees:", error);
			setSnackbarMessage("Error searching employees.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	/**
	 * Clears the search text and reloads employee data.
	 */
	const handleClearSearch = () => {
		setSearchText("");
		fetchEmployeeData();
	};

	/**
	 * Opens the dialog to add a new employee.
	 */
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

	/**
	 * Opens the dialog to edit an existing employee.
	 *
	 * @param {Object} employee - The employee data to edit.
	 */
	const handleEditEmployee = (employee) => {
		setDialogType("Edit");
		setCurrentEmployee({
			...employee,
			salary: employee.salary !== null ? employee.salary.toString() : "",
		});
		setOpenDialog(true);
	};

	/**
	 * Opens the confirmation dialog to delete an employee.
	 *
	 * @param {number} employee_id - The ID of the employee to delete.
	 */
	const handleDeleteEmployee = (employee_id) => {
		setEmployeeToDelete(employee_id);
		setConfirmDialogOpen(true);
	};

	/**
	 * Confirms and deletes the selected employee.
	 */
	const handleConfirmDelete = async () => {
		try {
			await axios.delete(
				`https://project-3-team-4b-server.vercel.app/api/employees/${employeeToDelete}`
			);
			fetchEmployeeData();
			setSnackbarMessage("Employee deleted successfully.");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
		} catch (error) {
			console.error("Error deleting employee:", error);
			setSnackbarMessage("Error deleting employee.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		} finally {
			setConfirmDialogOpen(false);
			setEmployeeToDelete(null);
		}
	};

	/**
	 * Closes the add/edit dialog.
	 */
	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	/**
	 * Validates the employee data before saving.
	 *
	 * @returns {boolean} True if valid, false otherwise.
	 */
	const validateEmployee = () => {
		const { name, role, salary } = currentEmployee;

		if (!name || !role || salary === "") {
			setSnackbarMessage("Please fill all fields.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}

		if (!roles.includes(role)) {
			setSnackbarMessage("Invalid role selected.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}

		const salaryValue = parseFloat(salary);
		if (isNaN(salaryValue) || salaryValue < 0) {
			setSnackbarMessage("Salary must be a non-negative number.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return false;
		}

		return true;
	};

	/**
	 * Saves the employee data (add or edit) after validation.
	 */
	const handleDialogSave = async () => {
		if (!validateEmployee()) {
			return;
		}

		const { employee_id, name, role, salary } = currentEmployee;
		const salaryValue = parseFloat(salary);

		try {
			if (dialogType === "Add") {
				await axios.post(
					"https://project-3-team-4b-server.vercel.app/api/employees",
					{
						name,
						role,
						salary: salaryValue,
					}
				);
				setSnackbarMessage("Employee added successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			} else if (dialogType === "Edit") {
				await axios.put(
					`https://project-3-team-4b-server.vercel.app/api/employees/${employee_id}`,
					{
						name,
						role,
						salary: salaryValue,
					}
				);
				setSnackbarMessage("Employee updated successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			}
			fetchEmployeeData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} employee:`,
				error
			);
			setSnackbarMessage(
				`Error ${dialogType === "Add" ? "adding" : "updating"} employee.`
			);
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const columns = [
		{ field: "employee_id", headerName: "ID", width: 60 },
		{ field: "name", headerName: "Name", flex: 1, minWidth: 100 },
		{
			field: "salary",
			headerName: "Salary",
			width: 120,
			renderCell: (params) => {
				const value = parseFloat(params.row.salary);
				return isNaN(value) ? "$0.00" : `$${value.toFixed(2)}`;
			},
		},
		{ field: "role", headerName: "Role", width: 120 },
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
		<Box sx={{ height: "100%" }}>
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
					Add New Employee
				</Button>
			</Box>

			<Box sx={{ height: "95%", width: "100%" }}>
				{loading ? (
					<CircularProgress />
				) : (
					<DataGrid
						rows={employeeData}
						columns={columns}
						getRowId={(row) => row.employee_id}
						disableSelectionOnClick
						autoPageSize
					/>
				)}
			</Box>

			{/* Add/Edit Employee Dialog */}
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
							{roles.map((role) => (
								<MenuItem key={role} value={role}>
									{role}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="Salary"
						variant="outlined"
						fullWidth
						type="number"
						inputProps={{ min: 0, step: "0.01" }}
						value={currentEmployee.salary}
						onChange={(e) =>
							setCurrentEmployee({ ...currentEmployee, salary: e.target.value })
						}
						sx={{ mt: 2, mb: 1 }}
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

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
			>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					Are you sure you want to delete this employee?
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

			{/* Snackbar Notification */}
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
		</Box>
	);
}

export default Employees;
