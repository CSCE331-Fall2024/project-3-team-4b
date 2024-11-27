// CategorySelection.js
import React, { useContext, useEffect, useRef } from "react";
import { KioskContext } from "./KioskContext";
import { Box, Grid, Typography, Card } from "@mui/material";
import alanBtn from "@alan-ai/alan-sdk-web"; // Import the Alan AI SDK

function CategorySelection({ isLargeText }) {
	const {
		setCurrentStep,
		setSelectedCombo,
		setSelectedSide,
		currentStep,
		setSnackbar,
	} = useContext(KioskContext);

	// Create a ref to store the Alan AI instance
	const alanBtnInstance = useRef(null);

	// Initialize Alan AI and store the instance in the ref
	useEffect(() => {
		if (!alanBtnInstance.current) {
			alanBtnInstance.current = alanBtn({
				key: "fcc4852254e3439d87d8ab67e5a08e922e956eca572e1d8b807a3e2338fdd0dc/stage",
				onCommand: (commandData) => {
					const { command, category } = commandData;
					if (command === "selectCategory") {
						handleCategoryClick(category);
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
	}, []); // Empty dependency array ensures this runs once on component mount

	// Set currentStep to 'categorySelection' when component mounts
	useEffect(() => {
		setCurrentStep("categorySelection");
	}, [setCurrentStep]);

	// Update Alan AI with the visual state whenever currentStep changes
	useEffect(() => {
		if (alanBtnInstance.current) {
			alanBtnInstance.current.setVisualState({ currentStep });
		}
	}, [currentStep]);

	// Handle category selection via UI click or voice command
	const handleCategoryClick = (category) => {
		const normalizedCategory = category.toLowerCase();
		switch (normalizedCategory) {
			case "combos":
				setSelectedCombo(null);
				setSelectedSide(null);
				setCurrentStep("comboSelection");
				break;
			case "appetizers":
				setCurrentStep("appetizerSelection");
				break;
			case "drinks":
				setCurrentStep("drinkSelection");
				break;
			default:
				setSnackbar({
					open: true,
					message: `Category ${category} is not available.`,
					severity: "error",
				});
				break;
		}
	};

	return (
		<Box sx={{ padding: 2 }}>
			<div id="alan-btn"></div> {/* Optional: Placeholder for Alan AI button */}
			<Grid container spacing={2} sx={{ marginTop: 2 }}>
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
						Select a Category
					</Typography>
				</Grid>
				{["Combos", "Appetizers", "Drinks"].map((category) => (
					<Grid item xs={12} sm={4} key={category}>
						<Card
							onClick={() => handleCategoryClick(category)}
							sx={{ cursor: "pointer", padding: 2, textAlign: "center" }}
						>
							<Typography
								variant="h5"
								sx={{
									fontSize: isLargeText ? "1.75rem" : "1.25rem",
									fontWeight: "bold",
								}}
							>
								{category}
							</Typography>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default CategorySelection;
