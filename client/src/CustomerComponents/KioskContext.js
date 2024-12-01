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
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedCombo, setSelectedCombo] = useState(null); // Renamed from comboType
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

			// Rest of your order placement logic...

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
		if (!selectedCombo || !selectedSide || selectedEntrees.length === 0) {
			showSnackbar("Please complete your combo selection.", "warning");
			return;
		}

		// Calculate total extra cost for entrees
		const extraCost = selectedEntrees.reduce((total, { entree, quantity }) => {
			const entreeExtraCost = parseFloat(entree.extra_cost || 0);
			return total + entreeExtraCost * quantity;
		}, 0);

		// Calculate combo subtotal
		const subtotal = calculateComboPrice(selectedCombo) + extraCost;

		// Create the combo order
		const comboOrder = {
			type: "Combo",
			combo: selectedCombo, // Contains combo details
			side: selectedSide,
			entrees: selectedEntrees,
			subtotal,
		};

		// Add to main order summary
		setMainOrderSummary((prev) => [...prev, comboOrder]);

		// Reset selections
		setSelectedCombo(null);
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
				selectedCategory,
				setSelectedCategory,
				selectedCombo,
				setSelectedCombo,
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
