import "./DoctorProfile.css";
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    const { doctor } = location.state || {};

    if (!doctor) {
        return <div className="top-view">
        <button className="back-button" onClick={() => navigate("/staff/doctors")}>
            🔙 Back
        </button>
        <h1>Doctor Profile</h1>
        <p>No doctor data available.</p>
    </div>;
        
        
        
    }
  return (
    <div className="doctor-profile">
      <div className="top-view">
                <button className="back-button" onClick={() => navigate("/staff/doctors")}>
                    🔙 Back
                </button>
                <h1>Doctor Profile</h1>
            </div>
      <div className="doctor-info">
        <p>
          <strong>Name:</strong> {doctor.firstName}{" "}
          {doctor.middleName && `${doctor.middleName} `}{doctor.lastName}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {new Date(doctor.dateOfBirth).toLocaleDateString()}
        </p>
        <p>
          <strong>Gender:</strong> {doctor.gender}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {doctor.phoneNumber}
        </p>
        <div>
          <h3>Address</h3>
          <p>{doctor.addressLine1}</p>
          {doctor.addressLine2 && <p>{doctor.addressLine2}</p>}
          <p>
            {doctor.city}, {doctor.state} {doctor.postalCode}
          </p>
          <p>{doctor.country}</p>
        </div>
        <p>
          <strong>Specialization:</strong> {doctor.specialization}
        </p>
        <p>
          <strong>Medical License Number:</strong> {doctor.medicalLicenseNumber}
        </p>
      </div>
    </div>
  );
};

DoctorProfile.propTypes = {
  doctor: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]).isRequired,
    gender: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    addressLine1: PropTypes.string.isRequired,
    addressLine2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    medicalLicenseNumber: PropTypes.string.isRequired,
  }).isRequired,
};

export default DoctorProfile;
