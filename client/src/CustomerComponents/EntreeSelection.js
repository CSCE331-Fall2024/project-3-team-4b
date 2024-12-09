import React, { useContext } from "react";
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
 * @fileoverview A React component that allows users to select entrees for their combo.
 * Users can add or remove entrees until the required number of entrees for the combo is reached.
 */

/**
 * EntreeSelection component.
 * Displays available entrees and enables the user to increment or decrement the quantity
 * of each entree until the required total is selected. Once the required number is reached,
 * the user can add the combo to the cart.
 *
 * @function EntreeSelection
 * @param {Object} props
 * @param {boolean} props.isLargeText - Determines if larger text should be used for accessibility.
 * @returns {JSX.Element} The rendered component for entree selection.
 */
function EntreeSelection({ isLargeText }) {
	const {
		menuData,
		selectedCombo,
		selectedEntrees,
		updateItemQuantity,
		handleAddComboToOrder,
		setCurrentStep,
	} = useContext(KioskContext);

	const maxEntrees = selectedCombo.number_of_entrees;
	const totalSelected = selectedEntrees.reduce(
		(sum, item) => sum + item.quantity,
		0
	);

	/**
	 * Constructs an image URL for a given entree name by converting it into a lowercase,
	 * underscore-separated format.
	 *
	 * @param {string} name - The entree name.
	 * @returns {string} The constructed image URL.
	 */
	const getImageUrl = (name) =>
		`/images/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

	/**
	 * Increases the quantity of a given entree by 1, if the maximum required entrees is not exceeded.
	 *
	 * @param {Object} entree - The entree object from menuData.
	 */
	const handleIncreaseEntreeQuantity = (entree) => {
		if (totalSelected < maxEntrees) {
			updateItemQuantity("entree", entree, 1);
		}
	};

	/**
	 * Decreases the quantity of a given entree by 1.
	 *
	 * @param {Object} entree - The entree object from menuData.
	 */
	const handleDecreaseEntreeQuantity = (entree) => {
		updateItemQuantity("entree", entree, -1);
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
						Select Entrees
					</Typography>
					<Typography sx={{ marginBottom: 2 }}>
						Please select {maxEntrees} entree{maxEntrees > 1 ? "s" : ""} (
						{totalSelected}/{maxEntrees})
					</Typography>
				</Grid>
				{menuData
					.filter((item) => item.type === "Entree")
					.map((entree) => {
						const selectedItem = selectedEntrees.find(
							(item) => item.entree.menu_id === entree.menu_id
						);
						const quantity = selectedItem ? selectedItem.quantity : 0;
						return (
							<Grid item xs={12} sm={4} key={entree.menu_id}>
								<Card sx={{ cursor: "pointer" }}>
									<CardMedia
										component="img"
										image={getImageUrl(entree.name)}
										alt={entree.name}
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
											{entree.name}
										</Typography>
										{entree.extra_cost && entree.extra_cost !== "0" && (
											<Typography
												sx={{
													fontSize: isLargeText ? "1.25rem" : "0.875rem",
													fontWeight: "normal",
												}}
											>
												Extra Cost: ${entree.extra_cost}
											</Typography>
										)}
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												marginTop: 1,
											}}
										>
											<IconButton
												onClick={() => handleDecreaseEntreeQuantity(entree)}
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
												onClick={() => handleIncreaseEntreeQuantity(entree)}
												disabled={totalSelected >= maxEntrees}
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
					onClick={() => setCurrentStep("sideSelection")}
					variant="outlined"
				>
					Back
				</Button>
				{totalSelected === maxEntrees && (
					<Button variant="contained" onClick={handleAddComboToOrder}>
						Add to Cart
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default EntreeSelection;
