import React from "react";
import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";

function Navbar({ employeeName, selectedSection, onSectionChange }) {
	const sections = [
		"Menu",
		"Inventory",
		"Orders",
		"Employees",
		"Analytics",
		"Logout",
		"Switch User",
	];

	return (
		<Drawer variant="permanent">
			<Toolbar>
				<Typography variant="h6" noWrap>
					Welcome, {employeeName}
				</Typography>
			</Toolbar>
			<List>
				{sections.map((text) => (
					<ListItem
						button
						key={text}
						selected={selectedSection === text}
						onClick={() => onSectionChange(text)}
					>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		</Drawer>
	);
}

export default Navbar;
