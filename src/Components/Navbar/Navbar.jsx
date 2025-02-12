import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <div className="navbar">
    <div className="nav-logo">
      <p>MediLife</p>
    </div>
    <ul className="nav-menu">
      <li>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
      </li>
      <li>
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
      </li>
      <li>
        <Link to="/services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
      </li>
      <li>
        <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</Link>
      </li>
    </ul>
    <div className="nav-login">
      <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
        <button>Login</button>
      </Link>
    </div>
  </div>
);

export default NavBar;
