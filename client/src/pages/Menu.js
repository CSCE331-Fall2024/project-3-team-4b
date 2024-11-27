// Menu.js
import React from 'react';
import '../styles/Menu.css';
import RestaurantMenu from '../MenuComponents/MenuComponents.js';

/**
 * Menu component that serves as a container for the restaurant menu.
 * It displays the main heading and includes the RestaurantMenu component.
 *
 * @returns {JSX.Element} The rendered Menu component.
 */
const Menu = () => {
    return (
        <div className="menu-container">
            <h1>Menu</h1>
            <RestaurantMenu />
        </div>
    );
};

export default Menu;
