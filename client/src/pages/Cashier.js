// CashierComponents/Cashier.js
import React, { useState } from "react";
import MenuCategories from "../CashierComponents/MenuCategories";
import CategoryItems from "../CashierComponents/CategoryItems";
import OrderSummary from "../CashierComponents/OrderSummary";
import SelectedItem from "../CashierComponents/SelectedItem";

function Cashier() {
    const [selectedCategory, setSelectedCategory] = useState("Containers");
    const [selectedContainer, setSelectedContainer] = useState(null);
    //const [selectedItem, setSelectedItem] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [entreesRemaining, setEntreesRemaining] = useState(0);

    // Define sample data for each category
    const categoryData = {
        Containers: [
            { id: 1, name: "Bowl", price: 8.30 },
            { id: 2, name: "Plate", price: 9.80 },
            { id: 3, name: "Bigger Plate", price: 11.30 },
        ],
        Appetizers: [
            { id: 1, name: "Chicken Egg Roll", price: 0 },
            { id: 2, name: "Veggie Spring Roll", price: 0 },
            { id: 3, name: "Cream Cheese Rangoon", price: 0 },
            { id: 4, name: "Apple Pie Roll", price: 0 },
        ],
        Sides: [
            { id: 5, name: "Chow Mein", price: 0 },
            { id: 6, name: "Fried Rice", price: 0 },
            { id: 7, name: "White Steamed Rice", price: 0 },
            { id: 8, name: "Super Greens", price: 0 },
        ],
        Entrees: [
            { id: 9, name: "The Original Orange Chicken", price: 0, isPremium: false },
            { id: 10, name: "Grilled Teriyaki Chicken", price: 0, isPremium: false },
            { id: 11, name: "Honey Walnut Shrimp", price: 1.5, isPremium: true },
            { id: 12, name: "Broccoli Beef", price: 0, isPremium: false },
            { id: 13, name: "Mushroom Chicken", price: 0, isPremium: false },
            { id: 14, name: "Sweet Fire Chicken Breast", price: 0, isPremium: false },
        ],
        Drinks: [
            { id: 15, name: "Dr Pepper", price: 0 },
            { id: 16, name: "Sweet Tea", price: 0 },
            { id: 17, name: "Pepsi", price: 0 },
            { id: 18, name: "Mountain Dew", price: 0 },
            { id: 19, name: "Sierra Mist", price: 0 },
            { id: 20, name: "Water", price: 0 },
        ]
    };
    

    // Define container limits based on Panda Express requirements
    const containerLimits = {
        Bowl: { entrees: 1, sides: 1 },
        Plate: { entrees: 2, sides: 1 },
        "Bigger Plate": { entrees: 3, sides: 1 },
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleItemSelect = (item) => {
        if (selectedCategory === "Appetizers" || selectedCategory === "Drinks") {
            // Add appetizers and drinks directly to the order
            setOrderItems([...orderItems, { ...item, type: selectedCategory }]);
            return;
        }
    
        if (!selectedContainer) {
            alert("Please select a container before adding items.");
            return;
        }
    
        const isEntree = selectedCategory === "Entrees";
        const isSide = selectedCategory === "Sides";
    
        if (isSide) {
            // Automatically add side to the order and switch to entrees
            setOrderItems([...orderItems, { ...item, type: "Side" }]);
            setSelectedCategory("Entrees"); // Switch to entrees after selecting a side
            return;
        }
    
        if (isEntree) {
            setOrderItems((prevOrderItems) => [...prevOrderItems, { ...item, type: "Entree" }]);
            setEntreesRemaining((prev) => {
                if (prev - 1 <= 0) {
                    setSelectedCategory("Containers");
                }
                return prev - 1;
            });
        }
    };

    const handleAddToOrder = (item) => {
        if (selectedCategory === "Appetizers" || selectedCategory === "Drinks") {
            // Add appetizers and drinks directly to the order
            setOrderItems([...orderItems, { ...item, type: selectedCategory }]);
            return;
        }
    
        if (!selectedContainer) {
            alert("Please select a container before adding items.");
            return;
        }
    
        const isEntree = selectedCategory === "Entrees";
        const isSide = selectedCategory === "Sides";
    
        if (isSide) {
            // Automatically add side to the order and switch to entrees
            setOrderItems([...orderItems, { ...item, type: "Side" }]);
            setSelectedCategory("Entrees"); // Switch to entrees after selecting a side
            return;
        }
    
        if (isEntree) {
            // Prepare to add the entree to the order
            let updatedOrderItems = [...orderItems, { ...item, type: "Entree" }];
    
            // If the selected entree is a premium item, update the container price
            if (item.isPremium) {
                const premiumCharge = 1.50; // The extra cost for a premium item
                const updatedContainer = {
                    ...selectedContainer,
                    price: selectedContainer.price + premiumCharge, // Adding the premium cost to the container price
                };
    
                // Update the container in the orderItems
                updatedOrderItems = updatedOrderItems.map((orderItem) =>
                    orderItem.type === "Container" ? updatedContainer : orderItem
                );
    
                // Update selectedContainer state as well
                setSelectedContainer(updatedContainer);
            }
    
            setOrderItems(updatedOrderItems);
            setEntreesRemaining((prev) => {
                if (prev - 1 <= 0) {
                    setSelectedCategory("Containers");
                }
                return prev - 1;
            });
        }
    };
    
    
    
    
    

    const handleSelectContainer = (container) => {
        setSelectedContainer(container);
        setOrderItems([{ ...container, type: "Container" }]);
        setSelectedCategory("Sides"); // Switch to sides selection
        setEntreesRemaining(containerLimits[container.name].entrees); // Set number of entrees to be selected
    };   

    const handleClearOrder = () => {
        setOrderItems([]);
        setSelectedContainer(null);
    };

    const handlePlaceOrder = () => {
        console.log("Order placed:", orderItems);
        setOrderItems([]);
        setSelectedContainer(null);
    };

    return (
        <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 2 }}>
                <MenuCategories selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                {selectedCategory === "Containers" ? (
                    <CategoryItems 
                        items={categoryData[selectedCategory]} 
                        selectedCategory={selectedCategory} 
                        onItemSelect={handleSelectContainer} 
                    />
                ) : (
                    <CategoryItems 
                        items={categoryData[selectedCategory]} 
                        selectedCategory={selectedCategory} 
                        onItemSelect={handleItemSelect} 
                    />
                )}
                <SelectedItem 
                    onAddToOrder={handleAddToOrder} 
                    selectedContainer={selectedContainer}
                />
            </div>
            <div style={{ flex: 1 }}>
                <OrderSummary 
                    orderItems={orderItems} 
                    onClearOrder={handleClearOrder} 
                    onPlaceOrder={handlePlaceOrder} 
                />
            </div>
        </div>
    );
    
}

export default Cashier;