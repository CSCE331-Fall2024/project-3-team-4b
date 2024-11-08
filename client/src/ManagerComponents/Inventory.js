import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	IconButton,
	Snackbar,
	Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Inventory() {
	const [inventoryData, setInventoryData] = useState([]);
	const [searchText, setSearchText] = useState("");

	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState("");
	const [currentItem, setCurrentItem] = useState({
		inventory_id: "",
		name: "",
		cost: "",
		max_qty: "",
		qty: "",
	});

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);

	useEffect(() => {
		fetchInventoryData();
	}, []);

	const fetchInventoryData = async () => {
		try {
			const response = await axios.get("/api/inventory");
			setInventoryData(response.data);
		} catch (error) {
			console.error("Error fetching inventory data:", error);
			setSnackbarMessage("Error fetching inventory data.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleSearch = async () => {
		try {
			const response = await axios.get(`/api/inventory?search=${searchText}`);
			setInventoryData(response.data);
		} catch (error) {
			console.error("Error searching inventory items:", error);
			setSnackbarMessage("Error searching inventory items.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleClearSearch = () => {
		setSearchText("");
		fetchInventoryData();
	};

	const handleAddInventoryItem = () => {
		setDialogType("Add");
		setCurrentItem({
			inventory_id: "",
			name: "",
			cost: "",
			max_qty: "",
			qty: "",
		});
		setOpenDialog(true);
	};

	const handleEditInventoryItem = (item) => {
		setDialogType("Edit");
		setCurrentItem({ ...item });
		setOpenDialog(true);
	};

	const handleDeleteInventoryItem = (inventory_id) => {
		setItemToDelete(inventory_id);
		setConfirmDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		try {
			await axios.delete(`/api/inventory/${itemToDelete}`);
			fetchInventoryData();
			setSnackbarMessage("Inventory item deleted successfully.");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
		} catch (error) {
			console.error("Error deleting inventory item:", error);
			setSnackbarMessage("Error deleting inventory item.");
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
		const { inventory_id, name, cost, max_qty, qty } = currentItem;
		const trimmedName = name.trim();

		if (!trimmedName || cost === "" || max_qty === "" || qty === "") {
			setSnackbarMessage("Please fill all fields.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		const parsedCost = parseFloat(cost);
		if (isNaN(parsedCost) || parsedCost < 0) {
			setSnackbarMessage("Cost cannot be negative or invalid.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		const parsedMaxQty = parseInt(max_qty, 10);
		const parsedQty = parseInt(qty, 10);

		if (
			isNaN(parsedMaxQty) ||
			isNaN(parsedQty) ||
			parsedQty < 0 ||
			parsedQty > parsedMaxQty
		) {
			setSnackbarMessage(
				"Quantity must be between 0 and the maximum quantity."
			);
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		try {
			if (dialogType === "Add") {
				const nameExists = inventoryData.some(
					(item) => item.name.toLowerCase() === trimmedName.toLowerCase()
				);

				if (nameExists) {
					setSnackbarMessage(
						"An inventory item with this name already exists."
					);
					setSnackbarSeverity("warning");
					setSnackbarOpen(true);
					return;
				}

				await axios.post("/api/inventory", {
					name: trimmedName,
					cost: parsedCost,
					max_qty: parsedMaxQty,
					qty: parsedQty,
				});
				setSnackbarMessage("Inventory item added successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			} else if (dialogType === "Edit") {
				await axios.put(`/api/inventory/${inventory_id}`, {
					name: trimmedName,
					cost: parsedCost,
					max_qty: parsedMaxQty,
					qty: parsedQty,
				});
				setSnackbarMessage("Inventory item updated successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			}
			fetchInventoryData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} inventory item:`,
				error
			);
			setSnackbarMessage(
				`Error ${dialogType === "Add" ? "adding" : "updating"} inventory item.`
			);
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const columns = [
		{ field: "inventory_id", headerName: "ID", width: 60 },
		{ field: "name", headerName: "Name", flex: 1, minWidth: 150 },
		{
			field: "cost",
			headerName: "Cost",
			width: 100,
			renderCell: (params) => {
				const value = parseFloat(params.row.cost);
				if (isNaN(value)) {
					return "$0.00";
				}
				return `$${value.toFixed(2)}`;
			},
		},
		{ field: "qty", headerName: "Qty", width: 80 },
		{ field: "max_qty", headerName: "Max Qty", width: 100 },
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
						onClick={() => handleEditInventoryItem(params.row)}
					>
						<EditIcon />
					</IconButton>
					<IconButton
						color="error"
						onClick={() => handleDeleteInventoryItem(params.row.inventory_id)}
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
					label="Search Inventory Items"
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
					onClick={handleAddInventoryItem}
					startIcon={<AddIcon />}
				>
					Add New Inventory Item
				</Button>
			</Box>

			{/* Inventory DataGrid */}
			<Box sx={{ height: "95%", width: "100%" }}>
				<DataGrid
					rows={inventoryData}
					columns={columns}
					getRowId={(row) => row.inventory_id}
					disableSelectionOnClick
					autoPageSize
				/>
			</Box>

			{/* Add/Edit Dialog */}
			<Dialog open={openDialog} onClose={handleDialogClose}>
				<DialogTitle>{dialogType} Inventory Item</DialogTitle>
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
					<TextField
						label="Cost"
						variant="outlined"
						fullWidth
						type="number"
						inputProps={{ min: 0, step: "0.01" }}
						value={currentItem.cost}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, cost: e.target.value })
						}
						sx={{ mt: 2 }}
					/>
					<TextField
						label="Max Quantity"
						variant="outlined"
						fullWidth
						type="number"
						inputProps={{ min: 0, step: "1" }}
						value={currentItem.max_qty}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, max_qty: e.target.value })
						}
						sx={{ mt: 2 }}
					/>
					<TextField
						label="Quantity"
						variant="outlined"
						fullWidth
						type="number"
						inputProps={{ min: 0, step: "1" }}
						value={currentItem.qty}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, qty: e.target.value })
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

			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
			>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this inventory item?
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

export default Inventory;
