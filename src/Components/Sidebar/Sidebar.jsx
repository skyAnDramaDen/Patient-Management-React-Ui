import React, { useState, useEffect, forwardRef, useRef, useContext, } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import "./Sidebar.css";

import logo from "../../medical_logo_2.jpg";

import { Link } from "react-router-dom";

import AuthProvider, { AuthContext } from "../../Authcontext";

const Sidebar = forwardRef(({ show, setShowNav }, ref) => {
	const { user } = useContext(AuthContext);

	const menuItems = [
		{ name: "HOME", to: "/", roles: ["super-admin"] },
		{ name: "HOME", to: "/doctor-home", roles: ["doctor"] },
		{ name: "HOME", to: "/nurse-home", roles: ["nurse"] },
		{
			name: "PATIENTS",
			to: "/patient-management",
			roles: ["super-admin", "nurse"],
		},
		{ name: "STAFF MANAGEMENT", to: "/staff-management", roles: ["super-admin"] },
		{ name: "APPOINTMENTS", to: "/appointments", roles: ["super-admin", "nurse"] },
		{ name: "CHAT", to: "/home-chat", roles: ["super-admin"] },
		{ name: "FLOORS/WARD", to: "/view-floors", roles: ["super-admin"] },
		{
			name: "BILLING/PAYMENT",
			to: "/billing-and-payment",
			roles: ["super-admin",],
		},
		{ name: "ADMISSIONS", to: "/admissions", roles: ["super-admin", "nurse"] },
		{ name: "CHAT", to: "/doctor-chat", roles: ["doctor"] },
		{ name: "MEDICAL RECORDS", to: "/medical-records", roles: ["super-admin", "doctor", "nurse"] },
		{ name: "SETTINGS", to: "/settings", roles: ["super-admin", "doctor", "nurse"] },
	];

	const filteredMenuItems = menuItems.filter((item) =>
		item.roles.includes(user.role)
	);

	return (
		<div ref={ref} className={show ? "sidebar2 active" : "sidebar2"}>
			<div className="logo-bundle">
				<img src={logo} alt="Logo" className="logo" />
				<span className="main-name">MediSwift</span>
			</div>
			{filteredMenuItems.map((item, index) => (
				<Link
					key={index}
					to={item.to}
					style={{ textDecoration: "none", color: "inherit" }}>
					<li className="menu-item">{item.name}</li>
				</Link>
			))}
		</div>
	);
});

export default Sidebar;
