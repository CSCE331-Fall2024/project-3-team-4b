// EntreeSelection.js
import React, { useContext, useEffect, useState } from "react";
import { KioskContext } from "./KioskContext";
import {
	Box,
	Grid,
	Typography,
	Card,
	CardMedia,
	CardContent,
	Checkbox,
	Button,
} from "@mui/material";

function EntreeSelection({ isLargeText }) {
	const {
		setCurrentStep,
		comboType,
		menuData,
		handleAddItemsToOrder,
		setSelectedEntrees,
		showSnackbar,
	} = useContext(KioskContext);

	// Local state for selected entrees
	const [selectedEntrees, setSelectedEntreesLocal] = useState([]);

	// Set currentStep to 'entreeSelection' when component mounts
	useEffect(() => {
		setCurrentStep("entreeSelection");
	}, [setCurrentStep]);

	const entreeLimit = comboType === "Bowl" ? 1 : comboType === "Plate" ? 2 : 3;

	const getImageUrl = (name) =>
		`/images/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

	const handleEntreeSelect = (entree) => {
		setSelectedEntreesLocal((prev) => {
			if (prev.includes(entree)) {
				return prev.filter((e) => e !== entree);
			} else {
				if (prev.length < entreeLimit) {
					return [...prev, entree];
				} else {
					showSnackbar(
						`You can select up to ${entreeLimit} entrees for a ${comboType}.`,
						"warning"
					);
					return prev;
				}
			}
		});
	};

	const handleAddComboToOrder = () => {
		if (selectedEntrees.length !== entreeLimit) {
			showSnackbar(
				`Please select ${entreeLimit} entree(s) to proceed.`,
				"warning"
			);
			return;
		}

		// Create the combo order
		const comboOrder = {
			type: "Combo",
			comboType,
			sides: [selectedEntrees],
			entrees: [...selectedEntrees],
			// Calculate subtotal as per your pricing logic
			subtotal: calculateComboPrice(comboType),
		};

		handleAddItemsToOrder([comboOrder]);
		setSelectedEntrees(selectedEntrees);
		setCurrentStep("categorySelection");
		showSnackbar("Combo added to cart.", "success");
	};

	const calculateComboPrice = (comboType) => {
		// Implement your pricing logic here
		// For example:
		if (comboType === "Bowl") return 7.5;
		if (comboType === "Plate") return 9.0;
		if (comboType === "Bigger Plate") return 10.5;
		return 0;
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
						Select {entreeLimit} Entree{entreeLimit > 1 ? "s" : ""}
					</Typography>
				</Grid>
				{menuData
					.filter((item) => item.type === "Entree")
					.map((entree) => (
						<Grid item xs={12} sm={4} key={entree.menu_id}>
							<Card
								sx={{ cursor: "pointer" }}
								onClick={() => handleEntreeSelect(entree)}
							>
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
									<Checkbox
										checked={selectedEntrees.includes(entree)}
										onChange={() => handleEntreeSelect(entree)}
										sx={{ float: "right" }}
									/>
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
				}}
			>
				<Button
					onClick={() => setCurrentStep("sideSelection")}
					variant="outlined"
				>
					Back
				</Button>
				<Button variant="contained" onClick={handleAddComboToOrder}>
					Add to Cart
				</Button>
			</Box>
		</Box>
	);
}

export default EntreeSelection;
