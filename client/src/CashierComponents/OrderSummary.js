// CashierComponents/OrderSummary.js
import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";

function OrderSummary({ orderItems, onClearOrder, onPlaceOrder }) {
    const subtotal = orderItems.reduce((total, item) => total + item.price, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <Box sx={{ p: 2, borderLeft: "1px solid gray" }}>
            <Typography variant="h6">Order Summary</Typography>
            <List>
                {orderItems.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText 
                            primary={item.name} 
                            secondary={`$${item.price.toFixed(2)}${item.isPremium ? " (Premium)" : ""}`} 
                        />
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">Subtotal: ${subtotal.toFixed(2)}</Typography>
            <Typography variant="body1">Tax: ${tax.toFixed(2)}</Typography>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={onPlaceOrder} fullWidth>
                    Place Order
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClearOrder} fullWidth sx={{ mt: 1 }}>
                    Clear Order
                </Button>
            </Box>
        </Box>
    );
}

export default OrderSummary;
