import './ManageAppointments.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageAppointments = () => {
  const navigate = useNavigate(); 
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const mockAppointments = [
        { id: 1, date: "2025-02-15", time: "10:00 AM", doctor: "Dr. Smith", patient: "John Doe" },
        { id: 2, date: "2025-02-16", time: "2:00 PM", doctor: "Dr. Brown", patient: "Jane Doe" },
      ];
      setAppointments(mockAppointments);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="manage-appointments">
      <div className='top-view'>
        <button className="back-button" onClick={() => navigate("/patient-management")}>🔙 Back</button>
        <h2>Manage Appointments</h2>
      </div>

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
                  <td>{appt.doctor}</td>
                  <td>{appt.patient}</td>
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