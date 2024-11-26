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

	useEffect(() => {
		addGoogleTranslateScript();
	}, []);

	const toggleTextSize = () => {
		setIsLargeText((prev) => !prev);
	};

	const addGoogleTranslateScript = () => {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
		script.async = true;
		document.body.appendChild(script);

		window.googleTranslateElementInit = () => {
			new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
		};
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
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
				<div id="google_translate_element"></div>
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
