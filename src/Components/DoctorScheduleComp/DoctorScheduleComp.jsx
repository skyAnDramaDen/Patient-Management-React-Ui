import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './DoctorScheduleComp.css';

const DoctorScheduleComp = ({ doctor }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [schedules, setSchedules] = useState([]);

    const dateOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };

    useEffect(() => {
        if (doctor?.appointments) {
            setAppointments(doctor.appointments);
        }

        if (doctor?.schedules) {
            setSchedules(doctor.schedules);
        }
    }, [doctor]);

    if (!doctor) {
        return <div className="error-message">No doctor data available</div>;
    }

    return (
        <div className='doctor-schedule-container'>
            <div className="header-section">
                <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
                <Link 
                    to="/doctor-profile" 
                    state={{ doctor }} 
                    className="edit-button"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="schedule-section">
                <h3>Available Time Slots</h3>
                {schedules.length > 0 ? (
                    <div className="schedule-grid">
                        {schedules.map((schedule, index) => (
                            <div className="time-slot-card" key={index}>
                                <div className="date-badge">
                                    {new Date(schedule.date).toLocaleDateString('en-US', dateOptions)}
                                </div>
                                <div className="time-range">
                                    {schedule.startTime} - {schedule.endTime}
                                </div>
                                <div className="slot-status">
                                    {schedule.isBooked ? 'Booked' : 'Available'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">No schedules available</div>
                )}
            </div>

            <div className="appointments-section">
                <h3>Upcoming Appointments</h3>
                {appointments.length > 0 ? (
                    <div className="appointments-list">
                        {appointments.map((appointment, index) => (
                            <div className="appointment-card" key={index}>
                                <div className="patient-info">
                                    <h4>{appointment.patient?.firstName} {appointment.patient?.lastName}</h4>
                                </div>
                                <div className="appointment-details">
                                    <p className="appointment-date">
                                        {new Date(appointment.date).toLocaleDateString('en-US', dateOptions)}
                                    </p>
                                    <p className="appointment-time">
                                        {appointment.time}
                                    </p>
                                    {appointment.description && (
                                        <p className="appointment-notes">
                                            {appointment.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">No upcoming appointments</div>
                )}
            </div>
        </div>
    );
};

DoctorScheduleComp.propTypes = {
    doctor: PropTypes.object.isRequired,
    schedules: PropTypes.array
};

export default DoctorScheduleComp;