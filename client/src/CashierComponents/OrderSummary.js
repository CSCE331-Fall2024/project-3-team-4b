import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";

function OrderSummary({ orderItems, onClearOrder, onPlaceOrder }) {
    const subtotal = orderItems.reduce((total, item) => total + (item.type === "Container" ? item.price : 0), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;



    // Group sides and entrees under their respective containers
    const groupedItems = orderItems.reduce((acc, item) => {
        if (item.type === "Container") {
            acc.push({ container: item, items: [] });
        } else if (item.type === "Side" || item.type === "Entree") {
            const lastContainer = acc[acc.length - 1];
            if (lastContainer) {
                lastContainer.items.push(item);
            }
        }
        return acc;
    }, []);

    return (
        <Box sx={{ p: 2, borderLeft: "1px solid gray" }}>
            <Typography variant="h6">Order Summary</Typography>
            <List>
                {groupedItems.map((group, index) => (
                    <React.Fragment key={index}>
                        <ListItem>
                            <ListItemText 
                                primary={group.container.name} 
                                secondary={`$${group.container.price.toFixed(2)}`} 
                            />
                        </ListItem>
                        {group.items.map((item, subIndex) => (
                            <ListItem key={`${index}-${subIndex}`} sx={{ pl: 4 }}>
                                <ListItemText 
                                    primary={`- ${item.name}`} 
                                />
                            </ListItem>
                        ))}
                    </React.Fragment>
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
