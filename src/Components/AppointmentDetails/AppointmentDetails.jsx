import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AppointmentDetails.css';

const AppointmentDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = useLocation();

    const appointment = location.state.appointment;

    return (
        <div className="appointment-details">
            <h2>Appointment Details</h2>
            <div className="detail">
                <strong>Date:</strong> {appointment.date}
            </div>
            <div className="detail">
                <strong>Time:</strong> {appointment.time}
            </div>
            <div className="detail">
                <strong>Status:</strong> {appointment.status}
            </div>
            <div className="detail">
                <strong>Doctor ID:</strong> {appointment.doctorId}
            </div>
            <div className="detail">
                <strong>Patient ID:</strong> {appointment.patientId}
            </div>
            <div className="buttons">
                <button onClick={() => navigate(-1)}>Back</button>
                <button onClick={() => navigate(`/edit-appointment/${appointment.id}`)}>Edit Appointment</button>
            </div>
        </div>
    );
};

export default AppointmentDetails;