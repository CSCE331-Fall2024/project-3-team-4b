import React from "react";
import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	Typography,
	Divider,
	Box,
	ListItemIcon,
} from "@mui/material";
import Logo from "../assets/panda-logo.svg";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

/**
 * Navbar component that renders a navigation drawer with sections and user options.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.employeeName - The name of the logged-in employee.
 * @param {string} props.selectedSection - The currently selected section name.
 * @param {function} props.onSectionChange - Callback function invoked when a section is selected.
 * @returns {JSX.Element} The rendered Navbar component.
 */
function Navbar({ employeeName, selectedSection, onSectionChange }) {
	/** The width of the navigation drawer in pixels. */
	const drawerWidth = 240;

	/**
	 * Array of section objects for the navigation menu.
	 * @type {Array<{text: string, icon: JSX.Element}>}
	 */
	const sections = [
		{ text: "Menu", icon: <MenuBookIcon /> },
		{ text: "Inventory", icon: <InventoryIcon /> },
		{ text: "Orders", icon: <ListAltIcon /> },
		{ text: "Employees", icon: <PeopleIcon /> },
		{ text: "Analytics", icon: <BarChartIcon /> },
	];

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: drawerWidth,
					boxSizing: "border-box",
					overflowX: "hidden",
				},
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					p: 2,
				}}
			>
				<img
					src={Logo}
					alt="Panda Express Logo"
					style={{ maxWidth: "100%", height: "150px" }}
				/>
				<Typography variant="h5" sx={{ mt: 2, textAlign: "center" }}>
					Welcome, {employeeName}
				</Typography>
			</Box>
			<Divider />
			<List>
				{sections.map((section) => (
					<ListItem
						button
						key={section.text}
						selected={selectedSection === section.text}
						onClick={() => onSectionChange(section.text)}
					>
						<ListItemIcon>{section.icon}</ListItemIcon>
						<ListItemText primary={section.text} />
					</ListItem>
				))}
			</List>
			<Box sx={{ flexGrow: 1 }} />
			<Divider />
			<List>
				<ListItem
					button
					onClick={() => {
						onSectionChange("Logout");
					}}
				>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItem>
				<ListItem
					button
					onClick={() => {
						onSectionChange("Switch User");
					}}
				>
					<ListItemIcon>
						<SwitchAccountIcon />
					</ListItemIcon>
					<ListItemText primary="Switch User" />
				</ListItem>
			</List>
		</Drawer>
	);
}

export default Navbar;
