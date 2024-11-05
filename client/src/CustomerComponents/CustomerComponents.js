import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

function RestaurantMenu() {
    const [menuData, setMenuData] = useState([]);
    const [containerData, setContainerData] = useState([]);
    const [order, setOrder] = useState([]);
    const [total, setTotal] = useState(0.0);
    const [selectedContainer, setSelectedContainer] = useState(null);
    const [selectedCounts, setSelectedCounts] = useState({ entrees: 0, sides: 0 });
    const [selectedItems, setSelectedItems] = useState(new Set()); 

    useEffect(() => {
        fetchMenuData();
        fetchContainerData();
    }, []);

    const getImageUrl = (name) => {
        const formattedName = name.toLowerCase().replace(/\s+/g, "_");
        return `/images/${formattedName}.png`;
    };

    const fetchMenuData = async () => {
        try {
            const response = await axios.get("/api/menu");
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const fetchContainerData = async () => {
        try {
            const response = await axios.get("/api/containers");
            const filteredContainers = response.data.body.filter(container =>
                ["Bowl", "Plate", "Bigger Plate"].includes(container.name)
            );
            setContainerData(filteredContainers);
        } catch (error) {
            console.error("Error fetching container data:", error);
        }
    };

    const handleAddItem = (item) => {
        if (!selectedContainer) {
            alert("Please select a container before adding items.");
            return;
        }

        const itemIsSelected = selectedItems.has(item.menu_id);
        const canSelect = (item.type === "Entree" && selectedCounts.entrees < selectedContainer.number_of_entrees) ||
                          (item.type === "Side" && selectedCounts.sides < selectedContainer.number_of_sides);

        if (!itemIsSelected && canSelect) {
            
            setOrder([...order, item]);
            setTotal((prevTotal) => prevTotal + Number(item.extra_cost));
            setSelectedItems((prev) => new Set(prev).add(item.menu_id)); 

            
            if (item.type === "Entree") {
                setSelectedCounts((prevCounts) => ({
                    ...prevCounts,
                    entrees: prevCounts.entrees + 1,
                }));
            } else if (item.type === "Side") {
                setSelectedCounts((prevCounts) => ({
                    ...prevCounts,
                    sides: prevCounts.sides + 1,
                }));
            }
        } else if (itemIsSelected) {
           
            handleRemoveItem(item);
        }
    };

    const handleRemoveItem = (item) => {
        const updatedOrder = order.filter(orderItem => orderItem.menu_id !== item.menu_id);
        setOrder(updatedOrder);
        setTotal((prevTotal) => prevTotal - Number(item.extra_cost));
        
       
        if (item.type === "Entree") {
            setSelectedCounts((prevCounts) => ({
                ...prevCounts,
                entrees: prevCounts.entrees - 1,
            }));
        } else if (item.type === "Side") {
            setSelectedCounts((prevCounts) => ({
                ...prevCounts,
                sides: prevCounts.sides - 1,
            }));
        }

       
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            newSelected.delete(item.menu_id);
            return newSelected;
        });
    };

    const handleSelectContainer = (container) => {
        setSelectedContainer(container);
        setSelectedCounts({ entrees: 0, sides: 0 });
        setTotal(Number(container.price));
        setOrder([]); 
        setSelectedItems(new Set()); 
    };

    const handlePlaceOrder = async () => {
        if (order.length === 0 || !selectedContainer) {
            alert("Please add items to your order and select a container.");
            return;
        }

        const orderPayload = {
            time: new Date().toISOString(),
            total: total,
            employee_id: 1,
        };

        try {
            const orderResponse = await axios.post("/api/orders", orderPayload);
            const orderId = orderResponse.data.order_id;

            const orderItemsPayload = order.map((item) => ({
                order_id: orderId,
                quantity: 1,
                container_id: selectedContainer.container_id,
            }));

            await Promise.all(
                orderItemsPayload.map((orderItem) =>
                    axios.post("/api/order_items", orderItem)
                )
            );

            alert(`Order placed successfully: Order ID ${orderId}`);
            setOrder([]);
            setTotal(0.0);
            setSelectedContainer(null);
            setSelectedCounts({ entrees: 0, sides: 0 });
            setSelectedItems(new Set()); 
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Typography variant="h4">Restaurant Menu</Typography>
            <Box sx={{ flex: 2, padding: 2 }}>
                <Typography variant="h4">Select a Container</Typography>
                <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                    {containerData.map((container) => (
                        <Button
                        key={container.container_id}
                        onClick={() => handleSelectContainer(container)}
                        sx={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
                    >
                        <img
                            src={getImageUrl(container.name)}
                            alt={container.name}
                            style={{ width: 214, height: 164, borderRadius: 8, border: selectedContainer?.container_id === container.container_id ? '2px solid blue' : 'none' }}
                        />
                        <Typography sx={{ marginTop: 1 }}>{container.name}</Typography> {}
                    </Button>
                    
                        
                    ))}
                </Box>

                {/* Menu Sections */}
                {["Entree", "Side", "Appetizer", "Drink"].map((type) => (
                    <Box key={type} sx={{ marginBottom: 2 }}>
                        <Typography variant="h4">{type}s</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {menuData
                                .filter((item) => item.type === type)
                                .map((item) => (
                                    <Box
                                        key={item.menu_id}
                                        sx={{
                                            width: "30%",
                                            textAlign: "center",
                                            marginBottom: 2,
                                            border: selectedItems.has(item.menu_id) ? '2px solid blue' : 'none', 
                                            borderRadius: 2
                                        }}
                                    >
                                        <Button
                                            onClick={() => handleAddItem(item)} 
                                            sx={{ display: "block", padding: 0 }}
                                        >
                                            <img
                                                src={getImageUrl(item.name)}
                                                alt={item.name}
                                                style={{ width: "214px", height: "164px", borderRadius: 8 }}
                                            />
                                            <Typography>{item.name}</Typography>
                                            <Typography variant="body2">${item.extra_cost}</Typography>
                                        </Button>
                                    </Box>
                                ))}
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Right Section: Order Summary */}
            <Box sx={{ flex: 1, padding: 2, borderLeft: "1px solid #ccc" }}>
                <Typography variant="h6">Order Summary</Typography>
                <Typography>Container: {selectedContainer?.name}</Typography>
                <Box sx={{ marginY: 2 }}>
                    {order.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography>{item.name} - ${item.extra_cost}</Typography>
                            <Button onClick={() => handleRemoveItem(item)}>-</Button>
                        </Box>
                    ))}
                </Box>
                <Typography variant="h6">Total: ${Number(total).toFixed(2)}</Typography>
                <Button variant="contained" onClick={handlePlaceOrder}>
                    Place Order
                </Button>
            </Box>
        </Box>
    );
}

export default RestaurantMenu;
