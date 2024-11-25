import React, { useState, useEffect } from "react";
import IngredientSelector from "./IngredientSelector";
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
	Typography,
} from "@mui/material";

/**
 * Menu component for managing and displaying menu items.
 *
 * @component
 * @returns {JSX.Element} The rendered Menu component.
 */
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
	const [currentRecipe, setCurrentRecipe] = useState([]);
	const [recipeModalOpen, setRecipeModalOpen] = useState(false);
	const [recipeChanged, setRecipeChanged] = useState(false);

	useEffect(() => {
		fetchMenuData();
	}, []);

	/**
	 * Fetches the menu data from the server.
	 */
	const fetchMenuData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/menu"
			);
			setMenuData(response.data);
		} catch (error) {
			setSnackbarMessage("Error fetching menu data.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	/**
	 * Handles the search operation for menu items.
	 */
	const handleSearch = async () => {
		try {
			const response = await axios.get(
				`https://project-3-team-4b-server.vercel.app/api/menu?search=${searchText}`
			);
			setMenuData(response.data);
		} catch (error) {
			setSnackbarMessage("Error searching menu items.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	/**
	 * Clears the search text and reloads the full menu data.
	 */
	const handleClearSearch = () => {
		setSearchText("");
		fetchMenuData();
	};

	/**
	 * Opens the dialog to add a new menu item.
	 */
	const handleAddMenuItem = () => {
		setDialogType("Add");
		setCurrentItem({
			menu_id: "",
			name: "",
			type: "",
			extra_cost: "",
			calories: "",
		});
		setCurrentRecipe([]);
		setRecipeChanged(false);
		setOpenDialog(true);
	};

	/**
	 * Opens the dialog to edit an existing menu item.
	 * @param {Object} item - The menu item to edit.
	 */
	const handleEditMenuItem = async (item) => {
		setDialogType("Edit");
		setCurrentItem({ ...item });
		setRecipeChanged(false);

		try {
			const menuId = item.menu_id;
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/Recipe"
			);
			const allRecipes = response.data;

			const associatedRecipes = allRecipes.filter(
				(recipe) => recipe.menu_id === menuId
			);

			if (associatedRecipes.length > 0) {
				const inventoryResponse = await axios.get(
					"https://project-3-team-4b-server.vercel.app/api/inventory"
				);
				const inventoryData = inventoryResponse.data;

				const currentRecipeData = associatedRecipes.map((recipe) => {
					const ingredient = inventoryData.find(
						(invItem) => invItem.inventory_id === recipe.inventory_id
					);
					return {
						inventory_id: recipe.inventory_id,
						qty: recipe.qty,
						name: ingredient ? ingredient.name : "Unknown",
					};
				});

				setCurrentRecipe(currentRecipeData);
			} else {
				setCurrentRecipe([]);
			}
		} catch (error) {
			setSnackbarMessage(`Error fetching recipe data: ${error.message}`);
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}

		setOpenDialog(true);
	};

	/**
	 * Opens the confirmation dialog to delete a menu item.
	 * @param {number} menu_id - The ID of the menu item to delete.
	 */
	const handleDeleteMenuItem = (menu_id) => {
		setItemToDelete(menu_id);
		setConfirmDialogOpen(true);
	};

	/**
	 * Confirms and deletes the selected menu item.
	 */
	const handleConfirmDelete = async () => {
		try {
			const recipeResponse = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/Recipe"
			);
			const allRecipes = recipeResponse.data;

			const recipesToDelete = allRecipes.filter(
				(recipe) => recipe.menu_id === itemToDelete
			);

			for (const recipe of recipesToDelete) {
				await axios.delete(
					`https://project-3-team-4b-server.vercel.app/api/Recipe/${recipe.recipe_id}`
				);
			}

			await axios.delete(
				`https://project-3-team-4b-server.vercel.app/api/menu/${itemToDelete}`
			);
			fetchMenuData();
			setSnackbarMessage("Menu item deleted successfully.");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
		} catch (error) {
			setSnackbarMessage("Error deleting menu item.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		} finally {
			setConfirmDialogOpen(false);
			setItemToDelete(null);
		}
	};

	/**
	 * Closes the add/edit dialog.
	 */
	const handleDialogClose = () => {
		setOpenDialog(false);
		setCurrentItem({
			menu_id: "",
			name: "",
			type: "",
			extra_cost: "",
			calories: "",
		});
		setCurrentRecipe([]);
		setRecipeChanged(false);
	};

	/**
	 * Opens the recipe modal to add or edit a recipe.
	 */
	const handleAddEditRecipe = () => {
		setRecipeModalOpen(true);
	};

	/**
	 * Handles the recipe confirmation from the IngredientSelector component.
	 * @param {Array} selectedIngredients - The selected ingredients with quantities.
	 */
	const handleRecipeConfirm = (selectedIngredients) => {
		if (selectedIngredients.length === 0) {
			setSnackbarMessage("Please select at least one ingredient.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		const newRecipe = selectedIngredients.map((ingredient) => ({
			inventory_id: ingredient.inventory_id,
			qty: parseFloat(ingredient.qty),
			name: ingredient.name,
		}));

		const sortedCurrentRecipe = [...currentRecipe].sort(
			(a, b) => a.inventory_id - b.inventory_id
		);
		const sortedNewRecipe = [...newRecipe].sort(
			(a, b) => a.inventory_id - b.inventory_id
		);

		const recipesEqual =
			sortedCurrentRecipe.length === sortedNewRecipe.length &&
			sortedCurrentRecipe.every((item, index) => {
				const newItem = sortedNewRecipe[index];
				return (
					item.inventory_id === newItem.inventory_id && item.qty === newItem.qty
				);
			});

		setCurrentRecipe(newRecipe);
		setRecipeChanged(!recipesEqual);
		setRecipeModalOpen(false);

		if (!recipesEqual) {
			setSnackbarMessage("Recipe updated successfully.");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
		}
	};

	/**
	 * Saves the menu item (add or edit) after validation.
	 */
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

		if (parseInt(calories, 10) < 0) {
			setSnackbarMessage("Calories cannot be negative.");
			setSnackbarSeverity("warning");
			setSnackbarOpen(true);
			return;
		}

		if (currentRecipe.length === 0) {
			setSnackbarMessage("Please add a recipe for this menu item.");
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

				const response = await axios.post(
					"https://project-3-team-4b-server.vercel.app/api/menu",
					{
						name,
						type,
						extra_cost: parseFloat(extra_cost),
						calories: parseInt(calories, 10),
					}
				);

				const newMenuItem = response.data;
				const newMenuId = newMenuItem.menu_id;

				for (const recipeItem of currentRecipe) {
					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/Recipe",
						{
							menu_id: newMenuId,
							inventory_id: recipeItem.inventory_id,
							qty: recipeItem.qty,
						}
					);
				}

				setSnackbarMessage("Menu item added successfully.");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			} else if (dialogType === "Edit") {
				const originalItem = menuData.find((item) => item.menu_id === menu_id);
				const menuItemChanged =
					originalItem.name !== name ||
					originalItem.type !== type ||
					parseFloat(originalItem.extra_cost) !== parseFloat(extra_cost) ||
					parseInt(originalItem.calories, 10) !== parseInt(calories, 10);

				if (
					originalItem.name.toLowerCase() !== name.toLowerCase() &&
					menuData.some(
						(item) =>
							item.name.toLowerCase() === name.toLowerCase() &&
							item.menu_id !== menu_id
					)
				) {
					setSnackbarMessage("A menu item with this name already exists.");
					setSnackbarSeverity("warning");
					setSnackbarOpen(true);
					return;
				}

				if (menuItemChanged) {
					await axios.put(
						`https://project-3-team-4b-server.vercel.app/api/menu/${menu_id}`,
						{
							name,
							type,
							extra_cost: parseFloat(extra_cost),
							calories: parseInt(calories, 10),
						}
					);
				}

				if (recipeChanged) {
					const recipeResponse = await axios.get(
						"https://project-3-team-4b-server.vercel.app/api/Recipe"
					);
					const allRecipes = recipeResponse.data;

					const recipesToDelete = allRecipes.filter(
						(recipe) => recipe.menu_id === menu_id
					);

					for (const recipe of recipesToDelete) {
						await axios.delete(
							`https://project-3-team-4b-server.vercel.app/api/Recipe/${recipe.recipe_id}`
						);
					}

					for (const recipeItem of currentRecipe) {
						await axios.post(
							"https://project-3-team-4b-server.vercel.app/api/Recipe",
							{
								menu_id: menu_id,
								inventory_id: recipeItem.inventory_id,
								qty: recipeItem.qty,
							}
						);
					}
				}

				if (menuItemChanged || recipeChanged) {
					setSnackbarMessage("Menu item updated successfully.");
					setSnackbarSeverity("success");
					setSnackbarOpen(true);
				} else {
					setSnackbarMessage("No changes made.");
					setSnackbarSeverity("info");
					setSnackbarOpen(true);
				}
			}
			fetchMenuData();
			setOpenDialog(false);
		} catch (error) {
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
				return isNaN(value) ? "$0.00" : `$${value.toFixed(2)}`;
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
					sortModel={[
						{
							field: "menu_id",
							sort: "asc",
						},
					]}
				/>
			</Box>

			{/* Add/Edit Menu Item Dialog */}
			<Dialog
				open={openDialog}
				onClose={handleDialogClose}
				maxWidth="sm"
				fullWidth
			>
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

					{/* Display current recipe */}
					{currentRecipe.length > 0 && (
						<Box sx={{ mt: 2 }}>
							<Typography variant="h6">Current Recipe:</Typography>
							<DataGrid
								rows={currentRecipe.map((item) => ({
									id: item.inventory_id,
									name: item.name,
									qty: item.qty,
								}))}
								columns={[
									{ field: "name", headerName: "Ingredient", flex: 1 },
									{ field: "qty", headerName: "Quantity", width: 120 },
								]}
								autoHeight
								hideFooter
							/>
						</Box>
					)}

					{/* Add/Edit Recipe Button */}
					<Button
						variant="outlined"
						onClick={handleAddEditRecipe}
						sx={{ mt: 2 }}
					>
						{currentRecipe.length > 0 ? "Edit Recipe" : "Add Recipe"}
					</Button>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button
						onClick={handleDialogSave}
						variant="contained"
						color="primary"
					>
						{dialogType === "Add" ? "Finish" : "Update"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Ingredient Selector Component */}
			<IngredientSelector
				open={recipeModalOpen}
				onClose={() => setRecipeModalOpen(false)}
				onConfirm={handleRecipeConfirm}
				currentRecipe={currentRecipe}
			/>

			{/* Snackbar for notifications */}
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

			{/* Confirm Delete Dialog */}
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
