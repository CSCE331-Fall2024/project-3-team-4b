import React, { useState } from "react";
import { Box } from "@mui/material";

import Navbar from "../ManagerComponents/Navbar";
import Menu from "../ManagerComponents/Menu";
import Inventory from "../ManagerComponents/Inventory";
import Employees from "../ManagerComponents/Employees";
import Orders from "../ManagerComponents/Orders";

function Manager() {
	const [selectedSection, setSelectedSection] = useState("Menu");
	const employeeName = "Sage";

	const handleSectionChange = (section) => {
		setSelectedSection(section);

		// if (section === "Logout") {

		// } else if (section === "Switch User") {

		// }
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
			</Box>
		</Box>
	);
}

export default Manager;
