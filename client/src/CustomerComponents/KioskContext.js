// KioskContext.js
import React, { createContext, useState } from "react";
import axios from "axios";

export const KioskContext = createContext();

export const KioskProvider = ({ children }) => {
	const [menuData, setMenuData] = useState([]);
	const [containerData, setContainerData] = useState([]);
	const [appetizerPrice, setAppetizerPrice] = useState(0);
	const [drinkPrice, setDrinkPrice] = useState(0);
	const [appetizerContainerId, setAppetizerContainerId] = useState(null);
	const [drinkContainerId, setDrinkContainerId] = useState(null);
	const [currentStep, setCurrentStep] = useState("categorySelection");

	// State variables for combo ordering
	const [comboType, setComboType] = useState(null); // Selected combo object
	const [selectedSide, setSelectedSide] = useState(null);
	const [selectedEntrees, setSelectedEntrees] = useState([]);

	const [mainOrderSummary, setMainOrderSummary] = useState([]);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [orderToRemoveIndex, setOrderToRemoveIndex] = useState(null);

	// Function to show snackbar messages
	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	// Function to add items to the main order summary
	const handleAddItemsToOrder = (items) => {
		setMainOrderSummary((prev) => [...prev, ...items]);
	};

	// Function to remove an item from the order
	const handleRemoveOrder = (index) => {
		setOrderToRemoveIndex(index);
		setConfirmDialogOpen(true);
	};

	// Function to confirm removal of an item
	const confirmRemoveOrder = () => {
		setMainOrderSummary((prev) =>
			prev.filter((_, idx) => idx !== orderToRemoveIndex)
		);
		setConfirmDialogOpen(false);
		setOrderToRemoveIndex(null);
		showSnackbar("Item removed from order.", "success");
	};

	// Function to place the order
	const handlePlaceOrder = async () => {
		if (mainOrderSummary.length === 0) {
			showSnackbar("No items in the order to place.", "warning");
			return;
		}

		const time = new Date().toISOString().slice(0, 16);

		try {
			const orderResponse = await axios.post(
				"https://project-3-team-4b-server.vercel.app/api/orders",
				{
					time,
					total: mainOrderSummary.reduce(
						(total, order) => total + order.subtotal,
						0
					),
					employee_id: 1,
				}
			);
			const orderId = orderResponse.data.order_id;

			for (const order of mainOrderSummary) {
				if (order.type === "Combo") {
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

					// Add side to the order item
					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.side.menu_id,
						}
					);

					// Add entrees to the order item
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

	// Function to update entree quantities
	const updateItemQuantity = (type, item, delta) => {
		if (type === "entree") {
			setSelectedEntrees((prev) => {
				const index = prev.findIndex(
					(selectedItem) => selectedItem.entree.menu_id === item.menu_id
				);
				if (index >= 0) {
					const updatedItems = [...prev];
					updatedItems[index].quantity += delta;
					if (updatedItems[index].quantity <= 0) {
						updatedItems.splice(index, 1);
					}
					return updatedItems;
				} else if (delta > 0) {
					return [...prev, { entree: item, quantity: delta }];
				}
				return prev;
			});
		}
		// Handle other types if necessary
	};

	// Function to add combo to order
	const handleAddComboToOrder = () => {
		if (!comboType || !selectedSide || selectedEntrees.length === 0) {
			showSnackbar("Please complete your combo selection.", "warning");
			return;
		}

		// Calculate total extra cost for entrees
		const extraCost = selectedEntrees.reduce((total, { entree, quantity }) => {
			const entreeExtraCost = parseFloat(entree.extra_cost || 0);
			return total + entreeExtraCost * quantity;
		}, 0);

		// Calculate combo subtotal
		const subtotal = calculateComboPrice(comboType) + extraCost;

		// Create the combo order
		const comboOrder = {
			type: "Combo",
			combo: comboType, // Contains combo details
			side: selectedSide,
			entrees: selectedEntrees,
			subtotal,
		};

		// Add to main order summary
		setMainOrderSummary((prev) => [...prev, comboOrder]);

		// Reset selections
		setComboType(null);
		setSelectedSide(null);
		setSelectedEntrees([]);
		setCurrentStep("categorySelection");
		showSnackbar("Combo added to cart.", "success");
	};

	// Function to calculate combo price
	const calculateComboPrice = (combo) => {
		// Use the price from the combo object
		return parseFloat(combo.price) || 0;
	};

	return (
		<KioskContext.Provider
			value={{
				menuData,
				setMenuData,
				containerData,
				setContainerData,
				appetizerPrice,
				setAppetizerPrice,
				drinkPrice,
				setDrinkPrice,
				appetizerContainerId,
				setAppetizerContainerId,
				drinkContainerId,
				setDrinkContainerId,
				currentStep,
				setCurrentStep,
				comboType,
				setComboType,
				selectedSide,
				setSelectedSide,
				selectedEntrees,
				setSelectedEntrees,
				mainOrderSummary,
				setMainOrderSummary,
				snackbar,
				setSnackbar,
				confirmDialogOpen,
				setConfirmDialogOpen,
				orderToRemoveIndex,
				setOrderToRemoveIndex,
				showSnackbar,
				handleAddItemsToOrder,
				handleRemoveOrder,
				confirmRemoveOrder,
				handlePlaceOrder,

				updateItemQuantity,
				handleAddComboToOrder,
				calculateComboPrice,
			}}
		>
			{children}
		</KioskContext.Provider>
	);
};
