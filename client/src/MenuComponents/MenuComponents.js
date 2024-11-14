import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

function RestaurantMenu() {
    const [menuData, setMenuData] = useState([]);
    const [containerData, setContainerData] = useState([]);

    useEffect(() => {
        fetchMenuData();
        fetchContainerData();
    }, []);

    const fetchMenuData = async () => {
        try {
            const response = await axios.get("https://project-3-team-4b-server.vercel.app/api/menu");
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const fetchContainerData = async () => {
        try {
            const response = await axios.get("https://project-3-team-4b-server.vercel.app/api/containers");
            const filteredContainers = response.data.filter(container =>
                ["Bowl", "Plate", "Bigger Plate"].includes(container.name)
            );
            setContainerData(filteredContainers);
        } catch (error) {
            console.error("Error fetching container data:", error);
        }
    };

    const getImageUrl = (name) => {
        const formattedName = name.toLowerCase().replace(/\s+/g, "_");
        return `/images/${formattedName}.png`;
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
            {/* Container Section */}
            <Typography variant="h4" sx={{ marginBottom: 3 }}>Containers</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginBottom: 5 }}>
                {containerData.map((container) => (
                    <Box key={container.container_id} sx={{ textAlign: "center" }}>
                        <img
                            src={getImageUrl(container.name)}
                            alt={container.name}
                            style={{ width: "214px", height: "164px", borderRadius: 8 }}
                        />
                        <Typography sx={{ marginTop: 1 }}>{container.name}</Typography>
                        {container.price !== 0 && <Typography>Price: ${container.price}</Typography>}
                    </Box>
                ))}
            </Box>

            {/* Entrees Section */}
            <Typography variant="h4" sx={{ marginBottom: 3 }}>Entrees</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginBottom: 5 }}>
                {menuData.filter((item) => item.type === "Entree").map((item) => (
                    <Box key={item.menu_id} sx={{ textAlign: "center" }}>
                        <img
                            src={getImageUrl(item.name)}
                            alt={item.name}
                            style={{ width: "214px", height: "164px", borderRadius: 8 }}
                        />
                        <Typography sx={{ marginTop: 1 }}>{item.name}</Typography>
                        {Number(item.extra_cost) !== 0.00 && <Typography>Extra Cost: ${item.extra_cost}</Typography>}
                    </Box>
                ))}
            </Box>

            {/* Sides Section */}
            <Typography variant="h4" sx={{ marginBottom: 3 }}>Sides</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginBottom: 5 }}>
                {menuData.filter((item) => item.type === "Side").map((item) => (
                    <Box key={item.menu_id} sx={{ textAlign: "center" }}>
                        <img
                            src={getImageUrl(item.name)}
                            alt={item.name}
                            style={{ width: "214px", height: "164px", borderRadius: 8 }}
                        />
                        <Typography sx={{ marginTop: 1 }}>{item.name}</Typography>
                        {Number(item.extra_cost) !== 0.00 && <Typography>Extra Cost: ${item.extra_cost}</Typography>}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default RestaurantMenu;