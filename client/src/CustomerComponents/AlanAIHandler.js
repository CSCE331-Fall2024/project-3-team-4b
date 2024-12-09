import { useEffect, useRef, useContext } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { KioskContext } from "./KioskContext";

/**
 * @fileoverview A React component that integrates with the Alan AI Voice Assistant.
 * It sets up voice commands to navigate between ordering steps, select menu items,
 * and place orders through voice interactions. This component uses the global state
 * from KioskContext to interact with the kiosk ordering flow.
 */

/**
 * AlanAIHandler component.
 * Initializes the Alan AI button and handles various voice commands that control
 * the ordering steps and selected items in the kiosk application.
 *
 * @function AlanAIHandler
 * @returns {null} The component does not render any visible elements.
 */
function AlanAIHandler() {
	const alanBtnInstance = useRef(null);

	const {
		currentStep,
		setCurrentStep,
		selectedCombo,
		setSelectedCombo,
		selectedSide,
		setSelectedSide,
		selectedEntrees,
		setSelectedEntrees,
		selectedCategory,
		setSelectedCategory,
		updateItemQuantity,
		handleAddComboToOrder,
		handleAddItemsToOrder,
		showSnackbar,
		containerData,
		menuData,
		getRequiredEntrees,
		handlePlaceOrder,
	} = useContext(KioskContext);

	const containerDataRef = useRef(containerData);
	const menuDataRef = useRef(menuData);
	const selectedEntreesRef = useRef(selectedEntrees);
	const selectedComboRef = useRef(selectedCombo);
	const handlePlaceOrderRef = useRef(handlePlaceOrder);

	useEffect(() => {
		selectedComboRef.current = selectedCombo;
	}, [selectedCombo]);

	useEffect(() => {
		selectedEntreesRef.current = selectedEntrees;
	}, [selectedEntrees]);

	useEffect(() => {
		containerDataRef.current = containerData;
	}, [containerData]);

	useEffect(() => {
		menuDataRef.current = menuData;
	}, [menuData]);

	useEffect(() => {
		handlePlaceOrderRef.current = handlePlaceOrder;
	}, [handlePlaceOrder]);

	useEffect(() => {
		if (!alanBtnInstance.current) {
			alanBtnInstance.current = alanBtn({
				key: "fcc4852254e3439d87d8ab67e5a08e922e956eca572e1d8b807a3e2338fdd0dc/prod",
				onCommand: (commandData) => {
					console.log("Received commandData:", commandData);
					const { command } = commandData;
					switch (command) {
						case "selectCategory":
							handleCategoryClick(commandData.category);
							break;
						case "selectCombo":
							handleComboSelect(commandData.combo);
							break;
						case "selectSide":
							handleSideSelect(commandData.side);
							break;
						case "selectEntree":
							handleEntreeSelect(commandData.entree, commandData.quantity);
							break;
						case "addComboToOrder":
							handleAddComboToOrder();
							break;
						case "addAppetizer":
							handleAddAppetizer(
								commandData.appetizerName,
								commandData.quantity
							);
							break;
						case "addDrink":
							handleAddDrink(commandData.drinkName, commandData.quantity);
							break;
						case "placeOrder":
							setTimeout(() => {
								handlePlaceOrderRef.current();
							}, 500);
							break;
						case "goBack":
							handleGoBack(commandData.targetStep);
							break;
						case "next":
							handleNext(commandData.targetStep);
							break;
						default:
							console.log("Unknown command received:", commandData);
							break;
					}
				},
				onConnectionStatus: function (status) {
					console.log("Alan AI connection status:", status);
					if (status === "authorized") {
						alanBtnInstance.current.setVisualState({
							currentStep,
							selectedCategory,
							selectedCombo,
							selectedSide,
							selectedEntrees,
						});
						console.log(
							"Initial visual state set with currentStep:",
							currentStep
						);
					}
				},
				rootEl: document.getElementById("alan-btn"),
			});
		} else {
			alanBtnInstance.current.setVisualState({
				currentStep,
				selectedCategory,
				selectedCombo,
				selectedSide,
				selectedEntrees,
			});
		}
	}, [
		currentStep,
		selectedCategory,
		selectedCombo,
		selectedSide,
		selectedEntrees,
		handlePlaceOrder,
	]);

	/**
	 * Handles selection of a category via voice command.
	 * @param {string} category - The category name.
	 */
	const handleCategoryClick = (category) => {
		const normalizedCategory = category.toLowerCase();
		setSelectedCategory(normalizedCategory);
		switch (normalizedCategory) {
			case "combos":
				setSelectedCombo(null);
				setSelectedSide(null);
				setSelectedEntrees([]);
				setCurrentStep("comboSelection");
				break;
			case "appetizers":
				setCurrentStep("appetizerSelection");
				break;
			case "drinks":
				setCurrentStep("drinkSelection");
				break;
			default:
				showSnackbar(`Category "${category}" is not available.`, "error");
				break;
		}
	};

	/**
	 * Handles selection of a combo item via voice command.
	 * @param {string} comboName - The name of the combo to select.
	 */
	const handleComboSelect = (comboName) => {
		console.log("handleComboSelect called with comboName:", comboName);
		const combo = containerDataRef.current.find(
			(item) => item.name.toLowerCase() === comboName.toLowerCase()
		);
		if (combo) {
			setSelectedCombo(combo);
			setCurrentStep("sideSelection");
			showSnackbar(`${combo.name} selected.`, "success");
		} else {
			showSnackbar(`Combo "${comboName}" is not available.`, "error");
		}
	};

	/**
	 * Handles selection of a side item via voice command.
	 * @param {string} sideName - The name of the side to select.
	 */
	const handleSideSelect = (sideName) => {
		const side = menuDataRef.current.find(
			(item) =>
				item.type === "Side" &&
				item.name.toLowerCase() === sideName.toLowerCase()
		);
		if (side) {
			setSelectedSide(side);
			showSnackbar(`${side.name} selected as your side.`, "success");
		} else {
			showSnackbar(`Side "${sideName}" is not available.`, "error");
		}
	};

	/**
	 * Handles selection of an entree item via voice command, including quantity.
	 * @param {string} entreeName - The name of the entree to select.
	 * @param {number} [quantity=1] - The quantity of the entree to add or remove.
	 */
	const handleEntreeSelect = (entreeName, quantity = 1) => {
		console.log(
			"selectedCombo in handleEntreeSelect:",
			selectedComboRef.current
		);
		const entree = menuDataRef.current.find(
			(item) =>
				item.type === "Entree" &&
				item.name.toLowerCase() === entreeName.toLowerCase()
		);

		if (entree) {
			const requiredEntrees = getRequiredEntrees(selectedComboRef.current);
			const totalSelectedEntrees = selectedEntreesRef.current.reduce(
				(sum, item) => sum + item.quantity,
				0
			);

			if (totalSelectedEntrees + quantity > requiredEntrees) {
				showSnackbar(
					`You cannot select more than ${requiredEntrees} entree(s) for your combo.`,
					"warning"
				);
				return;
			}

			updateItemQuantity("entree", entree, quantity);
			if (quantity > 0) {
				showSnackbar(`${entree.name} added to your selection.`, "success");
			} else {
				showSnackbar(`${entree.name} removed from your selection.`, "info");
			}

			// Inform user about remaining entrees to select
			const newTotalSelectedEntrees = totalSelectedEntrees + quantity;
			if (newTotalSelectedEntrees < requiredEntrees) {
				const remaining = requiredEntrees - newTotalSelectedEntrees;
				showSnackbar(`Please select ${remaining} more entree(s).`, "info");
			} else if (newTotalSelectedEntrees === requiredEntrees) {
				showSnackbar(
					`You have selected the required number of entrees.`,
					"success"
				);
			}
		} else {
			showSnackbar(`Entree "${entreeName}" is not available.`, "error");
		}
	};

	/**
	 * Handles adding appetizers to the order via voice command.
	 * @param {string} appetizerName - The name of the appetizer.
	 * @param {number} [quantity=1] - The quantity to add.
	 */
	const handleAddAppetizer = (appetizerName, quantity = 1) => {
		const appetizer = menuDataRef.current.find(
			(item) =>
				item.type === "Appetizer" &&
				item.name.toLowerCase() === appetizerName.toLowerCase()
		);

		if (appetizer) {
			const appetizerPriceValue = parseFloat(appetizer.price);
			if (isNaN(appetizerPriceValue)) {
				console.error("Invalid appetizer price:", appetizer.price);
				showSnackbar("Error: Invalid appetizer price.", "error");
				return;
			}

			const subtotal = appetizerPriceValue * quantity;

			const appetizerOrder = {
				type: "Appetizer",
				item: appetizer,
				quantity,
				subtotal,
			};

			handleAddItemsToOrder([appetizerOrder]);
			showSnackbar(
				`${quantity} ${appetizer.name}(s) added to your cart.`,
				"success"
			);
		} else {
			showSnackbar(`Appetizer "${appetizerName}" is not available.`, "error");
		}
	};

	/**
	 * Handles adding drinks to the order via voice command.
	 * @param {string} drinkName - The name of the drink.
	 * @param {number} [quantity=1] - The quantity to add.
	 */
	const handleAddDrink = (drinkName, quantity = 1) => {
		const drink = menuDataRef.current.find(
			(item) =>
				item.type === "Drink" &&
				item.name.toLowerCase() === drinkName.toLowerCase()
		);

		if (drink) {
			const drinkPriceValue = parseFloat(drink.price);
			if (isNaN(drinkPriceValue)) {
				console.error("Invalid drink price:", drink.price);
				showSnackbar("Error: Invalid drink price.", "error");
				return;
			}

			const subtotal = drinkPriceValue * quantity;
			const drinkOrder = {
				type: "Drink",
				item: drink,
				quantity,
				subtotal,
			};

			handleAddItemsToOrder([drinkOrder]);
			showSnackbar(
				`${quantity} ${drink.name}(s) added to your cart.`,
				"success"
			);
		} else {
			showSnackbar(`Drink "${drinkName}" is not available.`, "error");
		}
	};

	/**
	 * Handles the "go back" voice command, navigating to a previous step in the ordering process.
	 * @param {string} targetStep - The target step to navigate back to.
	 */
	const handleGoBack = (targetStep) => {
		switch (targetStep) {
			case "categorySelection":
				setCurrentStep("categorySelection");
				break;
			case "comboSelection":
				setCurrentStep("comboSelection");
				break;
			case "sideSelection":
				setCurrentStep("sideSelection");
				break;
			case "appetizerSelection":
				setCurrentStep("appetizerSelection");
				break;
			case "drinkSelection":
				setCurrentStep("drinkSelection");
				break;
			default:
				console.log("Invalid target step for goBack:", targetStep);
				break;
		}
		showSnackbar("Going back.", "info");
	};

	/**
	 * Handles the "next" voice command, moving to the specified next step.
	 * @param {string} targetStep - The target step to navigate forward to.
	 */
	const handleNext = (targetStep) => {
		setCurrentStep(targetStep);
		showSnackbar("Proceeding to the next step.", "success");
	};

	return null;
}

export default AlanAIHandler;
