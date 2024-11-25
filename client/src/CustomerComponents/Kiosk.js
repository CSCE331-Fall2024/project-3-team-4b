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
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function Kiosk() {
	const [menuData, setMenuData] = useState([]);
	const [appetizerPrice, setAppetizerPrice] = useState(0);
	const [drinkPrice, setDrinkPrice] = useState(0);
	const [containerData, setContainerData] = useState([]);
	const [isLargeText, setIsLargeText] = useState(false);

	const [mainOrderSummary, setMainOrderSummary] = useState([]); // Main order summary
	const [subOrderSummary, setSubOrderSummary] = useState({
		container: null,
		items: [],
		subtotal: 0,
	});
	const [selectedItems, setSelectedItems] = useState(new Set());
	const [selectedCounts, setSelectedCounts] = useState({
		entrees: 0,
		sides: 0,
		appetizers: 0,
		drinks: 0,
	});

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

	const toggleTextSize = () => {
		setIsLargeText((prev) => !prev);
	};

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

	const handleSelectContainer = (container) => {
		setSubOrderSummary({
			container,
			items: [],
			subtotal: Number(container.price) || 0, // Ensure it's a valid number
		});
		setSelectedCounts({
			entrees: 0,
			sides: 0,
			appetizers: 0,
			drinks: 0,
		});
		setSelectedItems(new Set());
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

	const handleAddItem = (item) => {
		const { container, items } = subOrderSummary;
		if (!container) {
			showSnackbar("Please select a container before adding items.", "warning");
			return;
		}

		const itemIsSelected = selectedItems.has(item.menu_id);
		const canSelect =
			(item.type === "Entree" &&
				selectedCounts.entrees < container.number_of_entrees) ||
			(item.type === "Side" &&
				selectedCounts.sides < container.number_of_sides) ||
			(item.type === "Appetizer" && selectedCounts.appetizers < 10) ||
			(item.type === "Drink" && selectedCounts.drinks < 10);

		if (!itemIsSelected && canSelect) {
			let price = 0;
			if (item.type === "Appetizer") price = Number(appetizerPrice);
			else if (item.type === "Drink") price = Number(drinkPrice);
			else price = Number(item.extra_cost || 0); // For entrees and sides

			setSubOrderSummary((prev) => ({
				...prev,
				items: [...prev.items, item],
				subtotal: prev.subtotal + price,
			}));
			setSelectedItems((prev) => new Set(prev).add(item.menu_id));
			setSelectedCounts((prevCounts) => ({
				...prevCounts,
				[item.type.toLowerCase() + "s"]:
					prevCounts[item.type.toLowerCase() + "s"] + 1,
			}));
		} else if (itemIsSelected) {
			handleRemoveItem(item);
		} else {
			showSnackbar(
				`Cannot add more ${item.type.toLowerCase()}s to this container.`,
				"warning"
			);
		}
	};

	const handleRemoveItem = (item) => {
		let price = 0;
		if (item.type === "Appetizer") price = Number(appetizerPrice);
		else if (item.type === "Drink") price = Number(drinkPrice);
		else price = Number(item.extra_cost || 0); // For entrees and sides

		setSubOrderSummary((prev) => ({
			...prev,
			items: prev.items.filter(
				(orderItem) => orderItem.menu_id !== item.menu_id
			),
			subtotal: prev.subtotal - price,
		}));

		setSelectedItems((prev) => {
			const newSelected = new Set(prev);
			newSelected.delete(item.menu_id);
		});

		setSelectedCounts((prevCounts) => ({
			...prevCounts,
			[item.type.toLowerCase() + "s"]:
				prevCounts[item.type.toLowerCase() + "s"] - 1,
		}));
	};

	const handleAddToOrder = () => {
		if (!subOrderSummary.container || subOrderSummary.items.length === 0) {
			showSnackbar(
				"Please select a container and items before adding to order.",
				"warning"
			);
			return;
		}

		// Add sub-order to the main order summary
		setMainOrderSummary((prev) => [
			...prev,
			{ ...subOrderSummary, items: [...subOrderSummary.items] }, // Make a copy of items to avoid mutation
		]);

		// Clear the sub-order summary
		setSubOrderSummary({
			container: null,
			items: [],
			subtotal: 0,
		});

		// Reset selections for the next order
		setSelectedCounts({
			entrees: 0,
			sides: 0,
			appetizers: 0,
			drinks: 0,
		});
		setSelectedItems(new Set());

		showSnackbar("Item added to order.", "success");
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

			const orderItemsPayload = mainOrderSummary.flatMap((selection) =>
				selection.items.map((item) => ({
					order_id: orderId,
					quantity: 1,
					container_id: selection.container.container_id,
				}))
			);

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

	const handleClearContainer = () => {
		setSubOrderSummary({
			container: null,
			items: [],
			subtotal: 0,
		});
		setSelectedItems(new Set());
		setSelectedCounts({
			entrees: 0,
			sides: 0,
			appetizers: 0,
			drinks: 0,
		});
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

	return (
		<Box sx={{ display: "flex" }}>
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

			{/* Left Section - Menu Selection */}
			<Button
				onClick={toggleTextSize}
				variant="contained"
				color="secondary"
				sx={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
			>
				{isLargeText ? "Normal Text" : "Large Text"}
			</Button>

			<Box sx={{ flex: 2, padding: 2 }}>
				{/* Select a Container */}
				<Typography
					variant="h4"
					sx={{
						fontSize: isLargeText ? "2rem" : "1.5rem",
						fontWeight: "bold",
						textTransform: "uppercase",
						marginBottom: 2,
					}}
				>
					Select a Container
				</Typography>
				<Grid container spacing={2} sx={{ marginBottom: 4 }}>
					{containerData.map((container) => (
						<Grid item xs={12} sm={6} md={4} key={container.container_id}>
							<Card
								onClick={() => handleSelectContainer(container)}
								sx={{
									cursor: "pointer",
									border:
										subOrderSummary.container?.container_id ===
										container.container_id
											? "2px solid #D1282E"
											: "1px solid #ccc",
									borderRadius: 2,
									position: "relative",
								}}
							>
								<CardMedia
									component="img"
									image={getImageUrl(container.name)}
									alt={container.name}
									sx={{ height: 140, objectFit: "cover" }}
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
										{container.name}
									</Typography>
									{container.price !== 0 && (
										<Typography
											sx={{
												fontSize: isLargeText ? "1.25rem" : "0.875rem",
												fontWeight: "normal",
											}}
										>
											Price: ${container.price}
										</Typography>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>

				{/* Menu Items */}
				{["Entree", "Side", "Appetizer", "Drink"].map((type) => (
					<Box key={type} sx={{ marginBottom: 4 }}>
						<Typography
							variant="h5"
							sx={{
								fontSize: isLargeText ? "1.75rem" : "1.25rem",
								fontWeight: "bold",
								marginBottom: 2,
							}}
						>
							{type}s
						</Typography>
						<Grid container spacing={2}>
							{menuData
								.filter((item) => item.type === type)
								.map((item) => (
									<Grid item xs={12} sm={6} md={4} key={item.menu_id}>
										<Card
											onClick={() => handleAddItem(item)}
											sx={{
												cursor: "pointer",
												border: selectedItems.has(item.menu_id)
													? "2px solid #D1282E"
													: "1px solid #ccc",
												borderRadius: 2,
											}}
										>
											<CardMedia
												component="img"
												image={getImageUrl(item.name)}
												alt={item.name}
												sx={{ height: 140, objectFit: "cover" }}
											/>
											<CardContent>
												<Typography
													variant="h6"
													sx={{
														fontSize: isLargeText ? "1.5rem" : "1rem",
														fontWeight: "bold",
													}}
												>
													{item.name}
												</Typography>
												<Typography
													sx={{
														fontSize: isLargeText ? "1.25rem" : "0.875rem",
														fontWeight: "normal",
													}}
												>
													{item.type === "Appetizer" &&
														`Price: $${appetizerPrice.toFixed(2)}`}
													{item.type === "Drink" &&
														`Price: $${drinkPrice.toFixed(2)}`}
													{["Entree", "Side"].includes(item.type) &&
														`Extra Cost: $${item.extra_cost}`}
												</Typography>
											</CardContent>
										</Card>
									</Grid>
								))}
						</Grid>
					</Box>
				))}
			</Box>

			{/* Right Section - Order Summary */}
			<Box sx={{ flex: 1, padding: 2, borderLeft: "1px solid #ccc" }}>
				{/* Sub-order summary */}
				<Typography
					variant="h5"
					sx={{
						fontSize: isLargeText ? "1.75rem" : "1.25rem",
						fontWeight: "bold",
						marginBottom: 2,
					}}
				>
					Current Selection
				</Typography>
				{subOrderSummary.container && (
					<Box sx={{ marginBottom: 2 }}>
						<Typography
							sx={{
								fontSize: isLargeText ? "1.5rem" : "1rem",
								fontWeight: "bold",
							}}
						>
							{subOrderSummary.container.name}
						</Typography>
						{subOrderSummary.container.price !== 0 && (
							<Typography
								sx={{
									fontSize: isLargeText ? "1.25rem" : "0.875rem",
									fontWeight: "normal",
								}}
							>
								Price: ${subOrderSummary.container.price}
							</Typography>
						)}
					</Box>
				)}

				{subOrderSummary.items.map((item) => (
					<Box
						key={item.menu_id}
						sx={{
							display: "flex",
							alignItems: "center",
							marginBottom: 1,
						}}
					>
						<Typography
							sx={{
								flexGrow: 1,
								fontSize: isLargeText ? "1.25rem" : "0.875rem",
								fontWeight: "normal",
							}}
						>
							{item.name}
						</Typography>
						<IconButton
							edge="end"
							color="error"
							onClick={() => handleRemoveItem(item)}
						>
							<RemoveCircleOutlineIcon />
						</IconButton>
					</Box>
				))}

				<Typography
					variant="h6"
					sx={{
						fontSize: isLargeText ? "1.5rem" : "1rem",
						fontWeight: "bold",
						marginTop: 2,
					}}
				>
					Subtotal: ${subOrderSummary.subtotal.toFixed(2)}
				</Typography>

				<Button
					onClick={handleAddToOrder}
					variant="contained"
					color="primary"
					fullWidth
					disabled={
						!subOrderSummary.container || subOrderSummary.items.length === 0
					}
					sx={{
						marginTop: 2,
						fontSize: isLargeText ? "1.25rem" : "1rem",
						padding: isLargeText ? "12px" : "8px",
					}}
				>
					Add to Order
				</Button>

				<Button
					onClick={handleClearContainer}
					variant="outlined"
					color="secondary"
					fullWidth
					sx={{
						marginTop: 1,
						fontSize: isLargeText ? "1.25rem" : "1rem",
						padding: isLargeText ? "12px" : "8px",
					}}
				>
					Clear Selection
				</Button>

				{/* Main Order Summary */}
				<Box sx={{ marginTop: 4 }}>
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
						mainOrderSummary.map((order, index) => (
							<Box key={index} sx={{ marginBottom: 2 }}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										marginBottom: 1,
									}}
								>
									<Typography
										variant="h6"
										sx={{
											flexGrow: 1,
											fontSize: isLargeText ? "1.5rem" : "1rem",
											fontWeight: "bold",
										}}
									>
										{order.container.name}
									</Typography>
									<IconButton
										edge="end"
										color="error"
										onClick={() => handleRemoveOrder(index)}
									>
										<RemoveCircleOutlineIcon />
									</IconButton>
								</Box>
								{order.items.map((item) => (
									<Typography
										key={item.menu_id}
										sx={{
											fontSize: isLargeText ? "1.25rem" : "0.875rem",
											fontWeight: "normal",
											marginLeft: 2,
										}}
									>
										- {item.name}
									</Typography>
								))}
								<Typography
									sx={{
										fontSize: isLargeText ? "1.25rem" : "0.875rem",
										fontWeight: "normal",
									}}
								>
									Subtotal: ${order.subtotal.toFixed(2)}
								</Typography>
							</Box>
						))
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
		</Box>
	);
}

export default Kiosk;
