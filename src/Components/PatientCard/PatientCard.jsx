import React from 'react';
import './PatientCard.css';
import { useNavigate, Link } from 'react-router-dom';

export default function PatientCard(props) {
    const navigate = useNavigate();
    const { patient } = props;
  return (
    <div key={patient.id} className="patient-card">
            <div className="patient-info">
              <p className="patient-name">{patient.firstName}</p>
              <p className="patient-name">{patient.lastName}</p>
              <p className="patient-email">✉️ {patient.email}</p>
            </div>

            {/* <Link to={`/patient/${patient.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <button className="view-profile-button">View Profile</button>
      </Link> */}

      <Link
          to={{
              pathname: "/patient/edit",
              state: { patient }
          }}
          style={{ textDecoration: "none", color: "inherit" }}
      >
          <button className="view-profile-button">
              View Profile
          </button>
      </Link>
            
    </div>
  )
}