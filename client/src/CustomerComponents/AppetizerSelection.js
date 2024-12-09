import React, { useContext, useEffect } from "react";
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
 * @fileoverview A React component that allows the user to browse and select appetizers.
 * Users can increment or decrement the quantity of selected appetizers before adding them
 * to their order. This component integrates with the KioskContext for state management.
 */

/**
 * AppetizerSelection component.
 * Provides a UI for selecting appetizers, adjusting their quantities, and adding them to the cart.
 *
 * @function AppetizerSelection
 * @param {Object} props
 * @param {boolean} props.isLargeText - A boolean indicating if larger text size should be used.
 * @returns {JSX.Element} The rendered appetizer selection interface.
 */
function AppetizerSelection({ isLargeText }) {
	const {
		menuData,
		handleAddItemsToOrder,
		setCurrentStep,
		showSnackbar,
		selectedAppetizers,
		setSelectedAppetizers,
	} = useContext(KioskContext);

	/**
	 * Constructs the URL for an appetizer image based on its name.
	 * @param {string} name - The name of the appetizer.
	 * @returns {string} The constructed image URL.
	 */
	const getImageUrl = (name) =>
		`/images/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

	/**
	 * Updates the quantity of a given appetizer.
	 * If the appetizer already exists in the selectedAppetizers state, its quantity is updated.
	 * If it doesn't exist yet and delta > 0, it's added.
	 * If the quantity drops to 0 or below, the appetizer is removed from the selection.
	 *
	 * @param {Object} appetizer - The appetizer object from the menuData.
	 * @param {number} delta - The change in quantity (positive or negative).
	 */
	const updateAppetizerQuantity = (appetizer, delta) => {
		setSelectedAppetizers((prevItems) => {
			const index = prevItems.findIndex(
				(item) => item.menu_id === appetizer.menu_id
			);
			const updatedItems = [...prevItems];
			if (index >= 0) {
				updatedItems[index].quantity += delta;
				if (updatedItems[index].quantity <= 0) {
					updatedItems.splice(index, 1);
				}
			} else if (delta > 0) {
				updatedItems.push({ ...appetizer, quantity: delta });
			}
			return updatedItems;
		});
	};

	// Set currentStep to 'appetizerSelection' when component mounts
	useEffect(() => {
		setCurrentStep("appetizerSelection");
	}, [setCurrentStep]);

	/**
	 * Handles adding the currently selected appetizers to the cart.
	 * Constructs an order array and passes it to handleAddItemsToOrder.
	 */
	const handleAddToCart = () => {
		const appetizersOrder = selectedAppetizers.map((appetizer) => ({
			type: "Appetizer",
			item: appetizer,
			quantity: appetizer.quantity,
			subtotal: parseFloat(appetizer.price) * appetizer.quantity,
		}));
		handleAddItemsToOrder(appetizersOrder);
		setSelectedAppetizers([]);
		showSnackbar("Appetizers added to cart.", "success");
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
						Select Appetizers
					</Typography>
				</Grid>
				{menuData
					.filter((item) => item.type === "Appetizer")
					.map((appetizer) => {
						const selectedItem = selectedAppetizers.find(
							(app) => app.menu_id === appetizer.menu_id
						);
						const quantity = selectedItem ? selectedItem.quantity : 0;
						return (
							<Grid item xs={12} sm={4} key={appetizer.menu_id}>
								<Card sx={{ cursor: "pointer" }}>
									<CardMedia
										component="img"
										image={getImageUrl(appetizer.name)}
										alt={appetizer.name}
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
											{appetizer.name}
										</Typography>
										<Typography
											sx={{
												fontSize: isLargeText ? "1.25rem" : "0.875rem",
												fontWeight: "normal",
											}}
										>
											Price: ${parseFloat(appetizer.price).toFixed(2)}
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
												onClick={() => updateAppetizerQuantity(appetizer, -1)}
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
											<IconButton
												onClick={() => updateAppetizerQuantity(appetizer, 1)}
											>
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
				{selectedAppetizers.length > 0 && (
					<Button variant="contained" onClick={handleAddToCart}>
						Add to Cart
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default AppetizerSelection;
