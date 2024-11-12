import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

function Menu() {
    const [menuData, setMenuData] = useState([]);
    const [containerData, setContainerData] = useState([]);

    useEffect(() => {
        fetchMenuData();
        fetchContainerData();
    }, []);

    const fetchMenuData = async () => {
        try {
            const response = await axios.get("/api/menu");
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const fetchContainerData = async () => {
        try {
            const response = await axios.get("/api/containers");
            const filteredContainers = response.data.body.filter(container =>
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
        <Box sx={{ display: "flex" }}>
            {/* Left Section - Menu Selection */}
            <Box sx={{ flex: 2, padding: 2 }}>
                <Typography variant="h4">Containers</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 2 }}>
                    {containerData.map((container) => (
                        <Box
                            key={container.container_id}
                            sx={{
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={getImageUrl(container.name)}
                                alt={container.name}
                                style={{ width: "214px", height: "164px", borderRadius: 8 }}
                            />
                            <Typography sx={{ marginTop: 1 }}>{container.name}</Typography>
                        </Box>
                    ))}
                </Box>

                <Box>
                    {["Entree", "Side", "Appetizer", "Drink"].map((type) => (
                        <Box key={type} sx={{ marginBottom: 2 }}>
                            <Typography variant="h5">{type}s</Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                                {menuData
                                    .filter((item) => item.type === type)
                                    .map((item) => (
                                        <Box
                                            key={item.menu_id}
                                            sx={{
                                                padding: 0,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <img
                                                src={getImageUrl(item.name)}
                                                alt={item.name}
                                                style={{ width: "214px", height: "164px", borderRadius: 8 }}
                                            />
                                            <Typography sx={{ marginTop: 1 }}>{item.name}</Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Menu;
