import React from "react";
import "./Menu.css";
import { Link } from "react-router-dom";
import PatientRegistrationForm from "../PatientRegistrationForm/PatientRegistrationForm";

const Menu = () => (
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
				<li className="menu-item">FLOORS</li>
			</Link>
			<li className="menu-item">BILLING/PAYMENT</li>
			<li className="menu-item">SETTINGS</li>
		</ul>
	</div>
);

export default Menu;
