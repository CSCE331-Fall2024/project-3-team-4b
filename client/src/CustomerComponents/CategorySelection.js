// CategorySelection.js

import React, { useContext, useEffect } from "react";
import { KioskContext } from "./KioskContext";
import { Box, Grid, Typography, Card } from "@mui/material";

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

	// Handle category selection via UI click
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
