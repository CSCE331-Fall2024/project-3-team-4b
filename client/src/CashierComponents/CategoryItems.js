// CashierComponents/CategoryItems.js
import React from "react";
import { Grid, Button, Typography } from "@mui/material";

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
                            onClick={() => onItemSelect(item)}
                        >
                            {item.name} {/* Display only the item name */}
                            {item.isPremium && <span> (Premium)</span>} {/* Still show if it's premium */}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default CategoryItems;
