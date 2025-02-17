import './AddAppointment.css';
import React, { useState, useEffect } from "react";
import $ from "jquery";

const AddAppointment = () => {
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  
  useEffect(() => {
    if (patientSearch.length > 1) {
      console.log(`Searching for patients with: ${patientSearch}`);
      $.get(`http://localhost:3000/patients/get-patients-by-name?search=${patientSearch}`, (data) => {
        console.log("Received patients data:", data);
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          setPatients([]);
        }
      }).fail((err) => {
        console.error("Error fetching patients:", err);
        setPatients([]); 
      });
    } else {
      setPatients([]);
    }
  }, [patientSearch]);

  
  useEffect(() => {
    if (appointmentTime) {
      console.log(`Fetching doctors available at: ${appointmentTime}`);
      $.get(`/api/doctors?availableAt=${appointmentTime}`, (data) => {
        console.log("Received doctors data:", data);
        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          setDoctors([]);
        }
      }).fail((err) => {
        console.error("Error fetching doctors:", err);
        setDoctors([]); 
      });
    }
  }, [appointmentTime]);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient || !selectedDoctor || !appointmentTime) {
      alert("Please fill all fields!");
      return;
    }

    const appointmentData = {
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      appointmentTime,
    };

    $.post("/api/appointments", appointmentData)
      .done(() => alert("Appointment created successfully!"))
      .fail((err) => console.error("Error creating appointment:", err));
  };

  return (
    <div className="add-appointment">
      <h2>➕ Add New Appointment</h2>


      <div className="form-group">
        <label>Search Patient:</label>
        <input
          type="text"
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          placeholder="Enter patient name..."
        />
        {Array.isArray(patients) && patients.length > 0 && (
          <ul className="dropdown">
            {patients.map((p) => (
              <li key={p.id} onClick={() => setSelectedPatient(p)}>
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>


      {selectedPatient && <p>Selected Patient: {selectedPatient.name}</p>}


      <div className="form-group">
        <label>Select Date & Time:</label>
        <input
          type="datetime-local"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />
      </div>


      <div className="form-group">
        <label>Select Doctor:</label>
        <select
          value={selectedDoctor?.id || ""}
          onChange={(e) => {
            const doc = doctors.find((d) => d.id === parseInt(e.target.value));
            setSelectedDoctor(doc);
          }}
        >
          <option value="">Select a Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} - {doc.specialty}
            </option>
          ))}
        </select>
      </div>


      <button onClick={handleSubmit}>✅ Save Appointment</button>
    </div>
  );
};

export default AddAppointment;
