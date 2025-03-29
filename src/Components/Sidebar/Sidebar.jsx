import React, { useState, useEffect, forwardRef, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import './Sidebar.css';

// import logo from "../../medical_logo.avif";
import logo from "../../medical_logo_2.jpg";

import { Link } from "react-router-dom";

const Sidebar = forwardRef(({ show, setShowNav }, ref) => {

  return (
    <div ref={ref} className={show ? "sidebar2 active" : "sidebar2"}>
      <div className='logo-bundle'>
        <img src={logo} alt = "Logo" className='logo'/>
        <span className='main-name'>MediSwift</span>
      	</div>
      		<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">HOME</li>
			</Link>
			<Link to="/patient-management" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">PATIENT MNGMNT</li>
			</Link>
			<Link to="/staff-management" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">STAFF MANAGEMENT</li>
			</Link>
			<Link to="/appointments" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">APPOINTMENTS</li>
			</Link>
			<Link to="/home-chat" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">CHAT</li>
			</Link>
			{/* <Link to="/view-wards" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">WARDS</li>
			</Link> */}
			<Link to="/view-floors" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">FLOORS/WARD</li>
			</Link>
			<Link
			to="billing-and-payment"
			style={{ textDecoration: "none", color: "inherit" }}
			>
			<li className="menu-item">BILLING/PAYMENT</li>
			
			</Link>
			<Link to="/admissions" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">ADMISSIONS</li>
			</Link>
			<li className="menu-item">SETTINGS</li>
    	</div>
  	);
});

export default Sidebar;
