import "./Header.css";
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';


import { AuthContext } from "../../Authcontext";
import { RxHamburgerMenu } from "react-icons/rx";

function Header({ showNav, setShowNav }) {
    const { logout, role } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        setIsLoggedIn(true);  
        } else {
        setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        logout();
    };
  return (
    <div className="header">
        <div className="menu-burger"
        onClick={() => {
            setShowNav(!showNav)
        }}>
            <RxHamburgerMenu className="hamburger"
            
            />
            <p>MENU</p>
        </div>
        
        <p>{role}</p>
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
        {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
        ) : (
        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            Login
        </Link>
        )
        }   
        </div>
    </div>
  )
}

export default Header
