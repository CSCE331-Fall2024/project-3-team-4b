import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";

function OrderSummary({ orderItems, onClearOrder, onPlaceOrder }) {
    // Calculate subtotal by summing up the price of all containers
    const subtotal = orderItems
        .filter(item => item.type === "Container")
        .reduce((total, container) => total + container.price, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <Box sx={{ p: 2, borderLeft: "1px solid gray" }}>
            <Typography variant="h6">Order Summary</Typography>
            <List>
                {orderItems.map((container, index) => (
                    container.type === "Container" && (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemText 
                                    primary={container.name} 
                                    secondary={`$${container.price.toFixed(2)}`} 
                                />
                            </ListItem>
                            {container.items && container.items.length > 0 && container.items.map((item, subIndex) => (
                                <ListItem key={`${index}-${subIndex}`} sx={{ pl: 4 }}>
                                    <ListItemText 
                                        primary={`- ${item.name}`} 
                                    />
                                </ListItem>
                            ))}
                        </React.Fragment>
                    )
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
