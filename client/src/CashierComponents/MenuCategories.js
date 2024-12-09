import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

/**
 * Renders a tabbed navigation menu for categories such as Containers, Entrees, etc.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.selectedCategory - The currently selected category.
 * @param {function} props.onCategoryChange - Callback invoked when a category is selected.
 * @returns {JSX.Element} The rendered MenuCategories component.
 */
function MenuCategories({ selectedCategory, onCategoryChange }) {
    const categories = ["Containers", "Entrees", "Sides", "Appetizers", "Drinks"];

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={selectedCategory}
                onChange={(e, newValue) => onCategoryChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ ".MuiTabs-indicator": { backgroundColor: "#D1282E" } }}
            >
                {categories.map((category) => (
                    <Tab
                        key={category}
                        label={category}
                        value={category}
                        sx={{
                            color: selectedCategory === category ? "#D1282E" : "#2B2A2A",
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
}

export default MenuCategories;
