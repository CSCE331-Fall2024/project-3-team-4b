// ManagerComponents/Navbar.js

import React, { useState } from "react";
import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	Typography,
	Divider,
	Box,
	ListItemIcon,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Avatar,
} from "@mui/material";
import Logo from "../assets/panda-logo.svg";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from 'react-router-dom';

/**
 * Navbar component that renders a navigation drawer with sections and user options.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The authenticated user object.
 * @param {string} props.selectedSection - The currently selected section name.
 * @param {function} props.onSectionChange - Callback function invoked when a section is selected.
 * @returns {JSX.Element} The rendered Navbar component.
 */
function Navbar({ role, setRole, user, setUser, selectedSection, onSectionChange }) {
	/** The width of the navigation drawer in pixels. */
	const drawerWidth = 240;
	const navigate = useNavigate();
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

	/** State to manage the open/close state of the logout confirmation dialog. */
	const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

	/**
	 * Handles the click event for the logout option.
	 */
	const handleLogoutClick = () => {
		setOpenLogoutDialog(true);
	};

	/**
	 * Confirms the logout action and triggers the logout process.
	 */
	const handleLogoutConfirm = () => {
		setOpenLogoutDialog(false);
		onSectionChange("Logout");
		setRole(null);
		setUser(null);
		navigate('/');
	};

	/**
	 * Cancels the logout action and closes the confirmation dialog.
	 */
	const handleLogoutCancel = () => {
		setOpenLogoutDialog(false);
	};

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
				<Avatar
					alt={user ? user.name : "User Avatar"}
					src={user && user.picture} // Assumes user.picture contains the profile image URL
					sx={{ width: 60, height: 60, mt: 2 }}
				/>
				<Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
					Welcome, {user ? user.name : "User"}
				</Typography>
				<Typography variant="body2" sx={{ textAlign: "center" }}>
					{user && user.email}
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
						sx={{
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.08)",
							},
						}}
					>
						<ListItemIcon>{section.icon}</ListItemIcon>
						<ListItemText primary={section.text} />
					</ListItem>
				))}
			</List>
			<Box sx={{ flexGrow: 1 }} />
			<Divider />
			<List>
				<ListItem button onClick={handleLogoutClick}>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItem>
			</List>

			{/* Logout Confirmation Dialog */}
			<Dialog
				open={openLogoutDialog}
				onClose={handleLogoutCancel}
				aria-labelledby="logout-dialog-title"
				aria-describedby="logout-dialog-description"
			>
				<DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
				<DialogContent>
					<Typography id="logout-dialog-description">
						Are you sure you want to log out?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleLogoutCancel} color="primary">
						Cancel
					</Button>
					<Button onClick={handleLogoutConfirm} color="primary" autoFocus>
						Logout
					</Button>
				</DialogActions>
			</Dialog>
		</Drawer>
	);
}

export default Navbar;
