import React, { useState } from "react";

import Navbar from "../ManagerComponents/Navbar";
import Menu from "../ManagerComponents/Menu";
import Inventory from "../ManagerComponents/Inventory";
import Orders from "../ManagerComponents/Orders";
import Employees from "../ManagerComponents/Employees";
import Analytics from "../ManagerComponents/Analytics";

function Manager() {
	const [selectedSection, setSelectedSection] = useState("Menu");
	const employeeName = "Sage";

	const handleSectionChange = (section) => {
		setSelectedSection(section);
	};

	return (
		<div>
			<Navbar
				employeeName={employeeName}
				selectedSection={selectedSection}
				onSectionChange={handleSectionChange}
			/>
			<div style={{ flexGrow: 1 }}>
				{selectedSection === "Menu" && <Menu />}
				{selectedSection === "Inventory" && <Inventory />}
				{selectedSection === "Orders" && <Orders />}
				{selectedSection === "Employees" && <Employees />}
				{selectedSection === "Analytics" && <Analytics />}
			</div>
		</div>
	);
}

export default Manager;
