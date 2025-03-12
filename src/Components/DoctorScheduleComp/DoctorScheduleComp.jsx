import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './DoctorScheduleComp.css';

const DoctorScheduleComp = ({ doctor }) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const [ appointments, setAppointments ] = useState([]);

    useEffect(() => {
        console.log(doctor);
        setAppointments(doctor.appointments);
    })
  return (
    <div className='outer-container'>
        <Link to="/doctor-profile" state={{ doctor }} style={{ textDecoration: "none", color: "inherit" }}>
            <button class="edit-button">📝 Edit</button>
        </Link>
        
        <div className="doctor-schedules">
            <h2>Schedule:</h2>
            <div className="schedule-list">
                {doctor.schedules.map((schedule, index) => (
                <div className="schedule-item" key={index}>
                    <p>Date: {
                        new Date(schedule.date).toLocaleDateString('en-GB', options)
                    }</p>
                    <p>Start: {schedule.startTime}</p>
                    <p>End: {schedule.endTime}</p>
                </div>
                ))}
            </div>
        </div>
        <div className="appointments">
            <h2>Appointments</h2>
            <div className="appointment-list">
                {appointments && appointments ? (appointments.map((appointment, index) => (
                <div className="appointment-item" key={index}>
                    <h3>{appointment.patient.firstName}</h3>
                    <p>{appointment.date}</p>
                    <p>{appointment.time}</p>
                    <p>{appointment.description}</p>
                </div>
                ))) : (
                    <p>no appointments</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default DoctorScheduleComp;
