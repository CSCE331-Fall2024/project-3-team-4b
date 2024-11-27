import React, { useState, useEffect } from "react";
import { Container, Box, AppBar, Toolbar, Button } from "@mui/material";
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
	const [weatherDescription, setWeatherDescription] = useState("Fetching weather...");

	const toggleTextSize = () => {
		setIsLargeText((prev) => !prev);
	};

	useEffect(() => {
		const fetchLocationAndWeather = async () => {
			try {
				
				const locationResponse = await fetch("http://ip-api.com/json/");
				if (!locationResponse.ok) {
					throw new Error("Error fetching location data");
				}
				const locationData = await locationResponse.json();

				const { city, region, lat, lon } = locationData;

				
				const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
				if (!pointsResponse.ok) {
					throw new Error("Error fetching weather grid points");
				}
				const pointsData = await pointsResponse.json();
				const forecastUrl = pointsData.properties.forecast;

				const forecastResponse = await fetch(forecastUrl);
				if (!forecastResponse.ok) {
					throw new Error("Error fetching weather forecast");
				}
				const forecastData = await forecastResponse.json();

				const period = forecastData.properties.periods[0];
				const temperature = period?.temperature || "N/A";
				const temperatureUnit = period?.temperatureUnit || "°F";
				const shortForecast = period?.shortForecast || "N/A";

				
				setWeatherDescription(
					`${temperature}${temperatureUnit} in ${city}, ${region} | ${shortForecast}`
				);
			} catch (error) {
				console.error("Error fetching weather or location data:", error);
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
					<Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
						<div>{weatherDescription}</div>
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
