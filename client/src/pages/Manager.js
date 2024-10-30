import React, { useState } from "react";
import Navbar from "../ManagerComponents/Navbar";

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
			<h1>Manager Components</h1>
		</div>
	);
}

export default Manager;
