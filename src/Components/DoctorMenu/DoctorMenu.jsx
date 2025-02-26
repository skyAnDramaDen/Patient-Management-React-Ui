import React from "react";
import { Link } from "react-router-dom";
import "./DoctorMenu.css";

const DoctorMenu = () => (
  <div className="menu">
    <div className="menu-header">MENU</div>
    <ul className="menu-list">
      <Link to="/doctor-home" style={{ textDecoration: "none", color: "inherit" }}>
        <li className="menu-item">DASHBOARD</li>
      </Link>
      <Link to="/patient-management" style={{ textDecoration: "none", color: "inherit" }}>
        <li className="menu-item">PATIENT MANAGEMENT</li>
      </Link>
      <Link to="/medical-records" style={{ textDecoration: "none", color: "inherit" }}>
        <li className="menu-item">MEDICAL RECORDS</li>
      </Link>
      <Link to="/messages" style={{ textDecoration: "none", color: "inherit" }}>
        <li className="menu-item">MESSAGES</li>
      </Link>
      <Link to="/settings" style={{ textDecoration: "none", color: "inherit" }}>
        <li className="menu-item">SETTINGS</li>
      </Link>
      <li className="menu-item">LOGOUT</li>
    </ul>
  </div>
);

export default DoctorMenu;
