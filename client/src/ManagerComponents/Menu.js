import React, { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import {
	Box,
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	IconButton,
	Snackbar,
	Alert,
} from "@mui/material";

function Menu() {
	const [menuData, setMenuData] = useState([]);
	const [searchText, setSearchText] = useState("");

	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState("");

	const [currentItem, setCurrentItem] = useState({
		menu_id: "",
		name: "",
		type: "",
		extra_cost: "",
		calories: "",
	});

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);

	useEffect(() => {
		fetchMenuData();
	}, []);

	const fetchMenuData = async () => {
		try {
			const response = await axios.get("https://project-3-team-4b-server.vercel.app/api/menu");
			setMenuData(response.data);
		} catch (error) {
			console.error("Error fetching menu data:", error);
			setSnackbarMessage("Error fetching menu data.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleSearch = async () => {
		try {
			const response = await axios.get(`https://project-3-team-4b-server.vercel.app/api/menu?search=${searchText}`);
			setMenuData(response.data);
		} catch (error) {
			console.error("Error searching menu items:", error);
			setSnackbarMessage("Error searching menu items.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleClearSearch = () => {
		setSearchText("");
		fetchMenuData();
	};

	const handleAddMenuItem = () => {
		setDialogType("Add");
		setCurrentItem({
			menu_id: "",
			name: "",
			type: "",
			extra_cost: "",
			calories: "",
		});
		setOpenDialog(true);
	};

	const handleEditMenuItem = (item) => {
		setDialogType("Edit");
		setCurrentItem({ ...item });
		setOpenDialog(true);
	};

	const handleDeleteMenuItem = (menu_id) => {
		setItemToDelete(menu_id);
		setConfirmDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		try {
			await axios.delete(`https://project-3-team-4b-server.vercel.app/api/menu/${itemToDelete}`);
			fetchMenuData();
			setSnackbarMessage("Menu item deleted successfully.");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
		} catch (error) {
			console.error("Error deleting menu item:", error);
			setSnackbarMessage("Error deleting menu item.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		} finally {
			setConfirmDialogOpen(false);
			setItemToDelete(null);
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleDialogSave = async () => {
		const { menu_id, name, type, extra_cost, calories } = currentItem;

		if (!name || !type || extra_cost === "" || calories === "") {
			setSnackbarMessage("Please fill all fields.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		if (parseFloat(extra_cost) < 0) {
			setSnackbarMessage("Extra cost cannot be negative.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		if (parseInt(calories) < 0) {
			setSnackbarMessage("Calories cannot be negative.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		try {
			if (dialogType === "Add") {
				const nameExists = menuData.some(
					(item) => item.name.toLowerCase() === name.toLowerCase()
				);

				if (nameExists) {
					setSnackbarMessage("A menu item with this name already exists.");
					setSnackbarSeverity("warning");
					setSnackbarOpen(true);
					return;
				}

				await axios.post("https://project-3-team-4b-server.vercel.app/api/menu", {
					name,
					type,
					extra_cost: parseFloat(extra_cost),
					calories: parseInt(calories),
				});
				setSnackbarMessage("Menu item added successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			} else if (dialogType === "Edit") {
				await axios.put(`https://project-3-team-4b-server.vercel.app/api/menu/${menu_id}`, {
					name,
					type,
					extra_cost: parseFloat(extra_cost),
					calories: parseInt(calories),
				});
				setSnackbarMessage("Menu item updated successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			}
			fetchMenuData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} menu item:`,
				error
			);
			setSnackbarMessage(
				`Error ${dialogType === "Add" ? "adding" : "updating"} menu item.`
			);
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const columns = [
		{ field: "menu_id", headerName: "ID", width: 60 },
		{ field: "name", headerName: "Name", flex: 1, minWidth: 100 },
		{ field: "type", headerName: "Type", width: 100 },
		{
			field: "extra_cost",
			headerName: "Extra Cost",
			width: 90,
			renderCell: (params) => {
				const value = parseFloat(params.row.extra_cost);
				if (isNaN(value)) {
					return "$0.00";
				}
				return `$${value.toFixed(2)}`;
			},
		},
		{
			field: "calories",
			headerName: "Calories",
			width: 80,
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
						onClick={() => handleEditMenuItem(params.row)}
					>
						<EditIcon />
					</IconButton>
					<IconButton
						color="error"
						onClick={() => handleDeleteMenuItem(params.row.menu_id)}
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
					label="Search Menu Items"
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
					onClick={handleAddMenuItem}
					startIcon={<AddIcon />}
				>
					Add New Menu Item
				</Button>
			</Box>

			<Box sx={{ height: "95%", width: "100%" }}>
				<DataGrid
					rows={menuData}
					columns={columns}
					getRowId={(row) => row.menu_id}
					disableSelectionOnClick
					autoPageSize
				/>
			</Box>

			<Dialog open={openDialog} onClose={handleDialogClose}>
				<DialogTitle>{dialogType} Menu Item</DialogTitle>
				<DialogContent>
					<TextField
						label="Name"
						variant="outlined"
						fullWidth
						value={currentItem.name}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, name: e.target.value })
						}
						sx={{ mt: 1 }}
					/>
					<FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
						<InputLabel>Type</InputLabel>
						<Select
							value={currentItem.type}
							onChange={(e) =>
								setCurrentItem({ ...currentItem, type: e.target.value })
							}
							label="Type"
						>
							<MenuItem value="Appetizer">Appetizer</MenuItem>
							<MenuItem value="Entree">Entree</MenuItem>
							<MenuItem value="Side">Side</MenuItem>
							<MenuItem value="Drink">Drink</MenuItem>
						</Select>
					</FormControl>
					<TextField
						label="Extra Cost"
						variant="outlined"
						fullWidth
						type="number"
						inputProps={{ min: 0, step: "0.01" }}
						value={currentItem.extra_cost}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, extra_cost: e.target.value })
						}
						sx={{ mt: 2 }}
					/>
					<TextField
						label="Calories"
						variant="outlined"
						fullWidth
						type="number"
						inputProps={{ min: 0 }}
						value={currentItem.calories}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, calories: e.target.value })
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
					<DialogContentText>
						Are you sure you want to delete this menu item?
					</DialogContentText>
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

export default Menu;
