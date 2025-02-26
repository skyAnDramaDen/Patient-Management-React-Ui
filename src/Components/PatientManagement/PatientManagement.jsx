import './PatientManagement.css';

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PatientManagement.css";
import PageHeader from '../PageHeader/PageHeader';

const PatientManagement = () => {
  const navigate = useNavigate(); 

  return (
    <div className="patient-management">

      <PageHeader  title="Patient Management" backPath="/"  />

      <div className="patient-actions">
        <Link to="/patients" className="action-button">📋 View Patients</Link>
        <Link to="/patient-registration" className="action-button">➕ Register Patient</Link>
        <Link to="/records" className="action-button">📄 Medical Records</Link>
        <Link to="/billing" className="action-button">💳 Billing & Payments</Link>
        <Link to="/lab-tests" className="action-button">🧪 Lab Tests & Reports</Link>
      </div>
    </div>
  );
};

export default PatientManagement;