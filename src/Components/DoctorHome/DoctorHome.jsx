import React, { useContext, useState, useEffect } from "react";
import "./DoctorHome.css";
import { AuthContext } from "../../Authcontext";
import $ from "jquery";

const DoctorHome = () => {
  const server_url = process.env.REACT_APP_API_URL;
  const [appointments, setAppointments] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState("");
  const [ user, setUser ] = useState(null);
  const [ doctor, setDoctor ] = useState(null);


  useEffect(() => {
    const user =  JSON.parse(localStorage.getItem("user"));
    setUser(user)

    $.ajax({
      url: `${server_url}/doctors/doctor-appointments/${user.id}`,
      method: 'GET',
      headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
      },
      success: function(response) {
        setAppointments(response.Appointments);
        setDoctor(response);
        setIsLoading(false);
      },
      error: function(error) {
        setError('Failed to fetch patients');
        setIsLoading(false);
      }
    });

  }, []);

  return (
    <div className="doctor-home staff-management">
      <div
        className="doctor-header"
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}
      >
        <div className="doctor-name">
          {doctor && doctor.firstName ? `Welcome Dr. ${doctor.firstName}` : "Doctor"}
        </div>
      </div>


      <h2>Upcoming Appointments</h2>
      <div className="appointments-list">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="appointment-card"
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "15px",
                margin: "10px 0",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
              }}
            >
              <h3>{appointment.patientName}</h3>
              <p>
                <strong>Patient:</strong> {appointment.Patient.firstName + " " + appointment.Patient.lastName}
              </p>
              <p>
                <strong>Time:</strong> {appointment.time}
              </p>
            </div>
          ))
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorHome;
