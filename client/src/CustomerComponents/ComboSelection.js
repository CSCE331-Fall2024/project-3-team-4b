import React, { useContext } from "react";
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

function ComboSelection({ isLargeText }) {
	const { setCurrentStep, setSelectedCombo, containerData } =
		useContext(KioskContext);

	const handleComboClick = (combo) => {
		setSelectedCombo(combo);
		setCurrentStep("sideSelection");
	};

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
						Select a Combo
					</Typography>
				</Grid>
				{containerData.map((combo) => (
					<Grid item xs={12} sm={4} key={combo.container_id}>
						<Card
							onClick={() => handleComboClick(combo)}
							sx={{ cursor: "pointer" }}
						>
							<CardMedia
								component="img"
								image={getImageUrl(combo.name)}
								alt={combo.name}
								sx={{ height: 140, objectFit: "contain" }}
							/>
							<CardContent>
								<Typography
									variant="h6"
									sx={{
										fontSize: isLargeText ? "1.5rem" : "1rem",
										fontWeight: "bold",
										textTransform: "capitalize",
									}}
								>
									{combo.name}
								</Typography>
								{combo.price !== 0 && (
									<Typography
										sx={{
											fontSize: isLargeText ? "1.25rem" : "0.875rem",
											fontWeight: "normal",
										}}
									>
										Price: ${combo.price}
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
					onClick={() => setCurrentStep("categorySelection")}
					variant="outlined"
				>
					Back
				</Button>
			</Box>
		</Box>
	);
}

export default ComboSelection;
