import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/Menu.css";

function Menu() {
	const [menuData, setMenuData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [selectedItem, setSelectedItem] = useState(null);

	useEffect(() => {
		fetchMenuData();
	}, []);

	const fetchMenuData = async () => {
		try {
			const response = await axios.get("/api/menu");
			setMenuData(response.data);
		} catch (error) {
			console.error("Error fetching menu data:", error);
			alert("Error fetching menu data.");
		}
	};

	const handleSearch = async () => {
		try {
			const response = await axios.get(`/api/menu?search=${searchText}`);
			setMenuData(response.data);
		} catch (error) {
			console.error("Error searching menu items:", error);
			alert("Error searching menu items.");
		}
	};

	const handleClearSearch = () => {
		setSearchText("");
		fetchMenuData();
	};

	const handleItemClick = (item) => {
		setSelectedItem(item);
		alert(`Selected item: ${item.name}`);
	};

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h5" gutterBottom>
				Panda Express Menu
			</Typography>

			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<TextField
					label="Search Menu Items"
					variant="outlined"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					size="small"
				/>
				<Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>
					Search
				</Button>
				<Button variant="outlined" onClick={handleClearSearch} sx={{ ml: 1 }}>
					Clear
				</Button>
				<Box sx={{ flexGrow: 1 }} />
				<Button variant="contained" color="primary" onClick={() => alert("Add new item")}>
					<AddIcon />
				</Button>
			</Box>

			<Box className="menu-grid">
				{menuData.map((item) => (
					<div key={item.menu_id} className="menu-item" onClick={() => handleItemClick(item)}>
						<img src={`/images/${item.name.toLowerCase().replace(/\s+/g, "_")}.png` || "default-image.jpg"} alt={item.name} />
						<div className="menu-item-overlay">{item.name}</div>
					</div>
				))}
			</Box>

			<Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
				<DialogTitle>Item Details</DialogTitle>
				<DialogContent>
					<Typography>Name: {selectedItem?.name}</Typography>
					<Typography>Type: {selectedItem?.type}</Typography>
					<Typography>Extra Cost: ${selectedItem?.extra_cost}</Typography>
					<Typography>Calories: {selectedItem?.calories}</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSelectedItem(null)}>Close</Button>
					<IconButton color="primary">
						<EditIcon />
					</IconButton>
					<IconButton color="error">
						<DeleteIcon />
					</IconButton>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default Menu;
