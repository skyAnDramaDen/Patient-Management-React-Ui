import './PatientManagement.css';

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from '../PageHeader/PageHeader';

import { AuthContext } from "../../Authcontext";

const PatientManagement = () => {
  const navigate = useNavigate();
	const { user, socket } = useContext(AuthContext);

  return (
    <div className="patient-management">

      <PageHeader  title="Patient Management" backPath={user.role == "doctor" ? "/doctor-home" : user.role == "nurse" ? "/nurse-home" : "/"}/>

      <div className="patient-actions">
        <Link to="/patients" className="action-button">📋 Patients</Link>
        <Link to="/patient-registration" className="action-button">➕ Register Patient</Link>
        <Link to="/medical-records" className="action-button">📄 Medical Records</Link>
        {/* <Link to="/billing" className="action-button">💳 Billing & Payments</Link> */}
        <Link to="/lab-tests" className="action-button">🧪 Lab Tests & Reports</Link>
      </div>
    </div>
  );
};

export default PatientManagement;