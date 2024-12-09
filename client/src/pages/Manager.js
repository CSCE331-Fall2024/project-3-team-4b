import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import Navbar from "../ManagerComponents/Navbar";
import Menu from "../ManagerComponents/Menu";
import Inventory from "../ManagerComponents/Inventory";
import Orders from "../ManagerComponents/Orders";
import Employees from "../ManagerComponents/Employees";
import Analytics from "../ManagerComponents/Analytics";
import { useNavigate } from 'react-router-dom';

/**
 * Manager component that serves as the main layout for the manager interface.
 * It handles navigation between different sections like Menu, Inventory, Orders, Employees, and Analytics.
 *
 * @returns {JSX.Element} The rendered Manager component.
 */
function Manager( {role, setRole, user, setUser} ) {
	const [selectedSection, setSelectedSection] = useState("Menu");
	const employeeName = user.name;

	/**
	 * Handles the change of the selected section in the navigation.
	 *
	 * @param {string} section - The section selected by the user.
	 */
	const handleSectionChange = (section) => {
		setSelectedSection(section);
	};

	const navigate = useNavigate();

    // Fetch menu data and container data on mount
    useEffect(() => {
        if(role !== "manager"){
            navigate('/');
        }
    }, [role, navigate]);

	return (
		<Box
			sx={{
				display: "flex",
				height: "100vh",
				overflow: "hidden",
			}}
		>
			<Navbar
				user={user}
				setUser={setUser}
				role={role}
				setRole={setRole}
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
