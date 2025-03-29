import "./Header.css";
import React, { useState, useEffect, useContext, useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';


import { AuthContext } from "../../Authcontext";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = forwardRef(({ showNav, setShowNav }, ref) => {
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


    // useEffect(() => {
    //     const menuBurger = menuBurgerRef.current;
    //     console.log(menuBurger);
    //     if (menuBurger) {
    //         const handleMouseDown = (event) => {
    //             // console.log("Mousedown event triggered:", event.target);
    //         };

    //         menuBurger.addEventListener("mousedown", handleMouseDown);

    //         return () => {
    //             menuBurger.removeEventListener("mousedown", handleMouseDown);
    //         };
    //     }
    // }, []);

    const handleLogout = () => {
        logout();
    };
  return (
    <div className="header" >
        <div className="menu-burger"
        onClick={() => {
            setShowNav((prevState) => {
                return !prevState;
            });
        }}
        ref={ref}
        
        >
            <RxHamburgerMenu className="hamburger"
            
            />
            <p>MENU</p>
        </div>
        
        <p>{role}</p>
        {/* <ul className="nav-menu">
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
        </ul> */}
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
})

export default Header
