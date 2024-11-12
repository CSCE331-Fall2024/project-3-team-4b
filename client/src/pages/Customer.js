// Customer.js
import React from 'react';
import '../styles/Customer.css';
import Menu from '../CustomerComponents/CustomerComponents.js';

const Customer = () => {
    return (
        <div className="customer-container">
            <h1>Meals</h1>
            <Menu />
        </div>
    );
};

export default Customer;
