import  { useNavigate } from 'react-router-dom';
import './ViewPatients.css';
import PatientCard from '../PatientCard/PatientCard';
import React, { useState, useEffect } from "react";
import $ from "jquery";

const ViewPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = () => {
      $.get('http://localhost:3000/patients', (data) => {
        console.log(data);
        setPatients(data);
        setLoading(false);
      }).fail((err) => {
        setError('Failed to fetch patients');
        setLoading(false);
      });
    };

    fetchPatients();
  }, []);

  const handlePatientClick = (patient) => {
    navigate('/patient-profile', { state: { patient } });
  };

  return (
    <div className="view-patients">
      <div className='top-view'>
        <button
            className="back-button"
            onClick={() => navigate("/patient-management")}
        >
            🔙 Back
        </button>
        <h2>List of Patients</h2>
      </div>
      <div className="patient-list">
        {patients.map((patient) => (
            <div key={patient.id} onClick={() => handlePatientClick(patient)}>
              <PatientCard patient={patient} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPatients;