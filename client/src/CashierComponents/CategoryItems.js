import React from "react";
import { Grid, Button, Typography } from "@mui/material";

/**
 * Renders a grid of buttons representing items within a selected category.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.items - The list of items to display.
 * @param {string} props.selectedCategory - The currently selected category.
 * @param {function} props.onItemSelect - Callback invoked when an item is selected.
 * @returns {JSX.Element} The rendered CategoryItems component.
 */
function CategoryItems({ items, selectedCategory, onItemSelect }) {
    return (
        <div>
            <Typography variant="h6">{selectedCategory}</Typography>
            <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid item key={item.id} xs={6} sm={4} md={3}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: "#D1282E", color: "#FFFFFF" }}
                            onClick={() => onItemSelect(item)}
                        >
                            {item.name}
                            {item.isPremium && <span> (Premium)</span>}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default CategoryItems;
