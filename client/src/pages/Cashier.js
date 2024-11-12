import React, { useState } from "react";
import MenuCategories from "../CashierComponents/MenuCategories";
import CategoryItems from "../CashierComponents/CategoryItems";
import OrderSummary from "../CashierComponents/OrderSummary";

function Cashier() {
    const [selectedCategory, setSelectedCategory] = useState("Containers");
    const [currentContainerId, setCurrentContainerId] = useState(null); // Track the active container ID
    const [orderItems, setOrderItems] = useState([]);
    const [entreesRemaining, setEntreesRemaining] = useState(0);

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

    const containerLimits = {
        Bowl: { entrees: 1, sides: 1 },
        Plate: { entrees: 2, sides: 1 },
        "Bigger Plate": { entrees: 3, sides: 1 },
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

        setOrderItems([...orderItems, newContainer]);
        setCurrentContainerId(newContainerId);
        setSelectedCategory("Sides"); // Switch to sides selection
        setEntreesRemaining(containerLimits[container.name].entrees); // Set number of entrees to be selected
    };

    const handleItemSelect = (item) => {
        if (selectedCategory === "Appetizers" || selectedCategory === "Drinks") {
            setOrderItems((prevOrderItems) => [
                ...prevOrderItems,
                { ...item, type: selectedCategory }
            ]);
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
                if (orderItem.type === "Container" && orderItem.id === currentContainerId) {
                    const updatedContainer = { ...orderItem };

                    if (isSide) {
                        updatedContainer.items.push({ ...item, type: "Side" });
                        setSelectedCategory("Entrees"); // Switch to entrees after selecting a side
                    }

                    if (isEntree) {
                        // Add entree and handle premium cost if applicable
                        if (item.isPremium) {
                            updatedContainer.price += item.price; // Add premium charge
                        }
                        updatedContainer.items.push({ ...item, type: "Entree" });

                        // Update entreesRemaining and switch category if done
                        setEntreesRemaining((prev) => {
                            if (prev - 1 <= 0) {
                                setSelectedCategory("Containers");
                            }
                            return prev - 1;
                        });
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
    };

    const handlePlaceOrder = () => {
        console.log("Order placed:", orderItems);
        setOrderItems([]);
        setCurrentContainerId(null);
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
