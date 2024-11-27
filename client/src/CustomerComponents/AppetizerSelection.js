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

function AppetizerSelection({ isLargeText }) {
	const {
		menuData,
		selectedAppetizers,
		appetizerPrice,
		updateItemQuantity,
		handleAddAppetizersToOrder,
		setCurrentStep,
	} = useContext(KioskContext);

	const getImageUrl = (name) =>
		`/images/${name.toLowerCase().replace(/\s+/g, "_")}.png`;

	const handleIncreaseAppetizerQuantity = (appetizer) => {
		updateItemQuantity("appetizer", appetizer, 1);
	};

	const handleDecreaseAppetizerQuantity = (appetizer) => {
		updateItemQuantity("appetizer", appetizer, -1);
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
							(app) => app.item.menu_id === appetizer.menu_id
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
											Price: ${appetizerPrice.toFixed(2)}
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
												onClick={() =>
													handleDecreaseAppetizerQuantity(appetizer)
												}
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
												onClick={() =>
													handleIncreaseAppetizerQuantity(appetizer)
												}
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
					<Button variant="contained" onClick={handleAddAppetizersToOrder}>
						Add to Cart
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default AppetizerSelection;
