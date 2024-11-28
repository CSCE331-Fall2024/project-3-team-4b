import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
    Container,
    Box,
    AppBar,
    Toolbar,
    Button,
    Typography,
    GlobalStyles,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Kiosk from "../CustomerComponents/Kiosk";
import { KioskProvider } from "../CustomerComponents/KioskContext";
import CssBaseline from "@mui/material/CssBaseline";
import TextIncreaseIcon from '@mui/icons-material/Add';
import TextDecreaseIcon from '@mui/icons-material/Remove';

import Logo from "../assets/panda-logo.svg";

const createCustomTheme = () => createTheme({
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
        // No need to adjust font sizes here
    },
});

const Customer = () => {
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
    const [weatherDescription, setWeatherDescription] = useState(
        "Fetching location..."
    );

    const handleIncreaseFontSize = () => {
        setFontSizeMultiplier((prev) => Math.min(prev + 0.1, 1.5)); // Max multiplier 1.5
    };

    const handleDecreaseFontSize = () => {
        setFontSizeMultiplier((prev) => Math.max(prev - 0.1, 0.8)); // Min multiplier 0.8
    };

    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;

                        const apiKey = 'your_openweathermap_api_key'; // Replace with your OpenWeatherMap API key
                        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

                        const weatherResponse = await axios.get(weatherUrl);
                        const weatherData = weatherResponse.data;

                        const temperature = weatherData.main.temp || "N/A";
                        const temperatureUnit = "°F";
                        const weatherDescription = weatherData.weather[0]?.description || "N/A";

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

    const theme = React.useMemo(() => createCustomTheme(), []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Adjust the root font size based on the fontSizeMultiplier */}
            <GlobalStyles
                styles={{
                    html: {
                        fontSize: `${16 * fontSizeMultiplier}px`, // Base font size is 16px
                    },
                }}
            />
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
                            onClick={handleDecreaseFontSize}
                            variant="contained"
                            color="secondary"
                            aria-label="Decrease font size"
                        >
                            <TextDecreaseIcon />
                        </Button>
                        <Button
                            onClick={handleIncreaseFontSize}
                            variant="contained"
                            color="secondary"
                            aria-label="Increase font size"
                        >
                            <TextIncreaseIcon />
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
                        <Kiosk />
                    </KioskProvider>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Customer;
