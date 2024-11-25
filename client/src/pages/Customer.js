// Customer.js
import React from "react";
import { Container, Box, AppBar, Toolbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Kiosk from "../CustomerComponents/Kiosk";
import CssBaseline from "@mui/material/CssBaseline";
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
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Container maxWidth="xl" disableGutters>
				{/* AppBar with Panda Express Logo */}
				<AppBar
					position="static"
					elevation={0}
					sx={{
						backgroundColor: "#FFFFFF",
						padding: "1rem 0",
					}}
				>
					<Toolbar sx={{ justifyContent: "center" }}>
						<img
							src="/images/panda_express_logo.png"
							alt="Panda Express Logo"
							style={{ height: 60 }}
						/>
					</Toolbar>
				</AppBar>

				{/* Main content */}
				<Box>
					<Kiosk />
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default Customer;
