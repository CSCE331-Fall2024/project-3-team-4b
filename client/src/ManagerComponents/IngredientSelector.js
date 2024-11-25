import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Checkbox,
	TextField,
	Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Snackbar, Alert } from "@mui/material";

/**
 * IngredientSelector component allows users to select ingredients from the inventory
 * and specify quantities for a recipe.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines if the dialog is open.
 * @param {function} props.onClose - Callback function to close the dialog.
 * @param {function} props.onConfirm - Callback function to confirm the selected ingredients.
 * @param {Array} props.currentRecipe - The current recipe with selected ingredients.
 *
 * @returns {JSX.Element} The IngredientSelector component.
 */
function IngredientSelector({ open, onClose, onConfirm, currentRecipe }) {
	const [selectedIngredients, setSelectedIngredients] = useState([]);
	const [inventoryData, setInventoryData] = useState([]);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	useEffect(() => {
		if (open) {
			fetchInventoryData();
		}
	}, [open]);

	useEffect(() => {
		if (inventoryData.length > 0) {
			initializeSelectedIngredients();
		}
	}, [inventoryData, currentRecipe]);

	const fetchInventoryData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/inventory"
			);
			setInventoryData(response.data);
		} catch (error) {
			console.error("Error fetching inventory data:", error);
			setSnackbarMessage("Error fetching inventory data.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const initializeSelectedIngredients = () => {
		const initialSelectedIngredients = inventoryData.map((item) => {
			const existingRecipeItem = currentRecipe.find(
				(recipeItem) => recipeItem.inventory_id === item.inventory_id
			);
			return {
				id: item.inventory_id,
				inventory_id: item.inventory_id,
				name: item.name,
				qty: existingRecipeItem ? existingRecipeItem.qty : "",
				selected: !!existingRecipeItem,
			};
		});
		setSelectedIngredients(initialSelectedIngredients);
	};

	const handleIngredientSelect = (id, selected) => {
		setSelectedIngredients((prev) =>
			prev.map((ingredient) =>
				ingredient.id === id
					? { ...ingredient, selected, qty: selected ? ingredient.qty : "" }
					: ingredient
			)
		);
	};

	const handleIngredientQtyChange = (id, qty) => {
		setSelectedIngredients((prev) =>
			prev.map((ingredient) =>
				ingredient.id === id ? { ...ingredient, qty } : ingredient
			)
		);
	};

	const handleConfirm = () => {
		const selected = selectedIngredients.filter(
			(ingredient) => ingredient.selected
		);
		for (const ingredient of selected) {
			const qty = parseFloat(ingredient.qty);
			if (isNaN(qty) || qty <= 0) {
				setSnackbarMessage(
					"Please enter valid numeric quantities greater than zero."
				);
				setSnackbarSeverity("warning");
				setSnackbarOpen(true);
				return;
			}
		}
		onConfirm(selected);
	};

	const ingredientColumns = [
		{
			field: "selected",
			headerName: "",
			width: 50,
			renderCell: (params) => (
				<Checkbox
					checked={params.row.selected || false}
					onChange={(e) => {
						handleIngredientSelect(params.row.id, e.target.checked);
					}}
				/>
			),
		},
		{ field: "name", headerName: "Ingredient", flex: 1, minWidth: 150 },
		{
			field: "qty",
			headerName: "Quantity",
			width: 120,
			renderCell: (params) =>
				params.row.selected ? (
					<TextField
						value={params.row.qty}
						onChange={(e) => {
							handleIngredientQtyChange(params.row.id, e.target.value);
						}}
						placeholder="1"
						size="small"
						type="number"
						inputProps={{ min: 1, step: "1" }}
					/>
				) : (
					""
				),
		},
	];

	return (
		<>
			<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
				<DialogTitle>Select Ingredients</DialogTitle>
				<DialogContent>
					{inventoryData.length === 0 ? (
						<Typography variant="body1">No ingredients available.</Typography>
					) : (
						<Box sx={{ height: 400, width: "100%" }}>
							<DataGrid
								rows={selectedIngredients}
								columns={ingredientColumns}
								checkboxSelection={false}
								disableSelectionOnClick
								hideFooter
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
					<Button onClick={handleConfirm} variant="contained" color="primary">
						Confirm
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
		</>
	);
}

export default IngredientSelector;
