// DrinkSelection.js
import React, { useContext, useEffect, useRef, useCallback } from "react";
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
import alanBtn from "@alan-ai/alan-sdk-web"; // Import the Alan AI SDK

function DrinkSelection({ isLargeText }) {
	const {
		menuData,
		selectedDrinks,
		drinkPrice,
		updateItemQuantity,
		handleAddDrinksToOrder,
		setCurrentStep,
		currentStep,
		showSnackbar,
	} = useContext(KioskContext);

	const getImageUrl = (name) =>
		`/images/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

	const handleIncreaseDrinkQuantity = (drink) => {
		updateItemQuantity("drink", drink, 1);
	};

	const handleDecreaseDrinkQuantity = (drink) => {
		updateItemQuantity("drink", drink, -1);
	};

	// Set currentStep to 'drinkSelection' when component mounts
	useEffect(() => {
		setCurrentStep("drinkSelection");
	}, [setCurrentStep]);

	// Create a ref to store the Alan AI instance
	const alanBtnInstance = useRef(null);

	// Memoize functions used in onCommand to prevent stale closures
	const handleAddDrinkByVoice = useCallback(
		(drinkName, quantity) => {
			const normalizedDrinkName = drinkName.toLowerCase().trim();
			const drink = menuData.find(
				(item) =>
					item.type === "Drink" &&
					item.name.toLowerCase() === normalizedDrinkName
			);
			if (drink) {
				updateItemQuantity("drink", drink, quantity);
				showSnackbar(
					`Added ${quantity} ${drink.name}(s) to your selection.`,
					"success"
				);
			} else {
				showSnackbar(`Drink ${drinkName} is not available.`, "error");
			}
		},
		[menuData, updateItemQuantity, showSnackbar]
	);

	const handleConfirmDrinksByVoice = useCallback(() => {
		if (selectedDrinks.length > 0) {
			handleAddDrinksToOrder();
		} else {
			showSnackbar("You have not selected any drinks.", "warning");
		}
	}, [selectedDrinks, handleAddDrinksToOrder, showSnackbar]);

	const handleGoBackByVoice = useCallback(() => {
		setCurrentStep("categorySelection");
	}, [setCurrentStep]);

	// Initialize Alan AI and store the instance in the ref
	useEffect(() => {
		if (!alanBtnInstance.current) {
			alanBtnInstance.current = alanBtn({
				key: "fcc4852254e3439d87d8ab67e5a08e922e956eca572e1d8b807a3e2338fdd0dc/stage",
				onCommand: (commandData) => {
					const { command, drinkName, quantity } = commandData;
					if (command === "addDrink") {
						handleAddDrinkByVoice(drinkName, quantity);
					} else if (command === "confirmDrinks") {
						handleConfirmDrinksByVoice();
					} else if (command === "goBack") {
						handleGoBackByVoice();
					}
				},
				rootEl: document.getElementById("alan-btn"), // Optional: specify the root element for the Alan AI button
			});
		}

		// Cleanup function to remove the Alan AI button
		return () => {
			if (alanBtnInstance.current) {
				alanBtnInstance.current.deactivate();
				alanBtnInstance.current.remove();
				alanBtnInstance.current = null;
			}
		};
	}, [handleAddDrinkByVoice, handleConfirmDrinksByVoice, handleGoBackByVoice]);

	// Update Alan AI with the visual state whenever currentStep changes
	useEffect(() => {
		if (alanBtnInstance.current) {
			alanBtnInstance.current.setVisualState({ currentStep });
		}
	}, [currentStep]);

	return (
		<Box
			sx={{
				padding: 2,
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div id="alan-btn"></div> {/* Placeholder for Alan AI button */}
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
							(dr) => dr.item.menu_id === drink.menu_id
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
											Price: ${drinkPrice.toFixed(2)}
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
												onClick={() => handleDecreaseDrinkQuantity(drink)}
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
												onClick={() => handleIncreaseDrinkQuantity(drink)}
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
				{selectedDrinks.length > 0 && (
					<Button variant="contained" onClick={handleAddDrinksToOrder}>
						Add to Cart
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default DrinkSelection;
