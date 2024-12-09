import React, { useContext } from "react";
import { KioskContext } from "./KioskContext";
import CategorySelection from "./CategorySelection";
import ComboSelection from "./ComboSelection";
import SideSelection from "./SideSelection";
import EntreeSelection from "./EntreeSelection";
import AppetizerSelection from "./AppetizerSelection";
import DrinkSelection from "./DrinkSelection";

/**
 * @fileoverview A React component that acts as a central switcher between different selection steps.
 * Depending on the current step in the ordering process, it displays the appropriate selection component.
 */

/**
 * SelectionSteps component.
 * Renders different selection components (category, combo, side, entree, appetizer, drink)
 * based on the current step stored in global context.
 *
 * @function SelectionSteps
 * @param {Object} props
 * @param {boolean} props.isLargeText - Whether to use larger font sizes for accessibility.
 * @returns {JSX.Element} The rendered selection step component.
 */
function SelectionSteps({ isLargeText }) {
	const { currentStep } = useContext(KioskContext);

	switch (currentStep) {
		case "categorySelection":
			return <CategorySelection isLargeText={isLargeText} />;
		case "comboSelection":
			return <ComboSelection isLargeText={isLargeText} />;
		case "sideSelection":
			return <SideSelection isLargeText={isLargeText} />;
		case "entreeSelection":
			return <EntreeSelection isLargeText={isLargeText} />;
		case "appetizerSelection":
			return <AppetizerSelection isLargeText={isLargeText} />;
		case "drinkSelection":
			return <DrinkSelection isLargeText={isLargeText} />;
		default:
			return <CategorySelection isLargeText={isLargeText} />;
	}
}

export default SelectionSteps;
