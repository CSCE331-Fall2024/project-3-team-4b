import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

/**
 * @fileoverview Provides a global context for the kiosk application, managing menu data,
 * container data, order states, and actions related to ordering. Offers utility functions
 * such as placing orders, adding combos, and managing selected items.
 */

export const KioskContext = createContext();

/**
 * KioskProvider component.
 * Wraps the application in a context provider, making global state and functions available
 * throughout the kiosk ordering process.
 *
 * @function KioskProvider
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} The provider component that shares kiosk state and actions.
 */
export const KioskProvider = ({ children }) => {
	const [menuData, setMenuData] = useState([]);
	const [containerData, setContainerData] = useState([]);
	const [appetizerPrice, setAppetizerPrice] = useState(0);
	const [drinkPrice, setDrinkPrice] = useState(0);
	const [appetizerContainerId, setAppetizerContainerId] = useState(null);
	const [drinkContainerId, setDrinkContainerId] = useState(null);
	const [currentStep, setCurrentStep] = useState("categorySelection");

	// Selected items and categories
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedCombo, setSelectedCombo] = useState(null);
	const [selectedSide, setSelectedSide] = useState(null);
	const [selectedEntrees, setSelectedEntrees] = useState([]);
	const [selectedAppetizers, setSelectedAppetizers] = useState([]);

	// Order summary and UI feedback
	const [mainOrderSummary, setMainOrderSummary] = useState([]);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [orderToRemoveIndex, setOrderToRemoveIndex] = useState(null);

	// Refs for managing up-to-date state within async operations
	const selectedComboRef = useRef(selectedCombo);
	const selectedSideRef = useRef(selectedSide);
	const selectedEntreesRef = useRef(selectedEntrees);
	const mainOrderSummaryRef = useRef(mainOrderSummary);

	useEffect(() => {
		selectedComboRef.current = selectedCombo;
	}, [selectedCombo]);

	useEffect(() => {
		selectedSideRef.current = selectedSide;
	}, [selectedSide]);

	useEffect(() => {
		selectedEntreesRef.current = selectedEntrees;
	}, [selectedEntrees]);

	useEffect(() => {
		mainOrderSummaryRef.current = mainOrderSummary;
	}, [mainOrderSummary]);

	/**
	 * Determines the required number of entrees for the selected combo.
	 * @function getRequiredEntrees
	 * @param {Object} [combo] - The combo object; if not provided, uses the currently selected combo.
	 * @returns {number} The required number of entrees for the combo.
	 */
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

	/**
	 * Displays a snackbar message for user feedback.
	 * @function showSnackbar
	 * @param {string} message - The message to display.
	 * @param {string} [severity="success"] - The severity of the message (e.g., "error", "warning").
	 */
	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	/**
	 * Adds an array of items (e.g., combos, appetizers, drinks) to the main order summary.
	 * @function handleAddItemsToOrder
	 * @param {Array} items - The items to add to the order summary.
	 */
	const handleAddItemsToOrder = (items) => {
		setMainOrderSummary((prev) => {
			const updatedSummary = [...prev, ...items];
			console.log("Updated mainOrderSummary:", updatedSummary);
			return updatedSummary;
		});
	};

	/**
	 * Initiates the removal of an item from the order summary by opening a confirmation dialog.
	 * @function handleRemoveOrder
	 * @param {number} index - The index of the order item to remove.
	 */
	const handleRemoveOrder = (index) => {
		setOrderToRemoveIndex(index);
		setConfirmDialogOpen(true);
	};

	/**
	 * Confirms the removal of an item from the order summary and updates the state.
	 * @function confirmRemoveOrder
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
	 * Places the current order by sending order details to the server.
	 * Creates the order, adds items to it, and handles any errors.
	 * @function handlePlaceOrder
	 * @async
	 * @returns {Promise<void>}
	 */
	const handlePlaceOrder = async () => {
		const currentOrderSummary = mainOrderSummaryRef.current;
		console.log("Current mainOrderSummary:", currentOrderSummary);

		if (currentOrderSummary.length === 0) {
			showSnackbar("No items in the order to place.", "warning");
			return;
		}

		const time = new Date().toISOString().slice(0, 16);

		try {
			const totalOrderPrice = currentOrderSummary.reduce(
				(total, order) => total + order.subtotal,
				0
			);

			// Create the order
			const orderResponse = await axios.post(
				"https://project-3-team-4b-server.vercel.app/api/orders",
				{
					time,
					total: totalOrderPrice,
					employee_id: 1,
				}
			);
			const orderId = orderResponse.data.order_id;

			// Process each item in the summary
			for (const order of currentOrderSummary) {
				if (order.type === "Combo") {
					// Handle combo order item
					const orderItemResponse = await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/order-items",
						{
							order_id: orderId,
							quantity: 1,
							container_id: order.combo.container_id,
						}
					);
					const orderItemId = orderItemResponse.data.order_item_id;

					// Add side
					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.side.menu_id,
							quantity: 1,
						}
					);

					// Add entrees
					for (const { entree, quantity } of order.entrees) {
						await axios.post(
							"https://project-3-team-4b-server.vercel.app/api/menu-items",
							{
								order_item_id: orderItemId,
								menu_id: entree.menu_id,
								quantity,
							}
						);
					}
				} else if (order.type === "Appetizer") {
					// Handle appetizer order item
					if (appetizerContainerId === null) {
						showSnackbar("Appetizer container not found.", "error");
						return;
					}
					const orderItemResponse = await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/order-items",
						{
							order_id: orderId,
							quantity: order.quantity,
							container_id: appetizerContainerId,
						}
					);
					const orderItemId = orderItemResponse.data.order_item_id;

					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.item.menu_id,
							quantity: order.quantity,
						}
					);
				} else if (order.type === "Drink") {
					// Handle drink order item
					if (drinkContainerId === null) {
						showSnackbar("Drink container not found.", "error");
						return;
					}
					const orderItemResponse = await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/order-items",
						{
							order_id: orderId,
							quantity: order.quantity,
							container_id: drinkContainerId,
						}
					);
					const orderItemId = orderItemResponse.data.order_item_id;

					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.item.menu_id,
							quantity: order.quantity,
						}
					);
				}
			}

			showSnackbar(`Order placed successfully: Order ID ${orderId}`, "success");
			setMainOrderSummary([]);
		} catch (error) {
			console.error("Error placing order:", error);
			if (error.response && error.response.data) {
				const errorMessage =
					error.response.data.error ||
					error.response.data.message ||
					"An error occurred while placing the order.";
				showSnackbar(`Failed to place order: ${errorMessage}`, "error");
			} else if (error.message) {
				showSnackbar(`Failed to place order: ${error.message}`, "error");
			} else {
				showSnackbar("Failed to place order. Please try again.", "error");
			}
		}
	};

	/**
	 * Updates the quantity of a specific item type (currently supports entrees).
	 * If the entree does not exist yet and delta > 0, it is added.
	 * If the entree exists, its quantity is adjusted or removed if it falls to zero.
	 *
	 * @function updateItemQuantity
	 * @param {string} type - The type of item, e.g., "entree".
	 * @param {Object} item - The item to update.
	 * @param {number} delta - The change in quantity (positive or negative).
	 */
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
	};

	/**
	 * Adds the currently selected combo, side, and entrees to the order if selections are valid.
	 * Resets state and navigates back to category selection.
	 *
	 * @function handleAddComboToOrder
	 */
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

		// Calculate extra cost for entrees
		const extraCost = currentSelectedEntrees.reduce(
			(total, { entree, quantity }) => {
				const entreeExtraCost = parseFloat(entree.extra_cost || 0);
				return total + entreeExtraCost * quantity;
			},
			0
		);

		// Calculate combo subtotal
		const subtotal = calculateComboPrice(currentCombo) + extraCost;

		const comboOrder = {
			type: "Combo",
			combo: currentCombo,
			side: currentSide,
			entrees: currentSelectedEntrees,
			subtotal,
		};

		setMainOrderSummary((prev) => {
			const updatedSummary = [...prev, comboOrder];
			console.log("Updated mainOrderSummary:", updatedSummary);
			return updatedSummary;
		});

		setSelectedCombo(null);
		setSelectedSide(null);
		setSelectedEntrees([]);
		setCurrentStep("categorySelection");
		showSnackbar("Combo added to cart.", "success");
	};

	/**
	 * Calculates the price of a combo from the combo object.
	 * @function calculateComboPrice
	 * @param {Object} combo - The combo object.
	 * @returns {number} The price of the combo.
	 */
	const calculateComboPrice = (combo) => {
		return parseFloat(combo.price) || 0;
	};

	useEffect(() => {
		fetchContainerData();
	}, []);

	/**
	 * Fetches container data and updates the global state with combo containers, appetizer/drink IDs, and prices.
	 * After setting these, fetches the menu data.
	 * @async
	 * @function fetchContainerData
	 * @returns {Promise<void>}
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

			await fetchMenuData(appetizerPriceValue, drinkPriceValue);
		} catch (error) {
			console.error("Error fetching container data:", error);
			showSnackbar("Error fetching container data.", "error");
		}
	};

	/**
	 * Fetches menu data and sets appetizer and drink prices.
	 * @async
	 * @function fetchMenuData
	 * @param {number} appetizerPriceValue - The price for appetizers.
	 * @param {number} drinkPriceValue - The price for drinks.
	 * @returns {Promise<void>}
	 */
	const fetchMenuData = async (appetizerPriceValue, drinkPriceValue) => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/menu"
			);
			let data = response.data;

			data = data.map((item) => {
				if (item.type === "Appetizer") {
					return { ...item, price: appetizerPriceValue };
				} else if (item.type === "Drink") {
					return { ...item, price: drinkPriceValue };
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
