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
import SelectionSteps from "./SelectionSteps";
import OrderSummary from "./OrderSummary";
import { KioskContext } from "./KioskContext";
import AlanAIHandler from "./AlanAIHandler";

function Kiosk({ isLargeText }) {
	const {
		menuData,
		containerData,
		setMenuData,
		setContainerData,
		setAppetizerPrice,
		setDrinkPrice,
		setAppetizerContainerId,
		setDrinkContainerId,
		snackbar,
		setSnackbar,
		confirmDialogOpen,
		setConfirmDialogOpen,
		showSnackbar,
		confirmRemoveOrder,
		appetizerPrice,
	} = useContext(KioskContext);

	// useEffect(() => {
	// 	fetchMenuData();
	// 	fetchContainerData();
	// }, []);

	useEffect(() => {
		const fetchData = async () => {
			await fetchContainerData();
			await fetchMenuData();
		};
		fetchData();
	}, []);

	const fetchMenuData = async () => {
		try {
			const response = await axios.get(
				"https://project-3-team-4b-server.vercel.app/api/menu"
			);
			let data = response.data;

			data = data.map((item) => {
				if (item.type === "Appetizer") {
					return {
						...item,
						price: appetizerPrice,
					};
				}
				return item;
			});

			setMenuData(data);
			console.log("Menu data after adding appetizer prices:", data);
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
			<AlanAIHandler />
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
