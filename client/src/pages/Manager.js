import React, { useState, useContext } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../ManagerComponents/Navbar";
import Menu from "../ManagerComponents/Menu";
import Inventory from "../ManagerComponents/Inventory";
import Orders from "../ManagerComponents/Orders";
import Employees from "../ManagerComponents/Employees";
import Analytics from "../ManagerComponents/Analytics";

import { AuthContext } from "../LoginComponents/AuthContext";

/**
 * Manager component that serves as the main layout for the manager interface.
 * It handles navigation between different sections like Menu, Inventory, Orders, Employees, and Analytics.
 *
 * @returns {JSX.Element} The rendered Manager component.
 */
function Manager() {
	const [selectedSection, setSelectedSection] = useState("Menu");
	const { user, logout } = useContext(AuthContext); // Use AuthContext to access user and logout function
	const navigate = useNavigate();

	/**
	 * Handles the change of the selected section in the navigation.
	 *
	 * @param {string} section - The section selected by the user.
	 */
	const handleSectionChange = (section) => {
		if (section === "Logout" || section === "Switch User") {
			logout();
			if (section === "Switch User") {
				navigate("/", { state: { forceGoogleAccountSelection: true } });
			} else {
				navigate("/");
			}
		} else {
			setSelectedSection(section);
		}
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
				employeeName={user ? user.name : "Guest"}
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
