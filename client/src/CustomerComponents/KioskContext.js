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
	const [selectedCombo, setSelectedCombo] = useState(null);
	const [selectedSide, setSelectedSide] = useState(null);
	const [selectedEntrees, setSelectedEntrees] = useState([]);
	const [selectedAppetizers, setSelectedAppetizers] = useState([]);
	const [selectedDrinks, setSelectedDrinks] = useState([]);
	const [mainOrderSummary, setMainOrderSummary] = useState([]);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [orderToRemoveIndex, setOrderToRemoveIndex] = useState(null);

	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	const updateItemQuantity = (itemType, item, delta) => {
		let setter;
		let itemKey; // 'entree' or 'item'
		switch (itemType) {
			case "entree":
				setter = setSelectedEntrees;
				itemKey = "entree";
				break;
			case "appetizer":
				setter = setSelectedAppetizers;
				itemKey = "item";
				break;
			case "drink":
				setter = setSelectedDrinks;
				itemKey = "item";
				break;
			default:
				return;
		}
		setter((prevItems) => {
			const index = prevItems.findIndex(
				(i) => i[itemKey].menu_id === item.menu_id
			);
			const updatedItems = [...prevItems];
			if (index >= 0) {
				updatedItems[index].quantity += delta;
				if (updatedItems[index].quantity <= 0) {
					updatedItems.splice(index, 1);
				}
			} else if (delta > 0) {
				updatedItems.push({ [itemKey]: item, quantity: delta });
			}
			return updatedItems;
		});
	};

	const calculateComboSubtotal = (combo, side, entrees) => {
		let subtotal = Number(combo.price) || 0;
		subtotal += Number(side.extra_cost || 0);
		entrees.forEach(({ entree, quantity }) => {
			subtotal += Number(entree.extra_cost || 0) * quantity;
		});
		return subtotal;
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
		setMainOrderSummary([...mainOrderSummary, comboOrder]);
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

	const handlePlaceOrder = async () => {
		if (mainOrderSummary.length === 0) {
			showSnackbar("No items in the order to place.", "warning");
			return;
		}

		// Format the date as 'YYYY-MM-DDTHH:mm'
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
					await axios.post(
						"https://project-3-team-4b-server.vercel.app/api/menu-items",
						{
							order_item_id: orderItemId,
							menu_id: order.side.menu_id,
						}
					);
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
				mainOrderSummary,
				setMainOrderSummary,
				snackbar,
				setSnackbar,
				confirmDialogOpen,
				setConfirmDialogOpen,
				orderToRemoveIndex,
				setOrderToRemoveIndex,
				showSnackbar,
				updateItemQuantity,
				handleAddComboToOrder,
				handleAddAppetizersToOrder,
				handleAddDrinksToOrder,
				handleRemoveOrder,
				confirmRemoveOrder,
				handlePlaceOrder,
				calculateComboSubtotal,
			}}
		>
			{children}
		</KioskContext.Provider>
	);
};
