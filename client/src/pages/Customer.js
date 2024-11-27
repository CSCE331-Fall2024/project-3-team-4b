import React, { useState, useEffect } from "react";
import { Container, Box, AppBar, Toolbar, Button, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Kiosk from "../CustomerComponents/Kiosk";
import CssBaseline from "@mui/material/CssBaseline";
import Logo from "../assets/panda-logo.svg";

const theme = createTheme({
  palette: {
    primary: { main: "#D1282E" }, // Red
    secondary: { main: "#2B2A2A" }, // Black
    background: { default: "#FFFFFF" }, // White
    text: { primary: "#2B2A2A" }, // Black
  },
  typography: {
    fontFamily: "Proxima Nova, Arial, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
});

const Customer = () => {
  const [isLargeText, setIsLargeText] = useState(false);
  const [weatherDescription, setWeatherDescription] = useState("Fetching location...");

  useEffect(() => {
    addGoogleTranslateScript();
    return () => {
      // Clean up on component unmount
      removeGoogleTranslateScript();
    };
  }, []);

  const toggleTextSize = () => {
    setIsLargeText((prev) => !prev);
  };

  const addGoogleTranslateScript = () => {
	if (document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
	  console.warn("Google Translate script already loaded");
	  return;
	}

	removeGoogleTranslateScript();

	const script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
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
	// Remove existing Google Translate script
	const existingScript = document.querySelector(
	  'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
	);
	if (existingScript) {
	  existingScript.remove();
	}

	// Remove the Google Translate element container
	const translateElement = document.getElementById("google_translate_element");
	if (translateElement) {
	  translateElement.innerHTML = ""; // Clear content to avoid duplication
	}
  };

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

      {/* Google Translate Element */}
      <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
        <div id="google_translate_element" style={{ marginBottom: '20px' }}></div>
      </Box>

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
