import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Customer from './pages/Customer';
import Cashier from './pages/Cashier';
import Manager from './pages/Manager';
// import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <ul>
            <li><Link to="/menu" className="button-link">Menu</Link></li>
            <li><Link to="/customer" className="button-link">Customer</Link></li>
            <li><Link to="/cashier" className="button-link">Cashier</Link></li>
            <li><Link to="/manager" className="button-link">Manager</Link></li>
            <li><Link to="/" className="button-link">Home</Link></li>
          </ul>
        </nav>

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
