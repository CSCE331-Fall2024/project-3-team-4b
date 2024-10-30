import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../assets/panda-logo.svg";

import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	Toolbar,
	Typography,
	IconButton,
	Divider,
	CssBaseline,
	Box,
} from "@mui/material";

function Navbar({ employeeName, selectedSection, onSectionChange }) {
	const sections = ["Menu", "Inventory", "Orders", "Employees", "Analytics"];
	const [open, setOpen] = useState(false);

	const handleDrawerToggle = () => {
		setOpen(!open);
	};

	return (
		<div>
			<Toolbar>
				<IconButton onClick={handleDrawerToggle}>
					<MenuIcon />
				</IconButton>
			</Toolbar>

			<Drawer variant="temporary" open={open} onClose={handleDrawerToggle}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
					}}
				>
					<Toolbar>
						<img src={Logo} alt="Panda Express Logo" />
					</Toolbar>

					<Box
						sx={{
							flexGrow: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Typography variant="h6">Welcome, {employeeName}</Typography>
						<Divider sx={{ width: "100%", my: 2 }} />

						<List>
							{sections.map((text) => (
								<ListItem
									button
									key={text}
									selected={selectedSection === text}
									onClick={() => {
										onSectionChange(text);
										handleDrawerToggle();
									}}
								>
									<ListItemText primary={text} />
								</ListItem>
							))}
						</List>
					</Box>

					<Box sx={{ width: "100%" }}>
						<Divider />
						<List>
							<ListItem
								button
								onClick={() => {
									onSectionChange("Logout");
									handleDrawerToggle();
								}}
							>
								<ListItemText primary="Logout" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									onSectionChange("Switch User");
									handleDrawerToggle();
								}}
							>
								<ListItemText primary="Switch User" />
							</ListItem>
						</List>
					</Box>
				</Box>
			</Drawer>
		</div>
	);
}

export default Navbar;
