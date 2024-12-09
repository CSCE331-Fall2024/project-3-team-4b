// CategorySelection.js

import React, { useContext, useEffect } from "react";
import { KioskContext } from "./KioskContext";
import { Box, Grid, Typography, Card } from "@mui/material";

/**
 * @fileoverview A React component that allows the user to select a category of items (Combos, Appetizers, Drinks).
 * Selecting a category updates the kiosk state and navigates the user to the corresponding selection page.
 */

/**
 * CategorySelection component.
 * Displays available categories and navigates to the respective selection pages when a category is chosen.
 *
 * @function CategorySelection
 * @param {Object} props
 * @param {boolean} props.isLargeText - A boolean to determine if larger text size should be used.
 * @returns {JSX.Element} The rendered category selection interface.
 */
function CategorySelection({ isLargeText }) {
	const {
		setCurrentStep,
		setSelectedCombo,
		setSelectedSide,
		setSelectedEntrees,
		showSnackbar,
		setSelectedCategory,
	} = useContext(KioskContext);

	// Set currentStep to 'categorySelection' when component mounts
	useEffect(() => {
		setCurrentStep("categorySelection");
		console.log("currentStep set to 'categorySelection'");
	}, [setCurrentStep]);

	/**
	 * Handles category selection. Depending on the chosen category,
	 * updates global state and navigates to the corresponding step.
	 *
	 * @param {string} category - The category selected by the user.
	 */
	const handleCategoryClick = (category) => {
		console.log(`handleCategoryClick called with category: ${category}`);
		const normalizedCategory = category.toLowerCase();
		setSelectedCategory(normalizedCategory); // Set selectedCategory
		switch (normalizedCategory) {
			case "combos":
				console.log("Navigating to comboSelection");
				setSelectedCombo(null);
				setSelectedSide(null);
				setSelectedEntrees([]);
				setCurrentStep("comboSelection");
				break;
			case "appetizers":
				console.log("Navigating to appetizerSelection");
				setCurrentStep("appetizerSelection");
				break;
			case "drinks":
				console.log("Navigating to drinkSelection");
				setCurrentStep("drinkSelection");
				break;
			default:
				console.log("Invalid category selected:", category);
				showSnackbar(`Category "${category}" is not available.`, "error");
				break;
		}
	};

	return (
		<Box sx={{ padding: 2 }}>
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
