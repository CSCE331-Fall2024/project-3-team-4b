import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Paper } from "@mui/material";

function RestaurantMenu() {
	const [menuData, setMenuData] = useState([]);
	const [containerData, setContainerData] = useState([]);
	const [hoveredItem, setHoveredItem] = useState(null);

	// Nutrition facts sourced and adjusted to the specified items only
	const nutritionFacts = {
		"The Original Orange Chicken": { calories: 490, fat: 23, carbs: 51, protein: 20 },
		"Grilled Teriyaki Chicken": { calories: 300, fat: 13, carbs: 8, protein: 36 },
		"Honey Walnut Shrimp": { calories: 360, fat: 23, carbs: 35, protein: 13 },
		"Broccoli Beef": { calories: 150, fat: 7, carbs: 13, protein: 9 },
		"Mushroom Chicken": { calories: 220, fat: 13, carbs: 12, protein: 16 },
		"Sweet Fire Chicken Breast": { calories: 380, fat: 13, carbs: 51, protein: 13 },
		"Chow Mein": { calories: 510, fat: 20, carbs: 68, protein: 13 },
		"Fried Rice": { calories: 520, fat: 16, carbs: 85, protein: 11 },
		"White Steamed Rice": { calories: 380, fat: 0, carbs: 87, protein: 7 },
		"Super Greens": { calories: 90, fat: 2.5, carbs: 7, protein: 6 },
	};

	useEffect(() => {
		fetchMenuData();
		fetchContainerData();
		addGoogleTranslateScript();
	}, []);

	const fetchMenuData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/menu"
			);
			setMenuData(response.data);
		} catch (error) {
			console.error("Error fetching menu data:", error);
		}
	};

	const fetchContainerData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/containers"
			);
			const filteredContainers = response.data.filter((container) =>
				["Bowl", "Plate", "Bigger Plate"].includes(container.name)
			);
			setContainerData(filteredContainers);
		} catch (error) {
			console.error("Error fetching container data:", error);
		}
	};

	const addGoogleTranslateScript = () => {
		if (
			document.querySelector(
				'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
			)
		) {
			console.warn("Google Translate script already loaded");
			return;
		}

		removeGoogleTranslateScript();

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src =
			"//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
		script.async = true;
		script.onerror = () => {
			console.error("Failed to load Google Translate script.");
		};
		document.body.appendChild(script);

		window.googleTranslateElementInit = () => {
			try {
				new window.google.translate.TranslateElement(
					{ pageLanguage: "en" },
					"google_translate_element"
				);
			} catch (error) {
				console.error("Failed to initialize Google Translate element:", error);
			}
		};
	};

	const removeGoogleTranslateScript = () => {
		const existingScript = document.querySelector(
			'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
		);
		if (existingScript) {
			existingScript.remove();
		}

		const translateElement = document.getElementById("google_translate_element");
		if (translateElement) {
			translateElement.innerHTML = "";
		}
	};

	const getImageUrl = (name) => {
		const formattedName = name
			.toLowerCase()
			.replace(/\s+/g, "_")
			.replace(/[^a-z0-9_]/g, ""); // remove any special chars
		return `/images/${formattedName}.png`;
	};

	const handleMouseEnter = (item, event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const boxTop = rect.top + window.scrollY - 10;
		const boxLeft = rect.left + window.scrollX + rect.width + 10;

		setHoveredItem({
			item,
			top: boxTop,
			left: boxLeft,
		});
	};

	const handleMouseLeave = () => {
		setHoveredItem(null);
	};

	const renderNutritionInfo = (name) => {
		const data = nutritionFacts[name];
		if (!data) {
			return <Typography>No nutrition data available.</Typography>;
		}

		return (
			<>
				<Typography>Calories: {data.calories}</Typography>
				<Typography>Fat: {data.fat}g</Typography>
				<Typography>Carbs: {data.carbs}g</Typography>
				<Typography>Protein: {data.protein}g</Typography>
			</>
		);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: 2,
				position: "relative",
			}}
		>
			{/* Google Translate Element */}
			<div id="google_translate_element" style={{ marginBottom: "20px" }}></div>

			{/* Container Section */}
			<Typography variant="h4" sx={{ marginBottom: 3 }}>
				Containers
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: 3,
					marginBottom: 5,
				}}
			>
				{containerData.map((container) => (
					<Box
						key={container.container_id}
						sx={{ textAlign: "center", position: "relative" }}
					>
						<img
							src={getImageUrl(container.name)}
							alt={container.name}
							style={{ width: "214px", height: "164px", borderRadius: 8 }}
							onMouseEnter={(e) => handleMouseEnter(container, e)}
							onMouseLeave={handleMouseLeave}
						/>
						<Typography sx={{ marginTop: 1 }}>{container.name}</Typography>
						{container.price !== 0 && (
							<Typography>Price: ${container.price}</Typography>
						)}
					</Box>
				))}
			</Box>

			{/* Entrees Section */}
			<Typography variant="h4" sx={{ marginBottom: 3 }}>
				Entrees
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: 3,
					marginBottom: 5,
				}}
			>
				{menuData
					.filter((item) => item.type === "Entree")
					.map((item) => (
						<Box
							key={item.menu_id}
							sx={{ textAlign: "center", position: "relative" }}
						>
							<img
								src={getImageUrl(item.name)}
								alt={item.name}
								style={{ width: "214px", height: "164px", borderRadius: 8 }}
								onMouseEnter={(e) => handleMouseEnter(item, e)}
								onMouseLeave={handleMouseLeave}
							/>
							<Typography sx={{ marginTop: 1 }}>{item.name}</Typography>
							{Number(item.extra_cost) !== 0.0 && (
								<Typography>Extra Cost: ${item.extra_cost}</Typography>
							)}
						</Box>
					))}
			</Box>

			{/* Sides Section */}
			<Typography variant="h4" sx={{ marginBottom: 3 }}>
				Sides
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: 3,
					marginBottom: 5,
				}}
			>
				{menuData
					.filter((item) => item.type === "Side")
					.map((item) => (
						<Box
							key={item.menu_id}
							sx={{ textAlign: "center", position: "relative" }}
						>
							<img
								src={getImageUrl(item.name)}
								alt={item.name}
								style={{ width: "214px", height: "164px", borderRadius: 8 }}
								onMouseEnter={(e) => handleMouseEnter(item, e)}
								onMouseLeave={handleMouseLeave}
							/>
							<Typography sx={{ marginTop: 1 }}>{item.name}</Typography>
							{Number(item.extra_cost) !== 0.0 && (
								<Typography>Extra Cost: ${item.extra_cost}</Typography>
							)}
						</Box>
					))}
			</Box>

			{/* Hovered Item Nutritional Box */}
			{hoveredItem && (
				<Paper
					elevation={3}
					sx={{
						position: "absolute",
						top: hoveredItem.top,
						left: hoveredItem.left,
						width: 200,
						padding: 2,
						backgroundColor: "white",
						border: "1px solid #ccc",
						borderRadius: 2,
						zIndex: 9999,
					}}
				>
					<Typography variant="h6" sx={{ marginBottom: 1 }}>
						{hoveredItem.item.name} Nutrition
					</Typography>
					{renderNutritionInfo(hoveredItem.item.name)}
				</Paper>
			)}
		</Box>
	);
}

export default RestaurantMenu;
