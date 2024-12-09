import React, { useState, useEffect } from "react";
import {
	Container,
	Box,
	AppBar,
	Toolbar,
	Button,
	Typography,
	CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles"; // Import from here
import Kiosk from "../CustomerComponents/Kiosk";
import { KioskProvider } from "../CustomerComponents/KioskContext";
import Logo from "../assets/panda-logo.svg";

const theme = createTheme({
	palette: {
		primary: {
			main: "#D1282E",
		},
		secondary: {
			main: "#2B2A2A",
		},
		background: {
			default: "#FFFFFF",
		},
		text: {
			primary: "#2B2A2A",
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

function Customer() {
	const [isLargeText, setIsLargeText] = useState(false);
	const [weatherDescription, setWeatherDescription] = useState(
		"Fetching location..."
	);

	const toggleTextSize = () => {
		setIsLargeText((prev) => !prev);
	};

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

	useEffect(() => {
		const fetchLocationAndWeather = async () => {
			try {
				const locationResponse = await fetch("https://ipapi.co/json/");
				if (!locationResponse.ok) {
					throw new Error("Error fetching location data");
				}
				const locationData = await locationResponse.json();

				const {
					city,
					region_code: region,
					latitude: lat,
					longitude: lon,
				} = locationData;

				const pointsResponse = await fetch(
					`https://api.weather.gov/points/${lat},${lon}`
				);
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
				console.error("Error fetching geolocation data:", error);
				setWeatherDescription("Unable to fetch location data");
			}
		};

		fetchLocationAndWeather();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles
				styles={{
					"#google_translate_element .skiptranslate *": {
						color: "#000000 !important",
						background: "#FFFFFF !important",
					},
					"#google_translate_element .skiptranslate a.VIpgJd-ZVi9od-l4eHX-hSRGPd":
						{
							color: "#000000 !important",
						},
				}}
			/>
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
}

export default Customer;
