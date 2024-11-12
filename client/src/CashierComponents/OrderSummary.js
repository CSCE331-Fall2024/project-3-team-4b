import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";

function OrderSummary({ orderItems, onClearOrder, onPlaceOrder }) {
    // Calculate subtotal by summing up the price of all containers and other items
    const subtotal = orderItems.reduce((total, item) => total + (Number(item.price) || 0), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <Box sx={{ p: 2, borderLeft: "1px solid gray" }}>
            <Typography variant="h6">Order Summary</Typography>
            <List>
                {/* Render Containers with Their Items */}
                {orderItems.map((orderItem, index) => {
                    if (orderItem.type === "Container") {
                        return (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText 
                                        primary={orderItem.name} 
                                        secondary={`$${Number(orderItem.price).toFixed(2)}`} 
                                    />
                                </ListItem>
                                {orderItem.items.map((item, subIndex) => (
                                    <ListItem key={`${index}-${subIndex}`} sx={{ pl: 4 }}>
                                        <ListItemText 
                                            primary={`- ${item.name}`} 
                                        />
                                    </ListItem>
                                ))}
                            </React.Fragment>
                        );
                    } else {
                        // Render Appetizers and Drinks separately
                        return (
                            <ListItem key={index}>
                                <ListItemText 
                                    primary={`${orderItem.name}`} 
                                    secondary={orderItem.price > 0 ? `$${Number(orderItem.price).toFixed(2)}` : null} 
                                />
                            </ListItem>
                        );
                    }
                })}
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

