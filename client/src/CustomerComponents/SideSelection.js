// SideSelection.js
import React, { useContext, useEffect } from "react";
import { KioskContext } from "./KioskContext";
import {
	Box,
	Grid,
	Typography,
	Card,
	CardMedia,
	CardContent,
	Button,
} from "@mui/material";

function SideSelection({ isLargeText }) {
	const {
		setCurrentStep,
		setSelectedSide,
		selectedSide,
		showSnackbar,
		menuData,
	} = useContext(KioskContext);

	// Set currentStep to 'sideSelection' when component mounts
	useEffect(() => {
		setCurrentStep("sideSelection");
	}, [setCurrentStep]);

	// Handle side selection
	const handleSideSelect = (side) => {
		setSelectedSide(side);
		setCurrentStep("entreeSelection");
	};

	// Define getImageUrl function
	const getImageUrl = (name) =>
		`/images/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

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
						Select a Side
					</Typography>
				</Grid>
				{menuData
					.filter((item) => item.type === "Side")
					.map((side) => (
						<Grid item xs={12} sm={4} key={side.menu_id}>
							<Card
								onClick={() => handleSideSelect(side)}
								sx={{
									cursor: "pointer",
									border:
										selectedSide?.menu_id === side.menu_id
											? "2px solid #D1282E"
											: "1px solid #ccc",
								}}
							>
								<CardMedia
									component="img"
									image={getImageUrl(side.name)}
									alt={side.name}
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
										{side.name}
									</Typography>
									{side.extra_cost && side.extra_cost !== "0" && (
										<Typography
											sx={{
												fontSize: isLargeText ? "1.25rem" : "0.875rem",
												fontWeight: "normal",
											}}
										>
											Extra Cost: ${side.extra_cost}
										</Typography>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
			</Grid>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: 2,
					maxWidth: "100%",
				}}
			>
				<Button
					onClick={() => setCurrentStep("comboSelection")}
					variant="outlined"
				>
					Back
				</Button>
				{selectedSide && (
					<Button
						variant="contained"
						onClick={() => setCurrentStep("entreeSelection")}
					>
						Next
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default SideSelection;
