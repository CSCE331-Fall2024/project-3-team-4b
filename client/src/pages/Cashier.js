// CashierComponents/Cashier.js
import React, { useState } from "react";
import MenuCategories from "../CashierComponents/MenuCategories";
import CategoryItems from "../CashierComponents/CategoryItems";
import OrderSummary from "../CashierComponents/OrderSummary";
import SelectedItem from "../CashierComponents/SelectedItem";

function Cashier() {
    const [selectedCategory, setSelectedCategory] = useState("Containers");
    const [selectedContainer, setSelectedContainer] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    // Define sample data for each category
    const categoryData = {
        Containers: [
            { id: 1, name: "Bowl", price: 6.50 },
            { id: 2, name: "Plate", price: 7.50 },
            { id: 3, name: "Bigger Plate", price: 8.50 },
        ],
        Entrees: [
            { id: 4, name: "Orange Chicken", price: 5.99, isPremium: false },
            { id: 5, name: "Honey Walnut Shrimp", price: 6.99, isPremium: true },
            // Add more entrees here
        ],
        Sides: [
            { id: 6, name: "Fried Rice", price: 2.99 },
            { id: 7, name: "Chow Mein", price: 2.99 },
            // Add more sides here
        ],
        Appetizers: [
            { id: 8, name: "Spring Roll", price: 1.99 },
            { id: 9, name: "Chicken Egg Roll", price: 2.49 },
            // Add more appetizers here
        ],
        Drinks: [
            { id: 10, name: "Soft Drink", price: 1.99 },
            { id: 11, name: "Bottled Water", price: 1.49 },
            // Add more drinks here
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
        setSelectedItem(item);
    };

    const handleAddToOrder = (item) => {
        // Determine if item is an entree or a side based on selected category
        const isEntree = selectedCategory === "Entrees";
        const isSide = selectedCategory === "Sides";
    
        // Count the number of entrees and sides currently in the order
        const currentEntrees = orderItems.filter(i => i.type === "Entree").length;
        const currentSides = orderItems.filter(i => i.type === "Side").length;
    
        // Check if a container is selected and if it has entree and side limits
        if (selectedContainer && containerLimits[selectedContainer.name]) {
            const { entrees, sides } = containerLimits[selectedContainer.name];
            
            // Check if the number of entrees exceeds the container limit
            if (isEntree && currentEntrees >= entrees) {
                alert(`A ${selectedContainer.name} only allows ${entrees} entree(s).`);
                return;
            }
            
            // Check if the number of sides exceeds the container limit
            if (isSide && currentSides >= sides) {
                alert(`A ${selectedContainer.name} only allows ${sides} side(s).`);
                return;
            }
        } else {
            alert("Please select a container before adding items.");
            return;
        }
    
        // Apply a premium charge if the item is premium
        const premiumCharge = item.isPremium ? 1.75 : 0;
        const itemWithCharge = { ...item, price: item.price + premiumCharge };
    
        // Add the item to the orderItems array
        setOrderItems([...orderItems, { ...itemWithCharge, type: selectedCategory }]);
        
        // Clear the selected item after adding to the order
        setSelectedItem(null);
    };

    const handleSelectContainer = (container) => {
        setSelectedContainer(container);
        setOrderItems([]);
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
                <SelectedItem item={selectedItem} onAddToOrder={handleAddToOrder} />
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