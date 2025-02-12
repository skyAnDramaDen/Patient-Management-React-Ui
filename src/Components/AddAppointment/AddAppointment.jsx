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

  // Search patients as the user types
  useEffect(() => {
    if (patientSearch.length > 1) {
      $.get(`/api/patients?search=${patientSearch}`, (data) => {
        setPatients(data);
      }).fail((err) => console.error("Error fetching patients:", err));
    } else {
      setPatients([]);
    }
  }, [patientSearch]);

  // Fetch available doctors when a time is selected
  useEffect(() => {
    if (appointmentTime) {
      $.get(`/api/doctors?availableAt=${appointmentTime}`, (data) => {
        setDoctors(data);
      }).fail((err) => console.error("Error fetching doctors:", err));
    }
  }, [appointmentTime]);

  // Handle appointment submission
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

      {/* Patient Search */}
      <div className="form-group">
        <label>Search Patient:</label>
        <input
          type="text"
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          placeholder="Enter patient name..."
        />
        {patients.length > 0 && (
          <ul className="dropdown">
            {patients.map((p) => (
              <li key={p.id} onClick={() => setSelectedPatient(p)}>
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Patient */}
      {selectedPatient && <p>Selected Patient: {selectedPatient.name}</p>}

      {/* Appointment Time */}
      <div className="form-group">
        <label>Select Date & Time:</label>
        <input
          type="datetime-local"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />
      </div>

      {/* Available Doctors */}
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

      {/* Submit Button */}
      <button onClick={handleSubmit}>✅ Save Appointment</button>
    </div>
  );
};

export default AddAppointment;