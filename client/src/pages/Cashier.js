import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuCategories from "../CashierComponents/MenuCategories";
import CategoryItems from "../CashierComponents/CategoryItems";
import OrderSummary from "../CashierComponents/OrderSummary";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function Cashier( {role, user} ) {
    const [selectedCategory, setSelectedCategory] = useState("Containers");
    const [currentContainerId, setCurrentContainerId] = useState(null); // Track the active container ID
    const [orderItems, setOrderItems] = useState([]);
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

    // Fetch menu data and container data on mount
    useEffect(() => {
        fetchMenuAndContainerData();
    }, []);

    useEffect(() => {
        if(role !== "cashier"){
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
                    price: Number(container.price) || 0, // Ensure price is a number
                    number_of_entrees: container.name === "Bowl" ? 1 : container.name === "Plate" ? 2 : container.name === "Bigger Plate" ? 3 : 0,
                    number_of_sides: container.name === "Bowl" || container.name === "Plate" || container.name === "Bigger Plate" ? 1 : 0
                }));
    
            // Ensure menu item prices are numbers
            const menuItems = menuResponse.data.map(item => ({
                ...item,
                price: Number(item.price) || 0, // Ensure price is a number
                extra_cost: Number(item.extra_cost) || 0 // Ensure extra cost is a number
            }));
    
            // Set fetched data in categoryData
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
    
        // If the container is Appetizer or Drink, switch to respective category
        if (container.name === "Appetizers") {
            setCurrentContainerId(newContainerId);
            setSelectedCategory("Appetizers"); // Switch to appetizers selection
        } else if (container.name === "Drinks") {
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
        // Appetizers and drinks are added to their respective container only
        if (selectedCategory === "Appetizers" || selectedCategory === "Drinks") {
            setOrderItems((prevOrderItems) => {
                return prevOrderItems.map((orderItem) => {
                    if (
                        orderItem.type === "Container" &&
                        orderItem.id === currentContainerId &&
                        (orderItem.name === "Appetizers" || orderItem.name === "Drinks")
                    ) {
                        const updatedContainer = { ...orderItem };
                        updatedContainer.items.push({ ...item, type: selectedCategory });
                        return updatedContainer;
                    }
                    return orderItem;
                });
            });
            setSelectedCategory("Containers"); // Switch back to containers after selecting an item
            return;
        }
    
        // For sides and entrees, ensure a container is selected
        if (!currentContainerId) {
            alert("Please select a container before adding items.");
            return;
        }
    
        const isEntree = selectedCategory === "Entrees";
        const isSide = selectedCategory === "Sides";
    
        setOrderItems((prevOrderItems) => {
            return prevOrderItems.map((orderItem) => {
                // Ensure we are adding sides or entrees to Bowl, Plate, or Bigger Plate containers only
                if (
                    orderItem.type === "Container" &&
                    orderItem.id === currentContainerId &&
                    ["Bowl", "Plate", "Bigger Plate"].includes(orderItem.name)
                ) {
                    const updatedContainer = { ...orderItem };
    
                    if (isSide) {
                        // Prevent adding more than one side to a container
                        const hasSide = updatedContainer.items.some((item) => item.type === "Side");
                        if (hasSide) {
                            alert("You have reached the limit for sides in this container.");
                            return updatedContainer;
                        }
                        updatedContainer.items.push({ ...item, type: "Side" });
                        setSelectedCategory("Entrees"); // Switch to entrees after selecting a side
                    }
    
                    if (isEntree) {
                        if (entreesRemaining <= 0) {
                            alert("You have reached the limit for entrees in this container.");
                            return updatedContainer;
                        }
    
                        // Add entree and handle premium cost if applicable
                        if (item.isPremium && item.extra_cost) {
                            updatedContainer.price += item.extra_cost; // Add premium charge using `extra_cost`
                        }
                        updatedContainer.items.push({ ...item, type: "Entree" });
    
                        setEntreesRemaining((prev) => prev - 1); // Decrement the remaining entrees
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

    return (
        <Box sx={{ display: "flex", gap: "1rem" }}>
            <Box sx={{ flex: 2 }}>
                {loading ? (
                    <Typography>Loading...</Typography>
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
            <Box sx={{ flex: 1 }}>
                <OrderSummary orderItems={orderItems} onClearOrder={handleClearOrder} />
            </Box>
        </Box>
    );
}

export default Cashier;
