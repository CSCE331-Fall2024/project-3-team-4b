import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Button,
	Typography,
	Grid,
	Card,
	CardMedia,
	CardContent,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Snackbar,
	Alert,
	CssBaseline,
	Divider,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

function Kiosk({ isLargeText }) {
	const [menuData, setMenuData] = useState([]);
	const [appetizerPrice, setAppetizerPrice] = useState(0);
	const [drinkPrice, setDrinkPrice] = useState(0);
	const [containerData, setContainerData] = useState([]);

	const [currentStep, setCurrentStep] = useState("categorySelection");
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedCombo, setSelectedCombo] = useState(null);
	const [selectedSide, setSelectedSide] = useState(null);
	const [selectedEntrees, setSelectedEntrees] = useState([]); // Array of { entree, quantity }
	const [selectedAppetizers, setSelectedAppetizers] = useState([]); // Array of { item, quantity }
	const [selectedDrinks, setSelectedDrinks] = useState([]); // Array of { item, quantity }
	const [mainOrderSummary, setMainOrderSummary] = useState([]);
	const [editOrderIndex, setEditOrderIndex] = useState(null);

	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [orderToRemoveIndex, setOrderToRemoveIndex] = useState(null);

	useEffect(() => {
		fetchMenuData();
		fetchContainerData();
		fetchPrices();
	}, []);

	const fetchMenuData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/menu"
			);
			setMenuData(response.data);
		} catch (error) {
			console.error("Error fetching menu data:", error);
			showSnackbar("Error fetching menu data.", "error");
		}
	};

	const fetchContainerData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/containers"
			);
			const filteredContainers = response.data.filter((container) =>
				["Bowl", "Plate", "Bigger Plate"].includes(container.name)
			);
			setContainerData(filteredContainers);
		} catch (error) {
			console.error("Error fetching container data:", error);
			showSnackbar("Error fetching container data.", "error");
		}
	};

	const fetchPrices = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/containers"
			);
			const appetizerContainer = response.data.find(
				(container) => container.name === "Appetizers"
			);
			const drinkContainer = response.data.find(
				(container) => container.name === "Drinks"
			);

			setAppetizerPrice(Number(appetizerContainer?.price) || 0);
			setDrinkPrice(Number(drinkContainer?.price) || 0);
		} catch (error) {
			console.error("Error fetching appetizer and drink prices:", error);
			showSnackbar("Error fetching appetizer and drink prices.", "error");
		}
	};

	// Entree Quantity Handlers
	const handleIncreaseEntreeQuantity = (entree) => {
		const maxEntrees = selectedCombo.number_of_entrees;
		const totalSelected = selectedEntrees.reduce(
			(sum, item) => sum + item.quantity,
			0
		);

		if (totalSelected < maxEntrees) {
			setSelectedEntrees((prev) => {
				const index = prev.findIndex(
					(item) => item.entree.menu_id === entree.menu_id
				);
				if (index >= 0) {
					const updated = [...prev];
					updated[index].quantity += 1;
					return updated;
				} else {
					return [...prev, { entree, quantity: 1 }];
				}
			});
		} else {
			showSnackbar(
				`You can only select ${maxEntrees} entree${maxEntrees > 1 ? "s" : ""}.`,
				"warning"
			);
		}
	};

	const handleDecreaseEntreeQuantity = (entree) => {
		setSelectedEntrees((prev) => {
			const index = prev.findIndex(
				(item) => item.entree.menu_id === entree.menu_id
			);
			if (index >= 0) {
				const updated = [...prev];
				if (updated[index].quantity > 1) {
					updated[index].quantity -= 1;
				} else {
					updated.splice(index, 1);
				}
				return updated;
			}
			return prev;
		});
	};

	// Appetizer Quantity Handlers
	const handleIncreaseAppetizerQuantity = (item) => {
		setSelectedAppetizers((prev) => {
			const index = prev.findIndex((app) => app.item.menu_id === item.menu_id);
			if (index >= 0) {
				const updated = [...prev];
				updated[index].quantity += 1;
				return updated;
			} else {
				return [...prev, { item, quantity: 1 }];
			}
		});
	};

	const handleDecreaseAppetizerQuantity = (item) => {
		setSelectedAppetizers((prev) => {
			const index = prev.findIndex((app) => app.item.menu_id === item.menu_id);
			if (index >= 0) {
				const updated = [...prev];
				if (updated[index].quantity > 1) {
					updated[index].quantity -= 1;
				} else {
					updated.splice(index, 1);
				}
				return updated;
			}
			return prev;
		});
	};

	// Drink Quantity Handlers
	const handleIncreaseDrinkQuantity = (item) => {
		setSelectedDrinks((prev) => {
			const index = prev.findIndex(
				(drink) => drink.item.menu_id === item.menu_id
			);
			if (index >= 0) {
				const updated = [...prev];
				updated[index].quantity += 1;
				return updated;
			} else {
				return [...prev, { item, quantity: 1 }];
			}
		});
	};

	const handleDecreaseDrinkQuantity = (item) => {
		setSelectedDrinks((prev) => {
			const index = prev.findIndex(
				(drink) => drink.item.menu_id === item.menu_id
			);
			if (index >= 0) {
				const updated = [...prev];
				if (updated[index].quantity > 1) {
					updated[index].quantity -= 1;
				} else {
					updated.splice(index, 1);
				}
				return updated;
			}
			return prev;
		});
	};

	const handleAddComboToOrder = () => {
		const subtotal = calculateComboSubtotal(
			selectedCombo,
			selectedSide,
			selectedEntrees
		);
		const comboOrder = {
			type: "Combo",
			combo: selectedCombo,
			side: selectedSide,
			entrees: selectedEntrees,
			subtotal,
		};

		if (editOrderIndex !== null) {
			// Edit existing combo
			const updatedOrders = [...mainOrderSummary];
			updatedOrders[editOrderIndex] = comboOrder;
			setMainOrderSummary(updatedOrders);
			setEditOrderIndex(null);
		} else {
			// Add new combo
			setMainOrderSummary([...mainOrderSummary, comboOrder]);
		}

		// Reset selections
		setSelectedCombo(null);
		setSelectedSide(null);
		setSelectedEntrees([]);
		setCurrentStep("categorySelection");
		showSnackbar("Combo added to cart.", "success");
	};

	const handleAddAppetizersToOrder = () => {
		const appetizersOrder = selectedAppetizers.map((app) => ({
			type: "Appetizer",
			item: app.item,
			quantity: app.quantity,
			subtotal: appetizerPrice * app.quantity,
		}));
		setMainOrderSummary([...mainOrderSummary, ...appetizersOrder]);
		setSelectedAppetizers([]);
		setCurrentStep("categorySelection");
		showSnackbar("Appetizers added to cart.", "success");
	};

	const handleAddDrinksToOrder = () => {
		const drinksOrder = selectedDrinks.map((drink) => ({
			type: "Drink",
			item: drink.item,
			quantity: drink.quantity,
			subtotal: drinkPrice * drink.quantity,
		}));
		setMainOrderSummary([...mainOrderSummary, ...drinksOrder]);
		setSelectedDrinks([]);
		setCurrentStep("categorySelection");
		showSnackbar("Drinks added to cart.", "success");
	};

	const handleRemoveOrder = (index) => {
		setOrderToRemoveIndex(index);
		setConfirmDialogOpen(true);
	};

	const confirmRemoveOrder = () => {
		setMainOrderSummary((prev) =>
			prev.filter((_, idx) => idx !== orderToRemoveIndex)
		);
		setConfirmDialogOpen(false);
		setOrderToRemoveIndex(null);
		showSnackbar("Item removed from order.", "success");
	};

	const handleEditOrder = (index) => {
		const order = mainOrderSummary[index];
		if (order.type === "Combo") {
			setSelectedCombo(order.combo);
			setSelectedSide(order.side);
			setSelectedEntrees(order.entrees);
			setEditOrderIndex(index);
			setCurrentStep("entreeSelection");
		} else {
			showSnackbar("Only combos can be edited.", "warning");
		}
	};

	const handlePlaceOrder = async () => {
		if (mainOrderSummary.length === 0) {
			showSnackbar("No items in the order to place.", "warning");
			return;
		}

		const orderPayload = {
			time: new Date().toISOString(),
			total: mainOrderSummary.reduce(
				(total, order) => total + order.subtotal,
				0
			), // Grand total
			employee_id: 99,
		};

		try {
			const orderResponse = await axios.post(
				"https://project-3-team-4b-server.vercel.app/api/orders",
				orderPayload
			);
			const orderId = orderResponse.data.order_id;

			const orderItemsPayload = mainOrderSummary.flatMap((order) => {
				if (order.type === "Combo") {
					const payload = [
						{
							order_id: orderId,
							quantity: 1,
							container_id: order.combo.container_id,
						},
						{
							order_id: orderId,
							quantity: 1,
							menu_id: order.side.menu_id,
						},
					];
					order.entrees.forEach(({ entree, quantity }) => {
						payload.push({
							order_id: orderId,
							quantity,
							menu_id: entree.menu_id,
						});
					});
					return payload;
				} else {
					return [
						{
							order_id: orderId,
							quantity: order.quantity,
							menu_id: order.item.menu_id,
						},
					];
				}
			});

			await Promise.all(
				orderItemsPayload.map((orderItem) =>
					axios.post(
						"https://project-3-team-4b-server.vercel.app/api/order-items",
						orderItem
					)
				)
			);

			showSnackbar(`Order placed successfully: Order ID ${orderId}`, "success");
			setMainOrderSummary([]);
		} catch (error) {
			console.error("Error placing order:", error);
			showSnackbar("Failed to place order. Please try again.", "error");
		}
	};

	const calculateComboSubtotal = (combo, side, entrees) => {
		let subtotal = Number(combo.price) || 0;
		subtotal += Number(side.extra_cost || 0);
		entrees.forEach(({ entree, quantity }) => {
			subtotal += Number(entree.extra_cost || 0) * quantity;
		});
		return subtotal;
	};

	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	const handleSnackbarClose = () => {
		setSnackbar({ open: false, message: "", severity: "success" });
	};

	const getImageUrl = (name) => {
		const formattedName = name.toLowerCase().replace(/\s+/g, "_");
		return `/images/${formattedName}.png`;
	};

	// Render methods for each step

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
							{editOrderIndex !== null ? "Update Cart" : "Add to Cart"}
						</Button>
					)}
				</Box>
			</Box>
		);
	};

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

	return (
		<Box
			sx={{
				display: "flex",
				height: "100%",
				width: "100%",
			}}
		>
			<CssBaseline />
			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>

			{/* Confirm Remove Order Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
			>
				<DialogTitle>Remove Item</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to remove this item from your order?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={confirmRemoveOrder}
						color="error"
						variant="contained"
					>
						Remove
					</Button>
				</DialogActions>
			</Dialog>

			<Box sx={{ flex: 2, padding: 2, height: "100%", overflowY: "auto" }}>
				{currentStep === "categorySelection" && renderCategorySelection()}
				{currentStep === "comboSelection" && renderComboSelection()}
				{currentStep === "sideSelection" && renderSideSelection()}
				{currentStep === "entreeSelection" && renderEntreeSelection()}
				{currentStep === "appetizerSelection" && renderAppetizerSelection()}
				{currentStep === "drinkSelection" && renderDrinkSelection()}
			</Box>

			{/* Right Section - Order Summary */}
			<Box
				sx={{
					flex: 1,
					padding: 2,
					borderLeft: "1px solid #ccc",
					height: "100%",
					overflowY: "auto",
				}}
			>
				{/* Main Order Summary */}
				<Typography
					variant="h5"
					sx={{
						fontSize: isLargeText ? "1.75rem" : "1.25rem",
						fontWeight: "bold",
						marginBottom: 2,
					}}
				>
					Your Order
				</Typography>
				{mainOrderSummary.length === 0 ? (
					<Typography
						sx={{
							fontSize: isLargeText ? "1.25rem" : "0.875rem",
							fontWeight: "normal",
						}}
					>
						No items added.
					</Typography>
				) : (
					<Box sx={{ maxWidth: "100%" }}>
						{mainOrderSummary.map((order, index) => (
							<Box key={index} sx={{ marginBottom: 2 }}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Typography
										variant="h6"
										sx={{
											fontSize: isLargeText ? "1.5rem" : "1rem",
											fontWeight: "bold",
										}}
									>
										{order.type === "Combo"
											? order.combo.name
											: order.item.name}
									</Typography>
									<Box>
										{order.type === "Combo" && (
											<IconButton
												edge="end"
												color="primary"
												onClick={() => handleEditOrder(index)}
											>
												<EditIcon />
											</IconButton>
										)}
										<IconButton
											edge="end"
											color="error"
											onClick={() => handleRemoveOrder(index)}
										>
											<RemoveCircleOutlineIcon />
										</IconButton>
									</Box>
								</Box>
								{order.type === "Combo" && (
									<Box sx={{ marginLeft: 2 }}>
										<Typography
											sx={{
												fontSize: isLargeText ? "1.25rem" : "0.875rem",
												fontWeight: "normal",
											}}
										>
											Side: {order.side.name}
										</Typography>
										{order.entrees.map(({ entree, quantity }, idx) => (
											<Typography
												key={idx}
												sx={{
													fontSize: isLargeText ? "1.25rem" : "0.875rem",
													fontWeight: "normal",
												}}
											>
												Entree: {entree.name} x {quantity}
											</Typography>
										))}
									</Box>
								)}
								{order.type === "Appetizer" && (
									<Typography
										sx={{
											fontSize: isLargeText ? "1.25rem" : "0.875rem",
											fontWeight: "normal",
											marginLeft: 2,
										}}
									>
										Quantity: {order.quantity}
									</Typography>
								)}
								{order.type === "Drink" && (
									<Typography
										sx={{
											fontSize: isLargeText ? "1.25rem" : "0.875rem",
											fontWeight: "normal",
											marginLeft: 2,
										}}
									>
										Quantity: {order.quantity}
									</Typography>
								)}
								<Typography
									sx={{
										fontSize: isLargeText ? "1.25rem" : "0.875rem",
										fontWeight: "normal",
									}}
								>
									Subtotal: ${order.subtotal.toFixed(2)}
								</Typography>
								<Divider sx={{ marginTop: 1, marginBottom: 1 }} />
							</Box>
						))}
						{/* Total */}
						<Typography
							variant="h6"
							sx={{
								fontSize: isLargeText ? "1.5rem" : "1rem",
								fontWeight: "bold",
								marginTop: 2,
							}}
						>
							Total: $
							{mainOrderSummary
								.reduce((total, order) => total + order.subtotal, 0)
								.toFixed(2)}
						</Typography>
					</Box>
				)}
				{mainOrderSummary.length > 0 && (
					<Button
						onClick={handlePlaceOrder}
						variant="contained"
						color="secondary"
						fullWidth
						sx={{
							marginTop: 2,
							fontSize: isLargeText ? "1.25rem" : "1rem",
							padding: isLargeText ? "12px" : "8px",
						}}
					>
						Place Order
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default Kiosk;
