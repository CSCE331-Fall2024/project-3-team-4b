import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

function RestaurantMenu() {
    const [menuData, setMenuData] = useState([]);
    const [containerData, setContainerData] = useState([]);
    const [mainOrderSummary, setMainOrderSummary] = useState([]); // Main order summary
    const [subOrderSummary, setSubOrderSummary] = useState({
        container: null,
        items: [],
        subtotal: 0,
    });
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectedCounts, setSelectedCounts] = useState({
        entrees: 0,
        sides: 0,
        appetizers: 0,
        drinks: 0,
    });

    useEffect(() => {
        fetchMenuData();
        fetchContainerData();
    }, []);

    const fetchMenuData = async () => {
        try {
            const response = await axios.get("https://project-3-team-4b-server.vercel.app/api/menu");
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const fetchContainerData = async () => {
        try {
            const response = await axios.get("https://project-3-team-4b-server.vercel.app/api/containers");
            const filteredContainers = response.data.filter(container =>
                ["Bowl", "Plate", "Bigger Plate"].includes(container.name)
            );
            setContainerData(filteredContainers);
        } catch (error) {
            console.error("Error fetching container data:", error);
        }
    };

    const handleSelectContainer = (container) => {
        setSubOrderSummary({
            container,
            items: [],
            subtotal: Number(container.price) || 0, // Ensure it's a valid number
        });
        setSelectedCounts({
            entrees: 0,
            sides: 0,
            appetizers: 0,
            drinks: 0,
        });
        setSelectedItems(new Set());
    };

    const handleAddItem = (item) => {
        const { container, items } = subOrderSummary;
        if (!container) {
            alert("Please select a container before adding items.");
            return;
        }

        const itemIsSelected = selectedItems.has(item.menu_id);
        const canSelect =
            (item.type === "Entree" && selectedCounts.entrees < container.number_of_entrees) ||
            (item.type === "Side" && selectedCounts.sides < container.number_of_sides) ||
            (item.type === "Appetizer" && selectedCounts.appetizers < 10) ||
            (item.type === "Drink" && selectedCounts.drinks < 10);

        if (!itemIsSelected && canSelect) {
            // Update selections, counts, and subtotal for each item
            setSubOrderSummary((prev) => ({
                ...prev,
                items: [...prev.items, item],
                subtotal: prev.subtotal + Number(item.extra_cost),
            }));
            setSelectedItems((prev) => new Set(prev).add(item.menu_id));
            setSelectedCounts((prevCounts) => ({
                ...prevCounts,
                [item.type.toLowerCase() + "s"]: prevCounts[item.type.toLowerCase() + "s"] + 1,
            }));
        } else if (itemIsSelected) {
            handleRemoveItem(item);
        }
    };

    const handleRemoveItem = (item) => {
        setSubOrderSummary((prev) => ({
            ...prev,
            items: prev.items.filter((orderItem) => orderItem.menu_id !== item.menu_id),
            subtotal: prev.subtotal - Number(item.extra_cost),
        }));
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            newSelected.delete(item.menu_id);
            return newSelected;
        });
        setSelectedCounts((prevCounts) => ({
            ...prevCounts,
            [item.type.toLowerCase() + "s"]: prevCounts[item.type.toLowerCase() + "s"] - 1,
        }));
    };

    const handleAddToOrder = () => {
        if (!subOrderSummary.container || subOrderSummary.items.length === 0) {
            alert("Please select a container and items before adding to order.");
            return;
        }

        // Add sub-order to the main order summary
        setMainOrderSummary((prev) => [
            ...prev,
            { ...subOrderSummary, items: [...subOrderSummary.items] }, // Make a copy of items to avoid mutation
        ]);

        // Clear the sub-order summary
        setSubOrderSummary({
            container: null,
            items: [],
            subtotal: 0,
        });

        // Reset selections for the next order
        setSelectedCounts({
            entrees: 0,
            sides: 0,
            appetizers: 0,
            drinks: 0,
        });
        setSelectedItems(new Set());
    };

    const handlePlaceOrder = async () => {
        if (mainOrderSummary.length === 0) {
            alert("No items in the order to place.");
            return;
        }

        const orderPayload = {
            time: new Date().toISOString(),
            total: mainOrderSummary.reduce((total, order) => total + order.subtotal, 0),
            employee_id: 99,
        };

        try {
            const orderResponse = await axios.post("https://project-3-team-4b-server.vercel.app/api/orders", orderPayload);
            const orderId = orderResponse.data.order_id;

            const orderItemsPayload = mainOrderSummary.flatMap((selection) =>
                selection.items.map((item) => ({
                    order_id: orderId,
                    quantity: 1,
                    container_id: selection.container.container_id,
                }))
            );

            await Promise.all(
                orderItemsPayload.map((orderItem) =>
                    axios.post("https://project-3-team-4b-server.vercel.app/api/order-items", orderItem)
                )
            );

            alert(`Order placed successfully: Order ID ${orderId}`);
            setMainOrderSummary([]);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    const handleClearContainer = () => {
        setSubOrderSummary({
            container: null,
            items: [],
            subtotal: 0,
        });
        setSelectedItems(new Set());
        setSelectedCounts({
            entrees: 0,
            sides: 0,
            appetizers: 0,
            drinks: 0,
        });
    };

    const getImageUrl = (name) => {
        const formattedName = name.toLowerCase().replace(/\s+/g, "_");
        return `/images/${formattedName}.png`;
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Left Section - Menu Selection */}
            <Box sx={{ flex: 2, padding: 2 }}>
                <Typography variant="h4">Select a Container</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 2 }}>
                    {containerData.map((container) => (
                        <Button
                            key={container.container_id}
                            onClick={() => handleSelectContainer(container)}
                            sx={{
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center", // Ensure content is centered vertically
                                border: subOrderSummary.container?.container_id === container.container_id ? "2px solid blue" : "none",
                            }}
                        >
                            <img
                                src={getImageUrl(container.name)}
                                alt={container.name}
                                style={{ width: "214px", height: "164px", borderRadius: 8 }}
                            />
                            <Typography sx={{ marginTop: 1 }}>{container.name}</Typography>
                            {/* Conditionally render price */}
                            {container.price !== 0 && <Typography>Price: ${container.price}</Typography>}
                        </Button>
                    ))}
                </Box>

                <Box>
                    {["Entree", "Side", "Appetizer", "Drink"].map((type) => (
                        <Box key={type} sx={{ marginBottom: 2 }}>
                            <Typography variant="h5">{type}s</Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                                {menuData
                                    .filter((item) => item.type === type)
                                    .map((item) => (
                                        <Box
                                            key={item.menu_id}
                                            sx={{
                                                border: selectedItems.has(item.menu_id) ? "2px solid blue" : "none",
                                            }}
                                        >
                                            <Button onClick={() => handleAddItem(item)}>
                                                {item.name}
                                                {/* Conditionally render price */}
                                                {Number(item.extra_cost) !== 0.00 && ` - $${item.extra_cost}`}
                                                <img src={getImageUrl(item.name)} alt={item.name} style={{ width: "214px", height: "164px", borderRadius: 8 }} />
                                            </Button>
                                        </Box>
                                    ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Right Section - Order Summary */}
            <Box sx={{ flex: 1, padding: 2, borderLeft: "1px solid #ccc" }}>
                {/* Sub-order summary */}
                <Typography variant="h5">Sub-Order Summary</Typography>
                <Box>
                    {subOrderSummary.container && (
                        <Box>
                            <Typography>{subOrderSummary.container.name}</Typography>
                            {/* Conditionally render price */}
                            {subOrderSummary.container.price !== 0 && (
                                <Typography>Price: ${subOrderSummary.container.price}</Typography>
                            )}
                        </Box>
                    )}

                    {subOrderSummary.items.map((item) => (
                        <Box key={item.menu_id} sx={{ marginBottom: 1 }}>
                            <Typography>{item.name}</Typography>
                            {/* Conditionally render price */}
                            {item.extra_cost !== 0 && <Typography>Price: ${item.extra_cost}</Typography>}
                            <Button onClick={() => handleRemoveItem(item)}>Remove</Button>
                        </Box>
                    ))}
                </Box>

                <Typography variant="h6">Subtotal: ${subOrderSummary.subtotal.toFixed(2)}</Typography>
                <Button
                    onClick={handleAddToOrder}
                    variant="contained"
                    color="primary"
                    disabled={!subOrderSummary.container || subOrderSummary.items.length === 0}
                >
                    Add to Order
                </Button>

                {/* Main Order Summary */}
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h5">Main Order Summary</Typography>
                    {mainOrderSummary.map((order, index) => (
                        <Box key={index}>
                            <Typography>{order.container.name}</Typography>
                            {order.items.map((item) => (
                                <Typography key={item.menu_id}>{item.name}</Typography>
                            ))}
                            <Typography>Subtotal: ${order.subtotal.toFixed(2)}</Typography>
                        </Box>
                    ))}
                    {mainOrderSummary.length > 0 && (
                        <Button onClick={handlePlaceOrder} variant="contained" color="secondary" sx={{ marginTop: 2 }}>
                            Place Order
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default RestaurantMenu;
