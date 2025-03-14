import React, { useState } from "react";
import "./Menu.css";
import { Link } from "react-router-dom";
import PatientRegistrationForm from "../PatientRegistrationForm/PatientRegistrationForm";

const Menu = () => {
	const [isOpen, setIsOpen] = useState(true);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};	
	
	return (
	<div className={`menu-container ${isOpen ? "open" : "closed"}`}>
		{/* <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? "✖" : "☰"}
      </button> */}

		<div className="menu">
		<div className="menu-header">MENU</div>
		<ul className="menu-list">
			<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">HOME</li>
			</Link>
			<Link to="/patient-management" style={{ textDecoration: "none", color: "inherit" }}>
				<li className="menu-item">PATIENT MANAGEMENT</li>
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
				<li className="menu-item">FLOORS/WARD MNGMT</li>
			</Link>
			<li className="menu-item">BILLING/PAYMENT</li>
			<li className="menu-item">SETTINGS</li>
		</ul>
	</div>
	</div>
	)
};

export default Menu;
