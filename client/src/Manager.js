import React, { useState } from "react";
import Navbar from "./ManagerComponents/Navbar";
import Menu from "./ManagerComponents/Menu";

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
			</div>
		</div>
	);
}

export default Manager;
