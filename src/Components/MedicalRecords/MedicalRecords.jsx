import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import "./MedicalRecords.css";

export default function MedicalRecords() {
  const [ medicalRecords, setMedicalRecords ] = useState([]);
  const [ patientSearch, setPatientSearch ] = useState("");
  const [ patients, setPatients ] = useState([]);
  const [ patientsList, setPatientsList ] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [ selectedPatient, setSelectedPatient ] = useState(null);

  useEffect(() => {
    console.log("Updated medicalRecords:", medicalRecords);
  }, [medicalRecords]);
  

  useEffect(() => {
    if (patientSearch.length > 1) {
      $.ajax({
        url: `http://localhost:3000/medicalRecords/get-medical-record-by-patients-name?search=${patientSearch}`,
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        success: function (data) {
          console.log(data);
          console.log(medicalRecords);
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

  useEffect(() => {
    $.ajax({
      url: 'http://localhost:3000/patients',
      method: 'GET',
      headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
      },
      // data: JSON.stringify(),
      success: function(response) {
          console.log(response);
          setPatientsList(response);
          console.log("medical records");
          console.log(patientsList);
      },
      error: function(error) {
          console.error('There was an error fetching the medical records!', error);
      }
    });
  }, [])

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch("");
    setPatients([]);
  };


  return (
    <div className="medical-records">
      <PageHeader title="Medical Records"/>
      <p>Search for a patients name to view or modify medical records.</p>
      <input
          type="text"
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          placeholder="Enter patient name..."
        />
        {Array.isArray(patients) && patients.length > 0 && (
          <ul className="dropdown">
            {patients.map((p) => (
              <Link to = "/patient-medical-record"
              state= {{ medical_record: p.medical_record ? p.medical_record : null }}
              style={{ textDecoration: "none", color: "inherit" }}
              key = {p.medical_record.id}>
              <li >
                {"PTN" + p.id + " " + p.firstName + " " + p.lastName}
              </li>
              </Link>
            ))}
          </ul>
        )}
      { patientsList.map((patient) => 
         (
          //use method below for passing state properly
          <Link
          to = "/patient-medical-record"
          state= {{ patient }}
          style={{ textDecoration: "none", color: "inherit" }}
          key = {patient.id}
          >
          <div key={patient.id} className="record-card">
            <p><span>{patient.id}.</span> {patient.firstName} {patient.lastName}</p>
          </div></Link>
        )
      )
      }

    </div>
  )
}
