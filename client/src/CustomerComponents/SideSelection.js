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

/**
 * @fileoverview A React component that allows the user to select a side dish as part of a combo meal.
 * After selecting a side, the user proceeds to entree selection.
 */

/**
 * SideSelection component.
 * Displays a list of side options from the menu. The user can select one side and move on to the next step.
 *
 * @function SideSelection
 * @param {Object} props
 * @param {boolean} props.isLargeText - Whether to use larger font sizes for accessibility.
 * @returns {JSX.Element} The rendered side selection interface.
 */
function SideSelection({ isLargeText }) {
	const { menuData, selectedSide, setSelectedSide, setCurrentStep } =
		useContext(KioskContext);

	useEffect(() => {
		setCurrentStep("sideSelection");
	}, [setCurrentStep]);

	/**
	 * Handles the user's click on a side item, setting it as the selected side.
	 * @param {Object} side - The side item chosen by the user.
	 */
	const handleSideClick = (side) => {
		setSelectedSide(side);
	};

	/**
	 * Constructs an image URL for the given side name by converting it into a lowercase,
	 * underscore-separated format.
	 *
	 * @param {string} name - The side item name.
	 * @returns {string} The constructed image URL.
	 */
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
								onClick={() => handleSideClick(side)}
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
