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
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = () => {
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

  useEffect(() => {
    if (patientSearch.length > 1) {
      // console.log(`Searching for patients with: ${patientSearch}`);
      $.ajax({
        url: `http://localhost:3000/patients/get-patients-by-name?search=${patientSearch}`,
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        success: function (data) {
          if (Array.isArray(data)) {
            setPatients(data);
          } else {
            setPatients([]);
          }
        },
        error: function (err) {
          console.error("Error fetching patients:", err);
          setPatients([]);
        }
      });
    } else {
      setPatients([]);
    }
  }, [patientSearch]);

  const handlePatientClick = (patient) => {
    navigate('/patient-profile', { state: { patient } });
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch("");
    setPatients([]);
  };

  return (
    <div className="view-patients">
      <PageHeader  title="Patients" backPath="/patient-management"  />
      <div className="form-group">
        <label>Search Patient:</label>
        <input
          type="text"
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          placeholder="Enter patient name..."
        />
        {Array.isArray(searchedPatients) && searchedPatients.length > 0 && (
          <ul className="dropdown">
            {searchedPatients.map((p) => (
              <li key={p.id} onClick={() => handlePatientSelect(p)}>
                {p.firstName + " " + p.lastName}
              </li>
            ))}
          </ul>
        )}
        {Array.isArray(patients) && patients.length === 0 && patientSearch.length > 1 && (
          <ul className="dropdown">
            <li>No patients found</li>
          </ul>
        )}
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