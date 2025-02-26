import  { useNavigate } from 'react-router-dom';
import './ViewPatients.css';
import PatientCard from '../PatientCard/PatientCard';
import React, { useState, useEffect } from "react";
import $ from "jquery";
import PageHeader from '../PageHeader/PageHeader';

const ViewPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = () => {
      // $.get('http://localhost:3000/patients', (data) => {
      //   setPatients(data);
      //   setLoading(false);
      // }).fail((err) => {
      //   setError('Failed to fetch patients');
      //   setLoading(false);
      // });

      $.ajax({
        url: 'http://localhost:3000/patients',
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        success: function(response) {
          setPatients(response);
          setLoading(false);
        },
        error: function(error) {
          setError('Failed to fetch patients');
          setLoading(false);
        }
    });
    };

    fetchPatients();
  }, []);

  const handlePatientClick = (patient) => {
    navigate('/patient-profile', { state: { patient } });
  };

  return (
    <div className="view-patients">
      <PageHeader  title="Patients List" backPath="/patient-management"  />
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