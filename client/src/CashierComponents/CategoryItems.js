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
                            {item.name} - ${item.price.toFixed(2)}
                            {item.isPremium && <span> (Premium +$1.75)</span>}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default CategoryItems;
