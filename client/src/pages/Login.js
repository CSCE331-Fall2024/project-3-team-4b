import '../styles/Login.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Menu from './Menu';
import Customer from './Customer';
import Cashier from './Cashier';
import Manager from './Manager';
import Home from './Home';

function Login() {
  return (
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
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default Login;
