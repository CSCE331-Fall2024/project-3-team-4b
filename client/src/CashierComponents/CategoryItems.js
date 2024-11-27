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
                            sx={{ bgcolor: "#D1282E", color: "#FFFFFF", fontFamily: "proxima-nova" }} // Red color for item buttons
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
