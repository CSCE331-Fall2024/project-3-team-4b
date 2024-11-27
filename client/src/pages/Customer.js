import React, { useState, useEffect } from "react";
import { Container, Box, AppBar, Toolbar, Button, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Kiosk from "../CustomerComponents/Kiosk";
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
	const [weatherDescription, setWeatherDescription] = useState("Fetching location...");

	const toggleTextSize = () => {
		setIsLargeText((prev) => !prev);
	};

	useEffect(() => {
		const fetchLocationAndWeather = async () => {
			try {
				// Step 1: Get user's location
				if (!navigator.geolocation) {
					setWeatherDescription("Geolocation not supported");
					return;
				}

				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;

						// Step 2: Reverse geocoding to get city and state
						const locationResponse = await fetch(
							`https://geocode.xyz/${latitude},${longitude}?geoit=json`
						);

						if (!locationResponse.ok) {
							throw new Error("Error fetching location details");
						}

						const locationData = await locationResponse.json();
						const city = locationData.city || "Unknown City";
						const state = locationData.state || "Unknown State";

						// Step 3: Fetch weather data using Weather.gov API
						const pointResponse = await fetch(
							`https://api.weather.gov/points/${latitude},${longitude}`
						);

						if (!pointResponse.ok) {
							throw new Error("Error fetching weather grid points");
						}

						const pointData = await pointResponse.json();
						const forecastUrl = pointData.properties.forecast;

						const forecastResponse = await fetch(forecastUrl);

						if (!forecastResponse.ok) {
							throw new Error("Error fetching weather data");
						}

						const forecastData = await forecastResponse.json();
						const period = forecastData.properties.periods[0];
						const temperature = period?.temperature || "N/A";
						const temperatureUnit = period?.temperatureUnit || "°F";
						const shortForecast = period?.shortForecast || "N/A";

						// Update weather description
						setWeatherDescription(
							`${temperature}${temperatureUnit} in ${city}, ${state} | ${shortForecast}`
						);
					},
					(error) => {
						console.error("Geolocation error:", error);
						setWeatherDescription("Unable to fetch location");
					}
				);
			} catch (error) {
				console.error("Error fetching weather data:", error);
				setWeatherDescription("Unable to fetch weather");
			}
		};

		fetchLocationAndWeather();
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
					<Box sx={{ display: "flex", alignItems: "center" }}>
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
			<Container
				maxWidth="xl"
				disableGutters
				sx={{ height: "calc(100vh - 64px)" }}
			>
				<Box sx={{ height: "100%" }}>
					<Kiosk isLargeText={isLargeText} />
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default Customer;
