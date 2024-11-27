import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, IconButton } from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

function OrderSummary({ orderItems, onClearOrder, onRemoveItem }) {
    // Calculate subtotal by summing up the price of all containers and other items
    const subtotal = orderItems.reduce((total, orderItem) => {
    let itemTotal = Number(orderItem.price) || 0;

    // Add the cost of each item within the container, including premium charges if applicable
    if (orderItem.items && orderItem.items.length > 0) {
        itemTotal += orderItem.items.reduce((containerTotal, item) => {
            return containerTotal + (Number(item.extra_cost) || 0);
        }, 0);
    }

    return total + itemTotal;
}, 0);

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const handlePlaceOrder = async () => {
        // Prepare the order payload to send to the backend
        const orderPayload = {
            time: new Date().toISOString(),  // Record the time of the order
            total: total.toFixed(2),
            employee_id: 4,  // fixed for now (Sage)
        };
    
        try {
            // Make the API call to create a new order in the "orders" table
            console.log("Placing order:", orderPayload); // Debug: log order payload before sending
            const orderResponse = await axios.post("https://project-3-team-4b-server.vercel.app/api/orders", orderPayload);
            console.log("Order response:", orderResponse.data); // Debug: log response from order creation
    
            const orderId = orderResponse.data.order_id; // Get the unique order_id
    
            // Prepare the order items payload
            const orderItemsPayload = orderItems.flatMap((orderItem) => {
                if (orderItem.type === "Container" || orderItem.type === "Appetizer" || orderItem.type === "Drink") {
                    // Map each container's items as separate order items
                    if (orderItem.items && orderItem.items.length > 0) {
                        return orderItem.items.map((item) => ({
                            order_id: orderId,
                            quantity: 1,  // Assuming quantity is always 1 for each item
                            container_id: orderItem.id,  // Use the dynamically fetched container ID
                        }));
                    } else {
                        // If the container has no nested items (e.g., drinks or appetizers), add it as an individual order item
                        return {
                            order_id: orderId,
                            quantity: 1,
                            container_id: orderItem.id,  // Use the dynamically fetched container ID
                        };
                    }
                } else {
                    return []; // Skip any items that are not classified correctly
                }
            });
    
            console.log("Order items payload:", orderItemsPayload); // Debug: log order items before sending
    
            // Make API calls to add items to the "order_items" table
            await Promise.all(
                orderItemsPayload.map(async (orderItem) => {
                    console.log("Placing order item:", orderItem); // Debug: log each order item payload before sending
                    const response = await axios.post("https://project-3-team-4b-server.vercel.app/api/order-items", orderItem);
                    console.log("Order item response:", response.data); // Debug: log response from order item creation
                })
            );
    
            // Alert success and clear the order
            alert(`Order placed successfully: Order ID ${orderId}`);
            onClearOrder();  // Clear the order after successfully placing it
        } catch (error) {
            console.error("Error placing order:", error.response?.data || error.message); // Improved error logging
            alert("Failed to place order. Please try again.");
        }
    };
    
    
    

    return (
        <Box sx={{ p: 2, borderLeft: "1px solid gray" }}>
            <Typography variant="h6">Order Summary</Typography>
            <List>
                {orderItems.map((orderItem, index) => {
                    if (orderItem.type === "Container") {
                        return (
                            <React.Fragment key={index}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => onRemoveItem(orderItem.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText 
                                        primary={orderItem.name} 
                                        secondary={`$${Number(orderItem.price).toFixed(2)}`} 
                                    />
                                </ListItem>
                                {orderItem.items.map((item, subIndex) => (
                                    <ListItem key={`${index}-${subIndex}`} sx={{ pl: 4 }}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => onRemoveItem(orderItem.id, item.name)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={`- ${item.name}`} />
                                    </ListItem>
                                ))}
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <ListItem key={index}>
                                <ListItemText 
                                    primary={`${orderItem.name}`} 
                                    secondary={orderItem.price > 0 ? `$${Number(orderItem.price).toFixed(2)}` : null} 
                                />
                                <IconButton edge="end" onClick={() => onRemoveItem(orderItem.id)}>
                                    <DeleteIcon />
                                </IconButton>
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
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#2B2A2A", color: "#FFFFFF", fontFamily: "proxima-nova" }} // Black color for Place Order button
                    onClick={handlePlaceOrder}
                    fullWidth
                >
                    Place Order
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onClearOrder}
                    fullWidth
                    sx={{ mt: 1, color: "#D1282E", borderColor: "#D1282E", fontFamily: "proxima-nova" }}
                >
                    Clear Order
                </Button>
            </Box>
        </Box>
    );
}

export default OrderSummary;




