import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DoctorHome.css";

import $ from "jquery";

const DoctorHome = () => {
  const server_url = process.env.REACT_APP_API_URL;
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

		$.ajax({
			url: `${server_url}/doctors/doctor-appointments/${user.id}`,
			method: "GET",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json"
			},
			success: function(response) {
				setDoctor(response);
				setAppointments(response.appointments);
			},
			error: function(error) {
				console.log(error);
			}
		})
        
      } catch (err) {
        setError("Failed to fetch appointments. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [server_url]);

  const filteredAppointments = appointments.filter(appt => {
    const now = new Date();

    const datePart = new Date(appt.date).toISOString().split('T')[0];
    const apptDate = new Date(`${datePart}T${appt.time}`);
    
    if (filter === "today") {
      return apptDate.toDateString() === now.toDateString();
    }
    if (filter === "upcoming") {
      return apptDate > now;
    }
    if (filter === "completed") {
      return appt.status == "completed";
    }
    return true;
  });

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <h1>
          {doctor 
            ? `Welcome, Dr. ${doctor.firstName} ${doctor.lastName}`
            : 'Doctor Dashboard'}
        </h1>
        <div className="appointment-filters">
          <button
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Appointments
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed Appointments
          </button>
        </div>
      </header>

      <main className="appointments-container">
        <h2 className="section-title">
          {filter === 'today' ? "Today's Appointments" : 
           filter === 'upcoming' ? "Upcoming Appointments" : 
           "All Appointments"}
        </h2>

        {filteredAppointments.length > 0 ? (
          <div className="appointments-grid">
            {filteredAppointments.map((appointment) => (
              <Link
                to="/view-appointment"
                state={{ appointment }}
                key={appointment.id}
                className="appointment-card-link"
              >
                <article className="appointment-card">
                  <div className="card-header">
                    <h3>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </h3>
                    <span className={`status-badge ${appointment.status?.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <p className="appointment-reason">
                      <strong>Reason:</strong> {appointment.reason || "Not specified"}
                    </p>
                    
                    <div className="appointment-time">
                      <span className="date">{formatDate(appointment.date)}</span>
                      <span className="time">{formatTime(appointment.time)}</span>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="card-footer">
                      <p className="appointment-notes">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-appointments">
            <p>No {filter} appointments found.</p>
            {filter !== 'all' && (
              <button 
                className="view-all-btn"
                onClick={() => setFilter('all')}
              >
                View all appointments
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorHome;