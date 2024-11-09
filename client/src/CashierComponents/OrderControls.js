// CashierComponents/OrderControls.js
import React from "react";
import { Button, Box } from "@mui/material";

function OrderControls({ onClearOrder, onPlaceOrder }) {
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" color="primary" onClick={onPlaceOrder}>
                Place Order
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClearOrder}>
                Clear Order
            </Button>
        </Box>
    );
}

export default OrderControls;
