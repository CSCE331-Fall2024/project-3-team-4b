import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
	Container,
	Box,
	AppBar,
	Toolbar,
	Button,
	Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Kiosk from "../CustomerComponents/Kiosk";
import { KioskProvider } from "../CustomerComponents/KioskContext";
import CssBaseline from "@mui/material/CssBaseline";

import Logo from "../assets/panda-logo.svg";

const theme = createTheme({
	palette: {
		primary: {
			main: "#D1282E", // Red
		},
		secondary: {
			main: "#2B2A2A", // Black
		},
		background: {
			default: "#FFFFFF", // White
		},
		text: {
			primary: "#2B2A2A", // Black
		},
	},
	typography: {
		fontFamily: "Proxima Nova, Arial, sans-serif",
		h4: {
			fontWeight: 700,
		},
		h5: {
			fontWeight: 700,
		},
		button: {
			textTransform: "none",
			fontWeight: 700,
		},
	},
});

const Customer = () => {
	const [isLargeText, setIsLargeText] = useState(false);
	const [weatherDescription, setWeatherDescription] = useState(
		"Fetching location..."
	);



	const toggleTextSize = () => {
		setIsLargeText((prev) => !prev);
	};
	useEffect(() => {
		const fetchLocationAndWeather = async () => {
			try {
				// Step 1: Fetch the user's current location using the HTML Geolocation API
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(async (position) => {
						const lat = position.coords.latitude;
						const lon = position.coords.longitude;
	
						// Step 2: Make a call to the OpenWeatherMap API using the user's location
						const apiKey = 'c8cd922e4110179020c01d43f93a7df6'; // Replace with your OpenWeatherMap API key
						const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; // Units are set to 'metric' for Celsius, use 'imperial' for Fahrenheit
	
						// Fetch weather data
						const weatherResponse = await axios.get(weatherUrl);
						const weatherData = weatherResponse.data;
	
						// Extract relevant data (temperature, weather description)
						const temperature = weatherData.main.temp || "N/A";
						const temperatureUnit = "°F"; // Since we set units to 'metric'
						const weatherDescription = weatherData.weather[0]?.description || "N/A";
	
						// Step 3: Update weather description
						setWeatherDescription(
							`${temperature}${temperatureUnit} | ${weatherDescription}`
						);
					}, (error) => {
						throw new Error("Error retrieving location: " + error.message);
					});
				} else {
					throw new Error("Geolocation is not supported by this browser.");
				}
			} catch (error) {
				console.error("Error fetching location or weather data:", error);
				setWeatherDescription("Unable to fetch location or weather data");
			}
		};
	
		fetchLocationAndWeather();
	}, []);

	const addGoogleTranslateScript = () => {
		if (!document.getElementById("google-translate-script")) {
			const script = document.createElement("script");
			script.id = "google-translate-script";
			script.type = "text/javascript";
			script.src =
				"//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
			script.async = true;
			document.body.appendChild(script);

			window.googleTranslateElementInit = () => {
				new window.google.translate.TranslateElement(
					{ pageLanguage: "en" },
					"google_translate_element"
				);
			};
		}
	};

	useEffect(() => {
		addGoogleTranslateScript();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar
				position="static"
				elevation={0}
				sx={{
					backgroundColor: "#D1282E",
					padding: "0 1rem",
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<img
							src={Logo}
							alt="Panda Express Logo"
							style={{ maxWidth: "100%", height: "60px" }}
						/>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
							<div id="google_translate_element"></div>
						</Box>
						<Typography
							variant="body1"
							sx={{ color: "#FFFFFF", marginRight: "1rem" }}
						>
							{weatherDescription}
						</Typography>

						<Button
							onClick={toggleTextSize}
							variant="contained"
							color="secondary"
						>
							{isLargeText ? "Normal Text" : "Large Text"}
						</Button>
					</Box>
				</Toolbar>
			</AppBar>
			{/* Google Translate Element */}

			<Container
				maxWidth="xl"
				disableGutters
				sx={{ height: "calc(100vh - 64px)" }}
			>
				<Box sx={{ height: "100%" }}>
					<KioskProvider>
						<Kiosk isLargeText={isLargeText} />
					</KioskProvider>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default Customer;
