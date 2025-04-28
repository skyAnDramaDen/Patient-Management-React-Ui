import "./RescheduleAppointment.css";
import React, { useState, useEffect, } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import "react-datepicker/dist/react-datepicker.css";

import { toast, } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function RescheduleAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(location.state?.appointment);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const server_url = process.env.REACT_APP_API_URL;
  const [appointmentDate, setAppointmentDate] = useState();
  const [doctors, setDoctors] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);

  useEffect(() => {
    if (appointmentDate != null) {
      $.ajax({
        url: `${server_url}/doctors/scheduled-for/${appointmentDate}`,
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        success: function (data) {
          if (Array.isArray(data)) {
            setDoctors(data);
          } else {
            setDoctors([]);
          }
          
        },
        error: function (err) {
        }
      });
    }
  }, [appointmentDate])

  const handleRescheduleAppointment = () => {
    if (appointment && appointmentDate && appointmentTime && selectedDoctor) {
      const now = new Date();
      if (appointmentTime <= now) {
        toast.error("Appointment time has to be in the future.")
        return;
      }

      const payload = {
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        date: appointmentDate,
        time: appointmentTime,
        doctorId: selectedDoctor.id,
      }

      $.ajax({
        url: `${server_url}/appointment/reschedule-patient-appointment`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        data: JSON.stringify(payload),
        success: function(response) {
          console.log(response);
          navigate('/appointment-details', { state: { appointment: response.appointment } });
        },
        error: function(error) {
          console.log(error);
        }
      })
    } else {
      if (!appointmentDate) {
        toast.error("There is no appointment date.");
        return;
      }

      if (!appointmentTime) {
        toast.error("There is no appointment time.");
        return;
      }

      if (!selectedDoctor) {
        toast.error("No doctor has been selected.");
        return;
      }
    }
  }

  const handleDoctorChange = (doc) => {
    setSelectedDoctor(doc);
  }

  return (
    <div className="reschedule-appointment-main">
      <PageHeader title="Reschedule Appointment" />

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Appointment rescheduled successfully! Redirecting...
        </div>
      )}

      <div className="current-appointment-info">
        <h3>Current Appointment Details</h3>
        <p>
          <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {appointment.time}
        </p>
        <p>
          <strong>Doctor:</strong> Dr. {appointment.doctor?.firstName}{" "}
          {appointment.doctor?.lastName}
        </p>
        <p>
          <strong>Patient: </strong>
          {appointment.patient.firstName + " " + appointment.patient.lastName}
        </p>
      </div>

      {/* <form onSubmit={handleSubmit} className="reschedule-form">
        <div className="form-group">
          <label htmlFor="appointment-date">Select New Date</label>
          <DatePicker
            id="appointment-date"
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
          />
        </div>

        <div className="form-group">
          <label htmlFor="doctor-select">Select Doctor</label>
          <select
            id="doctor-select"
            value={selectedDoctor?.id || ""}
            onChange={handleDoctorChange}
            disabled={availableDoctors.length === 0}
          >
            <option value="">Select a doctor</option>
            {availableDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialty})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Available Time Slots</label>
          {loading ? (
            <div>Loading time slots...</div>
          ) : availableTimeSlots.length > 0 ? (
            <div className="time-slots-container">
              {availableTimeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`time-slot ${selectedTime === slot ? "selected" : ""}`}
                  // onClick={() => handleTimeSlotSelect(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <div>No available time slots for selected date/doctor</div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !selectedTime}
          >
            {loading ? "Processing..." : "Reschedule Appointment"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form> */}
      <div className="form-group">
        <label>Select Date:</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Select Time:</label>
        <input
          type="time"
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
            handleDoctorChange(doc);
          }}
        >
          <option value="">Select a Doctor</option>
          {doctors && doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr. {doc.firstName} - {doc.specialization}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
        onClick={handleRescheduleAppointment}
        className="reschedule-appointment-btn"
        >Reschedule appointment</button>
      </div>
    </div>
  );
}

export default RescheduleAppointment;