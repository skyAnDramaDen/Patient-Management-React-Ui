import './ManageAppointments.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import PageHeader from '../PageHeader/PageHeader';

const ManageAppointments = () => {
  const navigate = useNavigate(); 
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    $.ajax({
      url: 'http://localhost:3000/appointment',
      method: 'GET',
      headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
      },
      success: function(response) {
          setAppointments(response);
          console.log(response);
      },
      error: function(error) {
          console.error('There was an error fetching the appointments!', error);
      }
  });

  }, []);

  return (
    <div className="manage-appointments">

      <PageHeader title="Manage Appointments" />

      <div className="appointment-actions">
        <Link to="/appointments/new" className="action-button">➕ Add New Appointment</Link>
      </div>

      <div className="upcoming-appointments">
        <h3>Upcoming Appointments</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Patient</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  {/* <td>DR. {appt.Doctor.firstName}</td> */}
                  {/* <td>{appt.Patient.firstName + " " + appt.Patient.lastName}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No upcoming appointments</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAppointments;