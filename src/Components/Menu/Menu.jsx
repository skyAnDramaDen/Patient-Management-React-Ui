import React from "react";
import "./Menu.css";
import { Link } from "react-router-dom";
import PatientRegistrationForm from "../PatientRegistrationForm/PatientRegistrationForm";

const Menu = () => (
	<div className="menu">
		<div className="menu-header">MAIN MENU</div>
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
			<li className="menu-item">BILLING/PAYMENT</li>
			<li className="menu-item">Settings</li>
			<li className="menu-item">Logout</li>
		</ul>
	</div>
);

export default Menu;
