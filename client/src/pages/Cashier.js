import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuCategories from "../CashierComponents/MenuCategories";
import CategoryItems from "../CashierComponents/CategoryItems";
import OrderSummary from "../CashierComponents/OrderSummary";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import "../styles/Cashier.css";

function Cashier({ role, setRole, user, setUser }) {
    const [selectedCategory, setSelectedCategory] = useState("Containers");
    const [currentContainerId, setCurrentContainerId] = useState(null); // Track the active container ID
    const [orderItems, setOrderItems] = useState([]);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout confirmation dialog
    const [categoryData, setCategoryData] = useState({
        Containers: [],
        Appetizers: [],
        Sides: [],
        Entrees: [],
        Drinks: []
    });
    const [loading, setLoading] = useState(true);
    const [entreesRemaining, setEntreesRemaining] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenuAndContainerData();
    }, []);

    useEffect(() => {
        if (role !== "cashier") {
            navigate('/');
        }
    }, [role, navigate]);

    const fetchMenuAndContainerData = async () => {
        try {
            setLoading(true);

            const menuResponse = await axios.get("https://project-3-team-4b-server.vercel.app/api/menu");
            const containerResponse = await axios.get("https://project-3-team-4b-server.vercel.app/api/containers");

            const filteredContainers = containerResponse.data
                .filter(container => ["Bowl", "Plate", "Bigger Plate", "Drink", "Appetizer"].includes(container.name))
                .map(container => ({
                    ...container,
                    price: Number(container.price) || 0,
                    number_of_entrees: container.name === "Bowl" ? 1 : container.name === "Plate" ? 2 : container.name === "Bigger Plate" ? 3 : 0,
                    number_of_sides: container.name === "Bowl" || container.name === "Plate" || container.name === "Bigger Plate" ? 1 : 0
                }));

            const menuItems = menuResponse.data.map(item => ({
                ...item,
                price: Number(item.price) || 0,
                extra_cost: Number(item.extra_cost) || 0
            }));

            setCategoryData({
                Containers: filteredContainers,
                Appetizers: menuItems.filter(item => item.type === "Appetizer"),
                Sides: menuItems.filter(item => item.type === "Side"),
                Entrees: menuItems.filter(item => item.type === "Entree"),
                Drinks: menuItems.filter(item => item.type === "Drink"),
            });

            setLoading(false);
        } catch (error) {
            console.error("Error fetching menu and container data:", error);
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleSelectContainer = (container) => {
        const newContainerId = orderItems.length + 1; // Generate a unique ID for the container
        const newContainer = {
            id: newContainerId,
            name: container.name,
            price: container.price,
            type: "Container",
            items: [],
        };

        // If the container is Appetizer or Drink, switch to respective category for selection
        if (container.name === "Appetizer") {
            setCurrentContainerId(newContainerId);
            setSelectedCategory("Appetizers"); // Switch to appetizers selection
        } else if (container.name === "Drink") {
            setCurrentContainerId(newContainerId);
            setSelectedCategory("Drinks"); // Switch to drinks selection
        } else if (container.number_of_entrees > 0 || container.number_of_sides > 0) {
            // Handle Bowl, Plate, Bigger Plate
            setCurrentContainerId(newContainerId);
            setEntreesRemaining(container.number_of_entrees);
            setSelectedCategory("Sides"); // Switch to sides selection if applicable
        }

        // Add the container to the order items
        setOrderItems([...orderItems, newContainer]);
    };

    const handleItemSelect = (item) => {
        if (selectedCategory === "Appetizers" || selectedCategory === "Drinks") {
            setOrderItems((prevOrderItems) => {
                return prevOrderItems.map((orderItem) => {
                    if (
                        orderItem.type === "Container" &&
                        orderItem.id === currentContainerId &&
                        (orderItem.name === "Appetizer" || orderItem.name === "Drink")
                    ) {
                        const updatedContainer = { ...orderItem };
                        updatedContainer.items.push({ ...item, type: selectedCategory });
                        return updatedContainer;
                    }
                    return orderItem;
                });
            });
            setSelectedCategory("Containers");
            return;
        }
    
        if (!currentContainerId) {
            alert("Please select a container before adding items.");
            return;
        }
    
        const isEntree = selectedCategory === "Entrees";
        const isSide = selectedCategory === "Sides";
    
        setOrderItems((prevOrderItems) => {
            return prevOrderItems.map((orderItem) => {
                if (
                    orderItem.type === "Container" &&
                    orderItem.id === currentContainerId &&
                    ["Bowl", "Plate", "Bigger Plate"].includes(orderItem.name)
                ) {
                    const updatedContainer = { ...orderItem };
    
                    if (isSide) {
                        const hasSide = updatedContainer.items.some((item) => item.type === "Side");
                        if (hasSide) {
                            alert("You have reached the limit for sides in this container.");
                            return updatedContainer;
                        }
                        updatedContainer.items.push({ ...item, type: "Side" });
                        setSelectedCategory("Entrees");
                    }
    
                    if (isEntree) {
                        if (entreesRemaining <= 0) {
                            alert("You have reached the limit for entrees in this container.");
                            return updatedContainer;
                        }
    
                        updatedContainer.items.push({ ...item, type: "Entree", extra_cost: item.extra_cost || 0 });
                        setEntreesRemaining((prev) => prev - 1);
                    }
    
                    return updatedContainer;
                }
                return orderItem;
            });
        });
    };
    
    

    const handleClearOrder = () => {
        setOrderItems([]);
        setCurrentContainerId(null);
        setEntreesRemaining(0);
    };

    const handleRemoveItem = (containerId, itemName = null) => {
        setOrderItems((prevOrderItems) => {
            return prevOrderItems
                .map((orderItem) => {
                    if (orderItem.id === containerId) {
                        if (itemName) {
                            // Remove the specific item from the container
                            const updatedItems = orderItem.items.filter((item) => item.name !== itemName);
                            return { ...orderItem, items: updatedItems };
                        } else {
                            // Remove the container entirely
                            return null;
                        }
                    }
                    return orderItem;
                })
                .filter((orderItem) => orderItem !== null);  // Filter out removed containers
        });
    };

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true); // Open the logout confirmation dialog
    };
    
    const handleConfirmLogout = () => {
        setOpenLogoutDialog(false); // Close the dialog
        setRole("");
		setUser({});
        navigate('/');  // Navigate to login page after confirmation
    };
    
    
    const handleCancelLogout = () => {
        setOpenLogoutDialog(false); // Close the dialog without logging out
    };
    
    

    return (
        <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "#FFFFFF", color: "#2B2A2A", overflowX: "hidden" }}>
            <Box sx={{ display: "flex", gap: "1rem", p: 2 }}>
                <Box sx={{ flex: 2 }}>
                    {loading ? (
                        <Typography variant="h5" fontFamily="proxima-nova" color="#2B2A2A">Loading...</Typography>
                    ) : (
                        <>
                            <MenuCategories selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                            <CategoryItems
                                items={categoryData[selectedCategory]}
                                selectedCategory={selectedCategory}
                                onItemSelect={selectedCategory === "Containers" ? handleSelectContainer : handleItemSelect}
                            />
                        </>
                    )}
                </Box>
                <Box sx={{ flex: 1, bgcolor: "#F6F6F6", p: 2, borderRadius: 2 }}>
                    <OrderSummary orderItems={orderItems} onClearOrder={handleClearOrder} onRemoveItem={handleRemoveItem} />
                </Box>
            </Box>
            <Box sx={{ position: "absolute", bottom: 0, width: "100%", bgcolor: "#D1282E", color: "#FFFFFF", display: "flex", alignItems: "center", p: 4 }}>
                <img src="/panda_express_logo.png" alt="Panda Express Logo" style={{ height: "80px", marginRight: "1.5rem" }} />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogoutClick}
                    sx={{
                        position: "fixed",
                        right: 30,
                        bottom: 45,
                        bgcolor: "#2B2A2A",
                        color: "#FFFFFF",
                        fontSize: "1rem",
                        padding: "12px 24px",
                        zIndex: 1000
                    }}
                >
                    Log Out
                </Button>
            </Box>
            <Dialog
                open={openLogoutDialog}
                onClose={handleCancelLogout}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">{"Confirm Logout"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelLogout} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmLogout} color="secondary" autoFocus>
                        Log Out
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Cashier;

