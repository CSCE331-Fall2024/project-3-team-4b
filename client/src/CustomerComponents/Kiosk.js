// Kiosk.js
import React, { useContext, useEffect } from "react";
import axios from "axios";
import {
	Box,
	CssBaseline,
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@mui/material";
import SelectionSteps from "../CustomerComponents/SelectionSteps";
import OrderSummary from "../CustomerComponents/OrderSummary";
import { KioskContext } from "../CustomerComponents/KioskContext";

function Kiosk({ isLargeText }) {
	const {
		menuData,
		setMenuData,
		containerData,
		setContainerData,
		appetizerPrice,
		setAppetizerPrice,
		drinkPrice,
		setDrinkPrice,
		appetizerContainerId,
		setAppetizerContainerId,
		drinkContainerId,
		setDrinkContainerId,
		snackbar,
		setSnackbar,
		confirmDialogOpen,
		setConfirmDialogOpen,
		showSnackbar,
		confirmRemoveOrder,
	} = useContext(KioskContext);

	useEffect(() => {
		fetchMenuData();
		fetchContainerData();
	}, []);

	const fetchMenuData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/menu"
			);

			setMenuData(response.data);
		} catch (error) {
			console.error("Error fetching menu data:", error);
			showSnackbar("Error fetching menu data.", "error");
		}
	};

	const fetchContainerData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/containers"
			);
			const allContainers = response.data;
			const comboContainers = allContainers.filter((container) =>
				["Bowl", "Plate", "Bigger Plate"].includes(container.name)
			);
			setContainerData(comboContainers);

			const appetizerContainer = allContainers.find(
				(container) => container.name === "Appetizer"
			);
			const drinkContainer = allContainers.find(
				(container) => container.name === "Drink"
			);

			setAppetizerContainerId(appetizerContainer?.container_id || null);
			setDrinkContainerId(drinkContainer?.container_id || null);

			setAppetizerPrice(Number(appetizerContainer?.price) || 0);
			setDrinkPrice(Number(drinkContainer?.price) || 0);
		} catch (error) {
			console.error("Error fetching container data:", error);
			showSnackbar("Error fetching container data.", "error");
		}
	};

	const handleSnackbarClose = () => {
		setSnackbar({ open: false, message: "", severity: "success" });
	};

	return (
		<Box
			sx={{
				display: "flex",
				height: "100%",
				width: "100%",
			}}
		>
			<CssBaseline />
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
			<Box sx={{ flex: 2, padding: 2, height: "100%", overflowY: "auto" }}>
				<SelectionSteps isLargeText={isLargeText} />
			</Box>
			<Box
				sx={{
					flex: 1,
					padding: 2,
					borderLeft: "1px solid #ccc",
					height: "100%",
					overflowY: "auto",
				}}
			>
				<OrderSummary isLargeText={isLargeText} />
			</Box>
			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-description"
			>
				<DialogTitle id="confirm-dialog-title">Confirm Removal</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirm-dialog-description">
						Are you sure you want to remove this item from your order?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDialogOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={confirmRemoveOrder} color="primary" autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default Kiosk;
