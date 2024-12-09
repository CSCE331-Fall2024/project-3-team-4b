import React, { useContext, useEffect, useState } from "react";
import { KioskContext } from "./KioskContext";
import {
	Box,
	Grid,
	Typography,
	Card,
	CardMedia,
	CardContent,
	IconButton,
	Button,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

/**
 * @fileoverview A React component that allows users to select drinks.
 * Users can increment or decrement the quantity of each drink before adding them to the cart.
 */

/**
 * DrinkSelection component.
 * Displays available drink items, allows the user to adjust quantities, and add them to the order.
 *
 * @function DrinkSelection
 * @param {Object} props
 * @param {boolean} props.isLargeText - Determines if larger text should be used for accessibility.
 * @returns {JSX.Element} The rendered component for drink selection.
 */
function DrinkSelection({ isLargeText }) {
	const { menuData, handleAddItemsToOrder, setCurrentStep, showSnackbar } =
		useContext(KioskContext);

	const [selectedDrinks, setSelectedDrinks] = useState([]);

	/**
	 * Constructs an image URL for a given drink name by converting it into a lowercase,
	 * underscore-separated format.
	 *
	 * @param {string} name - The drink name.
	 * @returns {string} The constructed image URL.
	 */
	const getImageUrl = (name) =>
		`/images/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

	/**
	 * Updates the quantity of a given drink.
	 * If the drink exists in the selectedDrinks array, its quantity is updated.
	 * If it doesn't exist and delta > 0, it is added.
	 * If quantity drops to 0 or below, the drink is removed from the selection.
	 *
	 * @param {Object} drink - The drink object from the menuData.
	 * @param {number} delta - The change in quantity (positive or negative).
	 */
	const updateDrinkQuantity = (drink, delta) => {
		setSelectedDrinks((prevItems) => {
			const index = prevItems.findIndex(
				(item) => item.menu_id === drink.menu_id
			);
			const updatedItems = [...prevItems];
			if (index >= 0) {
				updatedItems[index].quantity += delta;
				if (updatedItems[index].quantity <= 0) {
					updatedItems.splice(index, 1);
				}
			} else if (delta > 0) {
				updatedItems.push({ ...drink, quantity: delta });
			}
			return updatedItems;
		});
	};

	// Set currentStep to 'drinkSelection' when component mounts
	useEffect(() => {
		setCurrentStep("drinkSelection");
	}, [setCurrentStep]);

	/**
	 * Handles adding the currently selected drinks to the cart.
	 * Constructs an order array and passes it to handleAddItemsToOrder.
	 */
	const handleAddToCart = () => {
		const drinksOrder = selectedDrinks.map((drink) => ({
			type: "Drink",
			item: drink,
			quantity: drink.quantity,
			subtotal: parseFloat(drink.price) * drink.quantity,
		}));
		handleAddItemsToOrder(drinksOrder);
		setSelectedDrinks([]);
		showSnackbar("Drinks added to cart.", "success");
	};

	return (
		<Box
			sx={{
				padding: 2,
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Grid container spacing={2} sx={{ marginTop: 2, flexGrow: 1 }}>
				<Grid item xs={12}>
					<Typography
						variant="h4"
						sx={{
							fontSize: isLargeText ? "2rem" : "1.5rem",
							fontWeight: "bold",
							textTransform: "uppercase",
							marginBottom: 2,
						}}
					>
						Select Drinks
					</Typography>
				</Grid>
				{menuData
					.filter((item) => item.type === "Drink")
					.map((drink) => {
						const selectedItem = selectedDrinks.find(
							(item) => item.menu_id === drink.menu_id
						);
						const quantity = selectedItem ? selectedItem.quantity : 0;
						return (
							<Grid item xs={12} sm={4} key={drink.menu_id}>
								<Card sx={{ cursor: "pointer" }}>
									<CardMedia
										component="img"
										image={getImageUrl(drink.name)}
										alt={drink.name}
										sx={{ height: 140, objectFit: "contain" }}
									/>
									<CardContent>
										<Typography
											variant="h6"
											sx={{
												fontSize: isLargeText ? "1.5rem" : "1rem",
												fontWeight: "bold",
											}}
										>
											{drink.name}
										</Typography>
										<Typography
											sx={{
												fontSize: isLargeText ? "1.25rem" : "0.875rem",
												fontWeight: "normal",
											}}
										>
											Price: ${parseFloat(drink.price).toFixed(2)}
										</Typography>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												marginTop: 1,
											}}
										>
											<IconButton
												onClick={() => updateDrinkQuantity(drink, -1)}
												disabled={quantity === 0}
											>
												<RemoveCircleOutlineIcon />
											</IconButton>
											<Typography
												sx={{
													margin: "0 1rem",
													fontSize: isLargeText ? "1.25rem" : "1rem",
												}}
											>
												{quantity}
											</Typography>
											<IconButton onClick={() => updateDrinkQuantity(drink, 1)}>
												<AddCircleOutlineIcon />
											</IconButton>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						);
					})}
			</Grid>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: 2,
				}}
			>
				<Button
					onClick={() => setCurrentStep("categorySelection")}
					variant="outlined"
				>
					Back
				</Button>
				{selectedDrinks.length > 0 && (
					<Button variant="contained" onClick={handleAddToCart}>
						Add to Cart
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default DrinkSelection;
