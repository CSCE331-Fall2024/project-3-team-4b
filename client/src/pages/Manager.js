import React, { useState } from "react";
import { Box } from "@mui/material";

import Navbar from "../ManagerComponents/Navbar";
import Menu from "../ManagerComponents/Menu";
import Inventory from "../ManagerComponents/Inventory";
import Orders from "../ManagerComponents/Orders";
import Employees from "../ManagerComponents/Employees";
import Analytics from "../ManagerComponents/Analytics";

/**
 * Manager component that serves as the main layout for the manager interface.
 * It handles navigation between different sections like Menu, Inventory, Orders, Employees, and Analytics.
 *
 * @returns {JSX.Element} The rendered Manager component.
 */
function Manager() {
	const [selectedSection, setSelectedSection] = useState("Menu");
	const employeeName = "Sage";

	/**
	 * Handles the change of the selected section in the navigation.
	 *
	 * @param {string} section - The section selected by the user.
	 */
	const handleSectionChange = (section) => {
		setSelectedSection(section);
	};

	return (
		<Box
			sx={{
				display: "flex",
				height: "100vh",
				overflow: "hidden",
			}}
		>
			<Navbar
				employeeName={employeeName}
				selectedSection={selectedSection}
				onSectionChange={handleSectionChange}
			/>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					overflow: "auto",
				}}
			>
				{selectedSection === "Menu" && <Menu />}
				{selectedSection === "Inventory" && <Inventory />}
				{selectedSection === "Orders" && <Orders />}
				{selectedSection === "Employees" && <Employees />}
				{selectedSection === "Analytics" && <Analytics />}
			</Box>
		</Box>
	);
}

export default Manager;
