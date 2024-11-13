
import React, { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";

import {
	Box,
	Typography,
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	IconButton,
} from "@mui/material";

function ManagerMenu() {
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

	// refreshes the Menu table when changes are made
	useEffect(() => {
		fetchMenuData();
	}, []);

	// get Menu data from database
	const fetchMenuData = async () => {
		try {
			const response = await axios.get("/api/menu");

			setMenuData(response.data);
		} catch (error) {
			console.error("Error fetching menu data:", error);
			alert("Error fetching menu data.");
		}
	};

	// search for menu items
	const handleSearch = async () => {
		try {
			const response = await axios.get(`/api/menu?search=${searchText}`);
			setMenuData(response.data);
		} catch (error) {
			console.error("Error searching menu items:", error);
			alert("Error searching menu items.");
		}
	};

	// clear search results and reloads the Menu table
	const handleClearSearch = () => {
		setSearchText("");
		fetchMenuData();
	};

	// opens the Add Menu Item dialog
	const handleAddMenuItem = () => {
		setDialogType("Add");

		// clear input parameters
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

	const handleDeleteMenuItem = async (menu_id) => {
		if (window.confirm("Are you sure you want to delete this menu item?")) {
			try {
				await axios.delete(`/api/menu/${menu_id}`);
				fetchMenuData();
				alert("Menu item deleted successfully.");
			} catch (error) {
				console.error("Error deleting menu item:", error);
				alert("Error deleting menu item.");
			}
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleDialogSave = async () => {
		const { menu_id, name, type, extra_cost, calories } = currentItem;

		if (!name || !type || extra_cost === "" || calories === "") {
			alert("Please fill all fields.");
			return;
		}

		try {
			if (dialogType === "Add") {
				await axios.post("/api/menu", {
					name,
					type,
					extra_cost: parseFloat(extra_cost),
					calories: parseInt(calories),
				});
				alert("Menu item added successfully.");
			} else if (dialogType === "Edit") {
				await axios.put(`/api/menu/${menu_id}`, {
					name,
					type,
					extra_cost: parseFloat(extra_cost),
					calories: parseInt(calories),
				});
				alert("Menu item updated successfully.");
			}
			fetchMenuData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} menu item:`,
				error
			);
			alert(`Error ${dialogType === "Add" ? "adding" : "updating"} menu item.`);
		}
	};

	// set column headers for the Menu table
	const columns = [
		{ field: "menu_id", headerName: "ID", width: 60 },
		{ field: "name", headerName: "Name", flex: 1, minWidth: 100 },
		{ field: "type", headerName: "Type", width: 100 },
		{
			field: "extra_cost",
			headerName: "Extra Cost",
			width: 90,
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
		<Box sx={{ p: 2 }}>
			<Typography variant="h5" gutterBottom sx={{}}>
				Menu
			</Typography>

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
				<Button variant="contained" color="primary" onClick={handleAddMenuItem}>
					Add Menu Item
				</Button>
			</Box>

			<Box sx={{ height: "80%", width: "100%" }}>
				<DataGrid
					rows={menuData}
					columns={columns}
					getRowId={(row) => row.menu_id}
					disableSelectionOnClick
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
		</Box>
	);
}

export default ManagerMenu;
