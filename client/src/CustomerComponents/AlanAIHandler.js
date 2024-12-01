// AlanAIHandler.js

import React, { useEffect, useRef, useContext } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { KioskContext } from "./KioskContext";

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
		showSnackbar,
		containerData,
		menuData,
	} = useContext(KioskContext);

	// Create refs to hold the latest values of containerData and menuData
	const containerDataRef = useRef(containerData);
	const menuDataRef = useRef(menuData);

	// Update refs when containerData or menuData change
	useEffect(() => {
		containerDataRef.current = containerData;
	}, [containerData]);

	useEffect(() => {
		menuDataRef.current = menuData;
	}, [menuData]);

	// Initialize Alan AI and set up command handling
	useEffect(() => {
		if (!alanBtnInstance.current) {
			alanBtnInstance.current = alanBtn({
				key: "fcc4852254e3439d87d8ab67e5a08e922e956eca572e1d8b807a3e2338fdd0dc/stage", // Replace with your actual Alan AI SDK key
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
							selectedSide,
						});
						console.log(
							"Initial visual state set with currentStep:",
							currentStep
						);
					}
				},
				rootEl: document.getElementById("alan-btn"), // Ensure this div exists in your HTML
			});
		} else {
			alanBtnInstance.current.setVisualState({
				currentStep,
				selectedCategory,
				selectedSide,
			});
		}
	}, [currentStep, selectedCategory, selectedSide]);

	// Handler functions

	// Handle category selection
	const handleCategoryClick = (category) => {
		const normalizedCategory = category.toLowerCase();
		setSelectedCategory(normalizedCategory); // Set selectedCategory
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

	// Handle combo selection
	const handleComboSelect = (comboName) => {
		console.log("handleComboSelect called with comboName:", comboName);
		console.log("containerDataRef.current:", containerDataRef.current);
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

	// Handle side selection
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

	// Handle entree selection
	const handleEntreeSelect = (entreeName, quantity = 1) => {
		const entree = menuDataRef.current.find(
			(item) =>
				item.type === "Entree" &&
				item.name.toLowerCase() === entreeName.toLowerCase()
		);
		if (entree) {
			updateItemQuantity("entree", entree, quantity);
			if (quantity > 0) {
				showSnackbar(`${entree.name} added to your selection.`, "success");
			} else {
				showSnackbar(`${entree.name} removed from your selection.`, "info");
			}
		} else {
			showSnackbar(`Entree "${entreeName}" is not available.`, "error");
		}
	};

	// Handle "Go Back" functionality
	// AlanAIHandler.js

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
			default:
				console.log("Invalid target step for goBack:", targetStep);
				break;
		}
		showSnackbar("Going back.", "info");
	};

	// Handle "Next" functionality
	// AlanAIHandler.js

	const handleNext = (targetStep) => {
		setCurrentStep(targetStep);
		showSnackbar("Proceeding to the next step.", "success");
	};

	return null; // This component doesn't render any UI
}

export default AlanAIHandler;
