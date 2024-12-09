/**
 * @fileoverview A React component that fetches and displays a restaurant's menu and container items,
 * and shows nutrition facts via a hover effect. Also integrates Google Translate for language support.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Paper } from "@mui/material";

/**
 * An object mapping item names to their nutritional facts.
 * @type {Object.<string, {calories: number, fat: number, carbs: number, protein: number}>}
 */
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
	
	// Appetizers
	"Chicken Egg Roll": { calories: 200, fat: 9, carbs: 22, protein: 7 },
	"Veggie Spring Roll": { calories: 160, fat: 8, carbs: 19, protein: 2 },
	"Cream Cheese Rangoon": { calories: 190, fat: 11, carbs: 19, protein: 3 },
	"Apple Pie Roll": { calories: 220, fat: 10, carbs: 30, protein: 2 },
	
	// Drinks
	"Dr Pepper": { calories: 150, fat: 0, carbs: 40, protein: 0 },
	"Sweet Tea": { calories: 100, fat: 0, carbs: 25, protein: 0 },
	"Pepsi": { calories: 150, fat: 0, carbs: 41, protein: 0 },
	"Mountain Dew": { calories: 170, fat: 0, carbs: 46, protein: 0 },
	"Sierra Mist": { calories: 140, fat: 0, carbs: 37, protein: 0 },
	"Water": { calories: 0, fat: 0, carbs: 0, protein: 0 },
};


/**
 * Fetches data from the server endpoints and renders restaurant menu and container items.
 * Items can be hovered over to display their nutritional facts.
 *
 * @function RestaurantMenu
 * @returns {JSX.Element} The rendered RestaurantMenu component.
 */
function RestaurantMenu() {
	/**
	 * @type {[Array, Function]} menuData - State for storing the fetched menu data.
	 */
	const [menuData, setMenuData] = useState([]);

	/**
	 * @type {[Array, Function]} containerData - State for storing the fetched container data.
	 */
	const [containerData, setContainerData] = useState([]);

	/**
	 * @type {[Object|null, Function]} hoveredItem - State for the currently hovered item, including position for tooltip.
	 * Object shape: { item: Object, top: number, left: number } or null if none is hovered.
	 */
	const [hoveredItem, setHoveredItem] = useState(null);

	useEffect(() => {
		fetchMenuData();
		fetchContainerData();
		addGoogleTranslateScript();
	}, []);

	/**
	 * Fetches menu data from a remote API and updates the state.
	 * @async
	 * @function fetchMenuData
	 * @returns {Promise<void>} A promise that resolves when the data is fetched and state is updated.
	 */
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

	/**
	 * Fetches container data from a remote API and updates the state.
	 * Filters the containers to only include "Bowl", "Plate", and "Bigger Plate".
	 * @async
	 * @function fetchContainerData
	 * @returns {Promise<void>} A promise that resolves when the data is fetched and state is updated.
	 */
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

	/**
	 * Adds the Google Translate script to the document if it's not already present,
	 * and initializes the translation element on the page.
	 * @function addGoogleTranslateScript
	 * @returns {void}
	 */
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

	/**
	 * Removes the Google Translate script and resets the translate element if present.
	 * @function removeGoogleTranslateScript
	 * @returns {void}
	 */
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

	/**
	 * Generates an image URL based on the item's name. Converts name to a lowercase,
	 * underscore-separated string and returns the corresponding image path.
	 * @function getImageUrl
	 * @param {string} name - The name of the item.
	 * @returns {string} The formatted URL for the item's image.
	 */
	const getImageUrl = (name) => {
		const formattedName = name
			.toLowerCase()
			.replace(/\s+/g, "_")
			.replace(/[^a-z0-9_]/g, ""); // remove any special chars
		return `/images/${formattedName}.png`;
	};

	/**
	 * Handles mouse enter event on an item image. Calculates tooltip position and sets hovered item state.
	 * @function handleMouseEnter
	 * @param {Object} item - The menu or container item that the user hovered over.
	 * @param {React.MouseEvent} event - The mouse event.
	 * @returns {void}
	 */
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

	/**
	 * Handles mouse leave event to clear the hovered item state, removing the tooltip.
	 * @function handleMouseLeave
	 * @returns {void}
	 */
	const handleMouseLeave = () => {
		setHoveredItem(null);
	};

	/**
	 * Renders nutritional information for a given item name.
	 * @function renderNutritionInfo
	 * @param {string} name - The name of the item.
	 * @returns {JSX.Element} JSX elements containing nutrition data, or a message if not available.
	 */
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

			{/* Appetizers Section */}
			<Typography variant="h4" sx={{ marginBottom: 3 }}>
				Appetizers
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
					.filter((item) => item.type === "Appetizer")
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

			{/* Drinks Section */}
			<Typography variant="h4" sx={{ marginBottom: 3 }}>
				Drinks
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
					.filter((item) => item.type === "Drink")
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
