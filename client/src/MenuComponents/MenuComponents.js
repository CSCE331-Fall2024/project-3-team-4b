import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

/**
 * RestaurantMenu component that displays the menu, including containers, entrees, and sides.
 * It fetches data from the API to dynamically render the menu items.
 *
 * @returns {JSX.Element} The rendered RestaurantMenu component.
 */
function RestaurantMenu() {
    const [menuData, setMenuData] = useState([]);
    const [containerData, setContainerData] = useState([]);

    useEffect(() => {
        fetchMenuData();
        fetchContainerData();
        addGoogleTranslateScript();
    }, []);

    /**
     * Fetches menu data from the server API and sets the menuData state.
     *
     * @async
     * @function fetchMenuData
     */
    const fetchMenuData = async () => {
        try {
            const response = await axios.get("/api/menu");
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    /**
     * Fetches container data from the server API, filters it for specific container types,
     * and sets the containerData state.
     *
     * @async
     * @function fetchContainerData
     */
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

    /**
     * Generates the image URL for a given menu item or container.
     *
     * @param {string} name - The name of the item for which to generate the image URL.
     * @returns {string} The formatted image URL.
     */

    const addGoogleTranslateScript = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        };
    };

    const getImageUrl = (name) => {
        const formattedName = name.toLowerCase().replace(/\s+/g, "_");
        return `/images/${formattedName}.png`;
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
            {/* Google Translate Element */}
            <div id="google_translate_element" style={{ marginBottom: '20px' }}></div>

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
