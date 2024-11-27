import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Snackbar, Alert, CssBaseline } from "@mui/material";
import SelectionSteps from "./SelectionSteps";
import OrderSummary from "./OrderSummary";

/**
 * Main Kiosk component that manages state and renders selection steps and order summary.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isLargeText - Flag to determine if large text is enabled.
 * @returns {JSX.Element} Kiosk component.
 */
function Kiosk({ isLargeText }) {
	// State variables
	const [menuData, setMenuData] = useState([]);
	const [appetizerPrice, setAppetizerPrice] = useState(0);
	const [drinkPrice, setDrinkPrice] = useState(0);
	const [containerData, setContainerData] = useState([]);

	// Store container IDs for Appetizer and Drink
	const [appetizerContainerId, setAppetizerContainerId] = useState(null);
	const [drinkContainerId, setDrinkContainerId] = useState(null);

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
	}, []);

	/**
	 * Fetches menu data from the API.
	 */
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

	/**
	 * Fetches container data from the API.
	 */
	const fetchContainerData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/containers"
			);
			const allContainers = response.data;
			const comboContainers = allContainers.filter((container) =>
				["Bowl", "Plate", "Bigger Plate"].includes(container.name)
			);
			setContainerData(comboContainers);

			// Get container IDs and prices for "Appetizer" and "Drink"
			const appetizerContainer = allContainers.find(
				(container) => container.name === "Appetizer"
			);
			const drinkContainer = allContainers.find(
				(container) => container.name === "Drink"
			);

			setAppetizerContainerId(appetizerContainer?.container_id || null);
			setDrinkContainerId(drinkContainer?.container_id || null);

			setAppetizerPrice(Number(appetizerContainer?.price) || 0);
			setDrinkPrice(Number(drinkContainer?.price) || 0);
		} catch (error) {
			console.error("Error fetching container data:", error);
			showSnackbar("Error fetching container data.", "error");
		}
	};

	/**
	 * Handles increasing the quantity of an entree.
	 *
	 * @param {Object} entree - The entree object.
	 */
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

	/**
	 * Handles decreasing the quantity of an entree.
	 *
	 * @param {Object} entree - The entree object.
	 */
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

	/**
	 * Handles increasing the quantity of an appetizer.
	 *
	 * @param {Object} item - The appetizer item.
	 */
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

	/**
	 * Handles decreasing the quantity of an appetizer.
	 *
	 * @param {Object} item - The appetizer item.
	 */
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

	/**
	 * Handles increasing the quantity of a drink.
	 *
	 * @param {Object} item - The drink item.
	 */
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

	/**
	 * Handles decreasing the quantity of a drink.
	 *
	 * @param {Object} item - The drink item.
	 */
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

	/**
	 * Handles adding a combo to the main order summary.
	 */
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

	/**
	 * Handles adding selected appetizers to the main order summary.
	 */
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

	/**
	 * Handles adding selected drinks to the main order summary.
	 */
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

	/**
	 * Handles removing an order item from the main order summary.
	 *
	 * @param {number} index - The index of the order item to remove.
	 */
	const handleRemoveOrder = (index) => {
		setOrderToRemoveIndex(index);
		setConfirmDialogOpen(true);
	};

	/**
	 * Confirms and removes the selected order item.
	 */
	const confirmRemoveOrder = () => {
		setMainOrderSummary((prev) =>
			prev.filter((_, idx) => idx !== orderToRemoveIndex)
		);
		setConfirmDialogOpen(false);
		setOrderToRemoveIndex(null);
		showSnackbar("Item removed from order.", "success");
	};

	/**
	 * Handles editing an existing combo order.
	 *
	 * @param {number} index - The index of the order item to edit.
	 */
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

	/**
	 * Handles placing the order and sending it to the backend.
	 */
	const handlePlaceOrder = async () => {
		if (mainOrderSummary.length === 0) {
			showSnackbar("No items in the order to place.", "warning");
			return;
		}

		// Format the date correctly
		const time = new Date().toISOString().slice(0, 19).replace("T", " ");

		const orderPayload = {
			time,
			total: mainOrderSummary.reduce(
				(total, order) => total + order.subtotal,
				0
			), // Grand total
			employee_id: 1, // Ensure this employee_id exists in your database
		};

		console.log("Order Payload:", orderPayload);

		try {
			const orderResponse = await axios.post(
				"https://project-3-team-4b-server.vercel.app/api/orders",
				orderPayload
			);
			const orderId = orderResponse.data.order_id;

			console.log("Order ID received:", orderId);

			// Process each item in the order
			for (const order of mainOrderSummary) {
				if (order.type === "Combo") {
					// Insert into order_items with container_id and order_id
					const orderItemPayload = {
						order_id: orderId,
						quantity: 1,
						container_id: order.combo.container_id,
					};

					const orderItemResponse = await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/order-items",
						orderItemPayload
					);
					const orderItemId = orderItemResponse.data.order_item_id;

					// Insert side into menu_items
					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.side.menu_id,
						}
					);

					// Insert entrees into menu_items
					for (const { entree, quantity } of order.entrees) {
						for (let i = 0; i < quantity; i++) {
							await axios.post(
								"https://project-3-team-4b-server.vercel.app/api/menu-items",
								{
									order_item_id: orderItemId,
									menu_id: entree.menu_id,
								}
							);
						}
					}
				} else if (order.type === "Appetizer") {
					if (appetizerContainerId === null) {
						showSnackbar("Appetizer container not found.", "error");
						return;
					}

					// Insert into order_items
					const orderItemPayload = {
						order_id: orderId,
						quantity: order.quantity,
						container_id: appetizerContainerId,
					};
					const orderItemResponse = await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/order-items",
						orderItemPayload
					);
					const orderItemId = orderItemResponse.data.order_item_id;

					// Insert into menu_items
					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.item.menu_id,
						}
					);
				} else if (order.type === "Drink") {
					if (drinkContainerId === null) {
						showSnackbar("Drink container not found.", "error");
						return;
					}

					// Insert into order_items
					const orderItemPayload = {
						order_id: orderId,
						quantity: order.quantity,
						container_id: drinkContainerId,
					};
					const orderItemResponse = await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/order-items",
						orderItemPayload
					);
					const orderItemId = orderItemResponse.data.order_item_id;

					// Insert into menu_items
					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.item.menu_id,
						}
					);
				}
			}

			showSnackbar(`Order placed successfully: Order ID ${orderId}`, "success");
			setMainOrderSummary([]);
		} catch (error) {
			console.error("Error placing order:", error);
			if (error.response) {
				console.error("Server responded with:", error.response.data);
				showSnackbar(
					`Failed to place order: ${error.response.data.error}`,
					"error"
				);
			} else {
				showSnackbar("Failed to place order. Please try again.", "error");
			}
		}
	};

	/**
	 * Calculates the subtotal for a combo.
	 *
	 * @param {Object} combo - The combo container.
	 * @param {Object} side - The selected side.
	 * @param {Array} entrees - Array of selected entrees with quantities.
	 * @returns {number} The subtotal amount.
	 */
	const calculateComboSubtotal = (combo, side, entrees) => {
		let subtotal = Number(combo.price) || 0;
		subtotal += Number(side.extra_cost || 0);
		entrees.forEach(({ entree, quantity }) => {
			subtotal += Number(entree.extra_cost || 0) * quantity;
		});
		return subtotal;
	};

	/**
	 * Displays a snackbar notification.
	 *
	 * @param {string} message - The message to display.
	 * @param {string} [severity="success"] - The severity level ("success", "error", "warning", "info").
	 */
	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	/**
	 * Closes the snackbar notification.
	 */
	const handleSnackbarClose = () => {
		setSnackbar({ open: false, message: "", severity: "success" });
	};

	/**
	 * Returns the image URL based on the item name.
	 *
	 * @param {string} name - The name of the item.
	 * @returns {string} The image URL.
	 */
	const getImageUrl = (name) => {
		const formattedName = name.toLowerCase().replace(/\s+/g, "_");
		return `/images/${formattedName}.png`;
	};

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

			{/* Left Section - Selection Steps */}
			<Box sx={{ flex: 2, padding: 2, height: "100%", overflowY: "auto" }}>
				<SelectionSteps
					currentStep={currentStep}
					setCurrentStep={setCurrentStep}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					selectedCombo={selectedCombo}
					setSelectedCombo={setSelectedCombo}
					selectedSide={selectedSide}
					setSelectedSide={setSelectedSide}
					selectedEntrees={selectedEntrees}
					setSelectedEntrees={setSelectedEntrees}
					selectedAppetizers={selectedAppetizers}
					setSelectedAppetizers={setSelectedAppetizers}
					selectedDrinks={selectedDrinks}
					setSelectedDrinks={setSelectedDrinks}
					menuData={menuData}
					containerData={containerData}
					appetizerPrice={appetizerPrice}
					drinkPrice={drinkPrice}
					handleAddComboToOrder={handleAddComboToOrder}
					handleAddAppetizersToOrder={handleAddAppetizersToOrder}
					handleAddDrinksToOrder={handleAddDrinksToOrder}
					handleIncreaseEntreeQuantity={handleIncreaseEntreeQuantity}
					handleDecreaseEntreeQuantity={handleDecreaseEntreeQuantity}
					handleIncreaseAppetizerQuantity={handleIncreaseAppetizerQuantity}
					handleDecreaseAppetizerQuantity={handleDecreaseAppetizerQuantity}
					handleIncreaseDrinkQuantity={handleIncreaseDrinkQuantity}
					handleDecreaseDrinkQuantity={handleDecreaseDrinkQuantity}
					getImageUrl={getImageUrl}
					isLargeText={isLargeText}
				/>
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
				<OrderSummary
					mainOrderSummary={mainOrderSummary}
					handleEditOrder={handleEditOrder}
					handleRemoveOrder={handleRemoveOrder}
					handlePlaceOrder={handlePlaceOrder}
					isLargeText={isLargeText}
				/>
			</Box>
		</Box>
	);
}

export default Kiosk;
