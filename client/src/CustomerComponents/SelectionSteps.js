// SelectionSteps.js
import React, { useContext } from "react";
import { KioskContext } from "./KioskContext";
import CategorySelection from "./CategorySelection";
import ComboSelection from "./ComboSelection";
import SideSelection from "./SideSelection";
import EntreeSelection from "./EntreeSelection";
import AppetizerSelection from "./AppetizerSelection";
import DrinkSelection from "./DrinkSelection";

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
