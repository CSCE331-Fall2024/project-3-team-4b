import React from "react";
import {
	Box,
	Button,
	Typography,
	Grid,
	Card,
	CardMedia,
	CardContent,
	IconButton,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

/**
 * Component to render the different selection steps in the ordering process.
 *
 * @param {Object} props - Component props containing state and handlers.
 * @returns {JSX.Element} SelectionSteps component.
 */
function SelectionSteps(props) {
	const { currentStep, isLargeText, ...rest } = props;

	// Destructure necessary props for readability
	const {
		setCurrentStep,
		selectedCategory,
		setSelectedCategory,
		selectedCombo,
		setSelectedCombo,
		selectedSide,
		setSelectedSide,
		selectedEntrees,
		setSelectedEntrees,
		selectedAppetizers,
		setSelectedAppetizers,
		selectedDrinks,
		setSelectedDrinks,
		menuData,
		containerData,
		appetizerPrice,
		drinkPrice,
		handleAddComboToOrder,
		handleAddAppetizersToOrder,
		handleAddDrinksToOrder,
		handleIncreaseEntreeQuantity,
		handleDecreaseEntreeQuantity,
		handleIncreaseAppetizerQuantity,
		handleDecreaseAppetizerQuantity,
		handleIncreaseDrinkQuantity,
		handleDecreaseDrinkQuantity,
		getImageUrl,
	} = rest;

	/**
	 * Renders the category selection step.
	 *
	 * @returns {JSX.Element} Category selection UI.
	 */
	const renderCategorySelection = () => (
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
				<Grid item xs={12} sm={4}>
					<Card
						onClick={() => {
							setSelectedCategory("Combos");
							setCurrentStep("comboSelection");
						}}
						sx={{ cursor: "pointer", padding: 2, textAlign: "center" }}
					>
						<Typography
							variant="h5"
							sx={{
								fontSize: isLargeText ? "1.75rem" : "1.25rem",
								fontWeight: "bold",
							}}
						>
							Combos
						</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Card
						onClick={() => {
							setSelectedCategory("Appetizers");
							setCurrentStep("appetizerSelection");
						}}
						sx={{ cursor: "pointer", padding: 2, textAlign: "center" }}
					>
						<Typography
							variant="h5"
							sx={{
								fontSize: isLargeText ? "1.75rem" : "1.25rem",
								fontWeight: "bold",
							}}
						>
							Appetizers
						</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Card
						onClick={() => {
							setSelectedCategory("Drinks");
							setCurrentStep("drinkSelection");
						}}
						sx={{ cursor: "pointer", padding: 2, textAlign: "center" }}
					>
						<Typography
							variant="h5"
							sx={{
								fontSize: isLargeText ? "1.75rem" : "1.25rem",
								fontWeight: "bold",
							}}
						>
							Drinks
						</Typography>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);

	/**
	 * Renders the combo selection step.
	 *
	 * @returns {JSX.Element} Combo selection UI.
	 */
	const renderComboSelection = () => (
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
							onClick={() => {
								setSelectedCombo(combo);
								setCurrentStep("sideSelection");
							}}
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

			{/* Buttons */}
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
				{/* No Next button in this step */}
			</Box>
		</Box>
	);

	/**
	 * Renders the side selection step.
	 *
	 * @returns {JSX.Element} Side selection UI.
	 */
	const renderSideSelection = () => (
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
								onClick={() => {
									if (selectedSide?.menu_id === side.menu_id) {
										// Do nothing if the same side is clicked
									} else {
										setSelectedSide(side);
									}
								}}
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

			{/* Buttons */}
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

	/**
	 * Renders the entree selection step.
	 *
	 * @returns {JSX.Element} Entree selection UI.
	 */
	const renderEntreeSelection = () => {
		const maxEntrees = selectedCombo.number_of_entrees;
		const totalSelected = selectedEntrees.reduce(
			(sum, item) => sum + item.quantity,
			0
		);

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
											{/* Quantity Controls */}
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

				{/* Buttons */}
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
	};

	/**
	 * Renders the appetizer selection step.
	 *
	 * @returns {JSX.Element} Appetizer selection UI.
	 */
	const renderAppetizerSelection = () => (
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
										{/* Quantity Controls */}
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

			{/* Buttons */}
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

	/**
	 * Renders the drink selection step.
	 *
	 * @returns {JSX.Element} Drink selection UI.
	 */
	const renderDrinkSelection = () => (
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
						Select Drinks
					</Typography>
				</Grid>
				{menuData
					.filter((item) => item.type === "Drink")
					.map((drink) => {
						const selectedItem = selectedDrinks.find(
							(dr) => dr.item.menu_id === drink.menu_id
						);
						const quantity = selectedItem ? selectedItem.quantity : 0;
						return (
							<Grid item xs={12} sm={4} key={drink.menu_id}>
								<Card sx={{ cursor: "pointer" }}>
									<CardMedia
										component="img"
										image={getImageUrl(drink.name)}
										alt={drink.name}
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
											{drink.name}
										</Typography>
										<Typography
											sx={{
												fontSize: isLargeText ? "1.25rem" : "0.875rem",
												fontWeight: "normal",
											}}
										>
											Price: ${drinkPrice.toFixed(2)}
										</Typography>
										{/* Quantity Controls */}
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												marginTop: 1,
											}}
										>
											<IconButton
												onClick={() => handleDecreaseDrinkQuantity(drink)}
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
												onClick={() => handleIncreaseDrinkQuantity(drink)}
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

			{/* Buttons */}
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
				{selectedDrinks.length > 0 && (
					<Button variant="contained" onClick={handleAddDrinksToOrder}>
						Add to Cart
					</Button>
				)}
			</Box>
		</Box>
	);

	/**
	 * Renders the appropriate selection step based on currentStep.
	 *
	 * @returns {JSX.Element|null} The UI for the current selection step.
	 */
	switch (currentStep) {
		case "categorySelection":
			return renderCategorySelection();
		case "comboSelection":
			return renderComboSelection();
		case "sideSelection":
			return renderSideSelection();
		case "entreeSelection":
			return renderEntreeSelection();
		case "appetizerSelection":
			return renderAppetizerSelection();
		case "drinkSelection":
			return renderDrinkSelection();
		default:
			return null;
	}
}

export default SelectionSteps;
