// ComboSelection.js
import React, { useContext, useEffect, useState } from "react";
import { KioskContext } from "./KioskContext";
import {
	Box,
	Grid,
	Typography,
	Card,
	CardContent,
	Button,
} from "@mui/material";

function ComboSelection({ isLargeText }) {
	const { setCurrentStep, setComboType, comboType, showSnackbar } =
		useContext(KioskContext);

	// Local state for combo types
	const comboTypes = ["Bowl", "Plate", "Bigger Plate"];

	// Set currentStep to 'comboSelection' when component mounts
	useEffect(() => {
		setCurrentStep("comboSelection");
	}, [setCurrentStep]);

	// Handle combo selection
	const handleComboSelect = (combo) => {
		setComboType(combo);
		setCurrentStep("sideSelection");
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
						Select a Combo
					</Typography>
				</Grid>
				{comboTypes.map((combo) => (
					<Grid item xs={12} sm={4} key={combo}>
						<Card
							onClick={() => handleComboSelect(combo)}
							sx={{ cursor: "pointer", padding: 2, textAlign: "center" }}
						>
							<CardContent>
								<Typography
									variant="h5"
									sx={{
										fontSize: isLargeText ? "1.75rem" : "1.25rem",
										fontWeight: "bold",
									}}
								>
									{combo}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default ComboSelection;
