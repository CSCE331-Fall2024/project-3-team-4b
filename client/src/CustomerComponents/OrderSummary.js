import React from "react";
import { Box, Typography, IconButton, Button, Divider } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

/**
 * Component to display the order summary (cart) with receipt-like formatting.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.mainOrderSummary - Array of order items.
 * @param {Function} props.handleEditOrder - Function to handle editing an order item.
 * @param {Function} props.handleRemoveOrder - Function to handle removing an order item.
 * @param {Function} props.handlePlaceOrder - Function to handle placing the order.
 * @param {boolean} props.isLargeText - Flag to determine if large text is enabled.
 * @returns {JSX.Element} OrderSummary component.
 */
function OrderSummary({
	mainOrderSummary,
	handleEditOrder,
	handleRemoveOrder,
	handlePlaceOrder,
	isLargeText,
}) {
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
						<Box key={index} sx={{ marginBottom: 2 }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
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
								<Box>
									{order.type === "Combo" && (
										<IconButton
											edge="end"
											color="primary"
											onClick={() => handleEditOrder(index)}
										>
											<EditIcon />
										</IconButton>
									)}
									<IconButton
										edge="end"
										color="error"
										onClick={() => handleRemoveOrder(index)}
									>
										<RemoveCircleOutlineIcon />
									</IconButton>
								</Box>
							</Box>
							{order.type === "Combo" && (
								<Box sx={{ marginLeft: 2 }}>
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
							{order.type === "Appetizer" && (
								<Typography
									sx={{
										fontSize: isLargeText ? "1.25rem" : "0.875rem",
										fontWeight: "normal",
										marginLeft: 2,
									}}
								>
									Quantity: {order.quantity}
								</Typography>
							)}
							{order.type === "Drink" && (
								<Typography
									sx={{
										fontSize: isLargeText ? "1.25rem" : "0.875rem",
										fontWeight: "normal",
										marginLeft: 2,
									}}
								>
									Quantity: {order.quantity}
								</Typography>
							)}
							<Typography
								sx={{
									fontSize: isLargeText ? "1.25rem" : "0.875rem",
									fontWeight: "normal",
								}}
							>
								Subtotal: ${order.subtotal.toFixed(2)}
							</Typography>
							<Divider sx={{ marginTop: 1, marginBottom: 1 }} />
						</Box>
					))}
					{/* Total */}
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
