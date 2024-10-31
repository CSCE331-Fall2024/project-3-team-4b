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

	useEffect(() => {
		fetchInventoryData();
	}, []);

	const fetchInventoryData = async () => {
		try {
			const response = await axios.get("/api/inventory");
			const data = response.data.map((item) => ({
				...item,
				cost: item.cost !== null ? Number(item.cost) : 0.0,
			}));
			setInventoryData(data);
		} catch (error) {
			console.error("Error fetching inventory data:", error);
			alert("Error fetching inventory data.");
		}
	};

	const handleSearch = async () => {
		try {
			const response = await axios.get(`/api/inventory?search=${searchText}`);

			setInventoryData(response.data);
		} catch (error) {
			console.error("Error searching inventory items:", error);
			alert("Error searching inventory items.");
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
		setCurrentItem({
			...item,
			// cost: item.cost !== null ? item.cost.toString() : "",
			// max_qty: item.max_qty !== null ? item.max_qty.toString() : "",
			// qty: item.qty !== null ? item.qty.toString() : "",
		});
		setOpenDialog(true);
	};

	const handleDeleteInventoryItem = async (inventory_id) => {
		if (
			window.confirm("Are you sure you want to delete this inventory item?")
		) {
			try {
				await axios.delete(`/api/inventory/${inventory_id}`);
				fetchInventoryData();
				alert("Inventory item deleted successfully.");
			} catch (error) {
				console.error("Error deleting inventory item:", error);
				alert("Error deleting inventory item.");
			}
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleDialogSave = async () => {
		const { inventory_id, name, cost, max_qty, qty } = currentItem;

		if (!name || cost === "" || max_qty === "" || qty === "") {
			alert("Please fill all fields.");
			return;
		}

		try {
			if (dialogType === "Add") {
				await axios.post("/api/inventory", {
					name,
					cost: cost,
					max_qty: parseInt(max_qty),
					qty: parseInt(qty),
				});
				alert("Inventory item added successfully.");
			} else if (dialogType === "Edit") {
				await axios.put(`/api/inventory/${inventory_id}`, {
					name,
					cost: cost,
					max_qty: parseInt(max_qty),
					qty: parseInt(qty),
				});
				alert("Inventory item updated successfully.");
			}
			fetchInventoryData();
			setOpenDialog(false);
		} catch (error) {
			console.error(
				`Error ${dialogType === "Add" ? "adding" : "updating"} inventory item:`,
				error
			);
			alert(
				`Error ${dialogType === "Add" ? "adding" : "updating"} inventory item.`
			);
		}
	};

	// Prepare data for DataGrid
	const columns = [
		{ field: "inventory_id", headerName: "ID", width: 60 },
		{ field: "name", headerName: "Name", flex: 1, minWidth: 50 },
		{
			field: "cost",
			headerName: "Cost",
			width: 90,
		},
		{ field: "qty", headerName: "Qty", width: 80 },
		{ field: "max_qty", headerName: "Max Qty", width: 80 },
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
		<Box sx={{ p: 2 }}>
			<Typography variant="h5" gutterBottom>
				Inventory
			</Typography>

			{/* Search and Add Buttons */}
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
					Add Inventory Item
				</Button>
			</Box>

			{/* Inventory DataGrid */}
			<Box sx={{ height: "80%", width: "100%" }}>
				<DataGrid
					rows={inventoryData}
					columns={columns}
					getRowId={(row) => row.inventory_id}
					disableSelectionOnClick
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
						value={currentItem.cost}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, cost: e.target.value })
						}
						sx={{ mt: 2 }}
						inputProps={{ step: "0.01" }}
					/>
					<TextField
						label="Max Quantity"
						variant="outlined"
						fullWidth
						type="number"
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
		</Box>
	);
}

export default Inventory;
