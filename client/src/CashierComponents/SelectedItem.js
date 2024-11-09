// CashierComponents/SelectedItem.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";

function SelectedItem({ item, onAddToOrder, selectedContainer }) {
    if (!item) return null;

    return (
        <Box sx={{ p: 2, border: "1px solid gray", borderRadius: 1, mb: 2 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body1">Price: ${item.price.toFixed(2)}</Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => onAddToOrder(item)} 
                sx={{ mt: 1 }}
                disabled={!selectedContainer} // Disable if no container is selected
            >
            
            </Button>
        </Box>
    );
}

export default SelectedItem;
