import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Customer from './pages/Customer';
import Cashier from './pages/Cashier';
import Manager from './pages/Manager';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
