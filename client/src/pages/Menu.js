// Menu.js
import React from 'react';
import '../styles/Menu.css';
import RestaurantMenu from '../MenuComponents/RestaurantMenu.js';

const Menu = () => {
    return (
        <div className="menu-container">
            <h1>Menu</h1>
            <RestaurantMenu />
        </div>
    );
};

export default Menu;