// KioskContext.js

import React, { createContext, useState, useEffect, useRef } from "react";
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
	const [selectedAppetizers, setSelectedAppetizers] = useState([]);

	const [mainOrderSummary, setMainOrderSummary] = useState([]);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [orderToRemoveIndex, setOrderToRemoveIndex] = useState(null);

	// Create refs for selectedCombo, selectedSide, and selectedEntrees
	const selectedComboRef = useRef(selectedCombo);
	const selectedSideRef = useRef(selectedSide);
	const selectedEntreesRef = useRef(selectedEntrees);

	// Update refs whenever the state changes
	useEffect(() => {
		selectedComboRef.current = selectedCombo;
	}, [selectedCombo]);

	useEffect(() => {
		selectedSideRef.current = selectedSide;
	}, [selectedSide]);

	useEffect(() => {
		selectedEntreesRef.current = selectedEntrees;
	}, [selectedEntrees]);

	const getRequiredEntrees = (combo) => {
		const currentCombo = combo || selectedComboRef.current;
		console.log("selectedCombo in getRequiredEntrees:", currentCombo);
		if (!currentCombo) return 0;
		switch (currentCombo.name) {
			case "Bowl":
				return 1;
			case "Plate":
				return 2;
			case "Bigger Plate":
				return 3;
			default:
				return 0;
		}
	};

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
		const currentCombo = selectedComboRef.current;
		const currentSide = selectedSideRef.current;
		const currentSelectedEntrees = selectedEntreesRef.current;

		console.log("selectedCombo:", currentCombo);
		console.log("selectedSide:", currentSide);
		console.log("selectedEntrees:", currentSelectedEntrees);

		if (!currentCombo || !currentSide) {
			showSnackbar("Please complete your combo selection.", "warning");
			return;
		}

		const requiredEntrees = getRequiredEntrees(currentCombo);

		const totalSelectedEntrees = currentSelectedEntrees.reduce(
			(sum, item) => sum + item.quantity,
			0
		);

		if (totalSelectedEntrees !== requiredEntrees) {
			showSnackbar(
				`Please select ${requiredEntrees} entree(s) for your combo.`,
				"warning"
			);
			return;
		}

		// Calculate total extra cost for entrees
		const extraCost = currentSelectedEntrees.reduce(
			(total, { entree, quantity }) => {
				const entreeExtraCost = parseFloat(entree.extra_cost || 0);
				return total + entreeExtraCost * quantity;
			},
			0
		);

		// Calculate combo subtotal
		const subtotal = calculateComboPrice(currentCombo) + extraCost;

		// Create the combo order
		const comboOrder = {
			type: "Combo",
			combo: currentCombo,
			side: currentSide,
			entrees: currentSelectedEntrees,
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

	// Data fetching
	useEffect(() => {
		fetchContainerData();
	}, []);

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

			const appetizerContainer = allContainers.find(
				(container) => container.name === "Appetizer"
			);
			const drinkContainer = allContainers.find(
				(container) => container.name === "Drink"
			);

			const appetizerPriceValue = Number(appetizerContainer?.price) || 0;
			setAppetizerPrice(appetizerPriceValue);

			const drinkPriceValue = Number(drinkContainer?.price) || 0;
			setDrinkPrice(drinkPriceValue);

			setAppetizerContainerId(appetizerContainer?.container_id || null);
			setDrinkContainerId(drinkContainer?.container_id || null);

			// Fetch menu data after appetizerPrice and drinkPrice are set
			await fetchMenuData(appetizerPriceValue, drinkPriceValue);
		} catch (error) {
			console.error("Error fetching container data:", error);
			showSnackbar("Error fetching container data.", "error");
		}
	};

	const fetchMenuData = async (appetizerPriceValue, drinkPriceValue) => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/menu"
			);
			let data = response.data;

			// Add prices to appetizer and drink items
			data = data.map((item) => {
				if (item.type === "Appetizer") {
					return {
						...item,
						price: appetizerPriceValue,
					};
				} else if (item.type === "Drink") {
					return {
						...item,
						price: drinkPriceValue,
					};
				}
				return item;
			});

			setMenuData(data);
		} catch (error) {
			console.error("Error fetching menu data:", error);
			showSnackbar("Error fetching menu data.", "error");
		}
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
				selectedAppetizers,
				setSelectedAppetizers,
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
				getRequiredEntrees,
			}}
		>
			{children}
		</KioskContext.Provider>
	);
};
