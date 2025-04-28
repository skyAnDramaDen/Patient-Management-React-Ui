import "./NurseScheduleComp.css";

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './NurseScheduleComp.css';

const NurseScheduleComp = ({ nurse }) => {
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
        if (nurse.schedules) {
            setSchedules(nurse.schedules);
        }
    }, [nurse]);

    if (!nurse) {
        return <div className="error-message">No nurse data available</div>;
    }

    return (
        <div className='doctor-schedule-container'>
            <div className="header-section">
                <h2>Nurse {nurse.firstName} {nurse.lastName}</h2>
                <Link 
                    to="/nurse-profile" 
                    state={{ nurse }} 
                    className="edit-button"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="schedule-section">
                <h3>Scheduled for</h3>
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
        </div>
    );
};

NurseScheduleComp.propTypes = {
    nurse: PropTypes.object.isRequired,
    schedules: PropTypes.array
};

export default NurseScheduleComp;
