import React, { useContext } from "react";
import { KioskContext } from "./KioskContext";
import { Box, Typography, IconButton, Button, Divider } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function OrderSummary({ isLargeText }) {
	const { mainOrderSummary, handleRemoveOrder, handlePlaceOrder } =
		useContext(KioskContext);

	return (
		<>
			<Typography
				variant="h5"
				sx={{
					fontSize: isLargeText ? "1.75rem" : "1.25rem",
					fontWeight: "bold",
					marginBottom: 2,
				}}
			>
				Your Order
			</Typography>
			{mainOrderSummary.length === 0 ? (
				<Typography
					sx={{
						fontSize: isLargeText ? "1.25rem" : "0.875rem",
						fontWeight: "normal",
					}}
				>
					No items added.
				</Typography>
			) : (
				<Box sx={{ maxWidth: "100%" }}>
					{mainOrderSummary.map((order, index) => (
						<Box
							key={index}
							sx={{
								marginBottom: 2,
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyItems: "left",
									justifyContent: "space-between",
								}}
							>
								<Typography
									variant="h6"
									sx={{
										fontSize: isLargeText ? "1.5rem" : "1rem",
										fontWeight: "bold",
									}}
								>
									{order.type === "Combo" ? order.combo.name : order.item.name}
								</Typography>
								<IconButton
									edge="end"
									color="error"
									onClick={() => handleRemoveOrder(index)}
								>
									<RemoveCircleOutlineIcon />
								</IconButton>
							</Box>
							{order.type === "Combo" && (
								<Box
									sx={{
										alignSelf: "left",
										alignContent: "left",
										justifyContent: "left",
										justifyItems: "left",
									}}
								>
									<Typography
										sx={{
											fontSize: isLargeText ? "1.25rem" : "0.875rem",
											fontWeight: "normal",
										}}
									>
										Side: {order.side.name}
									</Typography>
									{order.entrees.map(({ entree, quantity }, idx) => (
										<Typography
											key={idx}
											sx={{
												fontSize: isLargeText ? "1.25rem" : "0.875rem",
												fontWeight: "normal",
											}}
										>
											Entree: {entree.name} x {quantity}
										</Typography>
									))}
								</Box>
							)}
							{(order.type === "Appetizer" || order.type === "Drink") && (
								<Typography
									sx={{
										fontSize: isLargeText ? "1.25rem" : "0.875rem",
										fontWeight: "normal",
										justifySelf: "left",
									}}
								>
									Qty: {order.quantity}
								</Typography>
							)}
							<Typography
								sx={{
									fontSize: isLargeText ? "1.25rem" : "0.875rem",
									fontWeight: "bold",
									justifySelf: "left",
									marginTop: 1.5,
								}}
							>
								Subtotal: ${order.subtotal.toFixed(2)}
							</Typography>
							<Divider sx={{ marginTop: 1, marginBottom: 1 }} />
						</Box>
					))}
					<Typography
						variant="h6"
						sx={{
							fontSize: isLargeText ? "1.5rem" : "1rem",
							fontWeight: "bold",
							marginTop: 2,
						}}
					>
						Total: $
						{mainOrderSummary
							.reduce((total, order) => total + order.subtotal, 0)
							.toFixed(2)}
					</Typography>
				</Box>
			)}
			{mainOrderSummary.length > 0 && (
				<Button
					onClick={handlePlaceOrder}
					variant="contained"
					color="secondary"
					fullWidth
					sx={{
						marginTop: 2,
						fontSize: isLargeText ? "1.25rem" : "1rem",
						padding: isLargeText ? "12px" : "8px",
					}}
				>
					Place Order
				</Button>
			)}
		</>
	);
}

export default OrderSummary;
