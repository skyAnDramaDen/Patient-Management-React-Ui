import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StaffManagement.css";
import PageHeader from "../PageHeader/PageHeader";

const StaffManagement = () => {
    const navigate = useNavigate(); 
  return (
    <div className="staff-management">

      <PageHeader  title="Staff Management" backPath="/"  />

      <div className="staff-actions">
        <Link to="/staff/doctors" className="staff-button">👨‍⚕️ Doctors</Link>
        <Link to="/staff/nurses" className="staff-button">👩‍⚕️ Nurses</Link>

        <Link to="/staff/admin" className="staff-button">📋 Administrative Staff</Link>
        <Link to="/staff/support" className="staff-button">🏥 Support Staff</Link>

        <Link to="/staff/scheduling" className="staff-button">📅 Staff Scheduling</Link>
        <Link to="/staff/performance" className="staff-button">📊 Performance & Reviews</Link>
        <Link to="/staff/payroll" className="staff-button">💰 Payroll & Benefits</Link>
      </div>
    </div>
  );
};

export default StaffManagement;
