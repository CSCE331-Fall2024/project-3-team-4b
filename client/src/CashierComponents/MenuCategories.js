import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

function MenuCategories({ selectedCategory, onCategoryChange }) {
    const categories = ["Containers", "Entrees", "Sides", "Appetizers", "Drinks"];

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={selectedCategory}
                onChange={(e, newValue) => onCategoryChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ ".MuiTabs-indicator": { backgroundColor: "#D1282E" } }} // Red indicator for active tab
            >
                {categories.map((category) => (
                    <Tab
                        key={category}
                        label={category}
                        value={category}
                        sx={{
                            color: selectedCategory === category ? "#D1282E" : "#2B2A2A", // Red for active, Black for inactive
                            fontFamily: "proxima-nova"
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
}

export default MenuCategories;
