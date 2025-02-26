import "./AddDoctor.css";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import $ from 'jquery';

const AddDoctorForm = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "doctor"
  });
  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    specialization: "",
    medicalLicenseNumber: "",
    yearsOfExperience: "",
    education: "",
    certifications: "",
    hospitalAffiliations: "",
    languagesSpoken: "",
    biography: ""
  });

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleUserData = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        doctor: doctor,
        user: newUser
    }

    $.ajax({
      url: 'http://localhost:3000/doctors/create',
      method: 'POST',
      headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
      },
      data: JSON.stringify(payload),
      success: function(response) {
          console.log('Doctor created successfully!', response);
          navigate('/doctor-profile', { state: { patient: response } });
      },
      error: function(error) {
          console.error('There was an error creating the patient!', error);
          alert('Failed to create patient.');
      }
    });

    setDoctor({
      // firstName: "",
      // lastName: "",
      // middleName: "",
      // dateOfBirth: "",
      // gender: "",
      // email: "",
      // phoneNumber: "",
      // addressLine1: "",
      // addressLine2: "",
      // city: "",
      // state: "",
      // postalCode: "",
      // country: "",
      // specialization: "",
      // medicalLicenseNumber: "",
      role: "doctor"
    });
  };

  return (
    <div>
      <div className="top-view">
        <button className="back-button" onClick={() => navigate("/staff/doctors")}>
          🔙 Back
        </button>
        <h2>Add Doctor</h2>
      </div>
      <form onSubmit={handleSubmit} className="add-doctor-form">
        <h3>Add Doctor</h3>
        <input type="text" name="firstName" placeholder="First Name" value={doctor.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={doctor.lastName} onChange={handleChange} required />
        <input type="text" name="middleName" placeholder="Middle Name" value={doctor.middleName} onChange={handleChange} />
        <input type="date" name="dateOfBirth" value={doctor.dateOfBirth} onChange={handleChange} required />
        <select name="role" value={doctor.gender} onChange={handleChange} required>
          <option value="select" disabled>Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="email" name="email" placeholder="Email" value={doctor.email} onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={doctor.phoneNumber} onChange={handleChange} required />
        <input type="text" name="addressLine1" placeholder="Address Line 1" value={doctor.addressLine1} onChange={handleChange} required />
        <input type="text" name="addressLine2" placeholder="Address Line 2" value={doctor.addressLine2} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={doctor.city} onChange={handleChange} required />
        <input type="text" name="state" placeholder="State" value={doctor.state} onChange={handleChange} required />
        <input type="text" name="postalCode" placeholder="Postal Code" value={doctor.postalCode} onChange={handleChange} required />
        <input type="text" name="country" placeholder="Country" value={doctor.country} onChange={handleChange} required />
        <input type="text" name="specialization" placeholder="Specialization" value={doctor.specialization} onChange={handleChange} required />
        <input type="text" name="medicalLicenseNumber" placeholder="Medical License Number" value={doctor.medicalLicenseNumber} onChange={handleChange} required />

        <input type="text" name="username" placeholder="Username" value={newUser.username} onChange={handleUserData} required />
        <input type="text" name="password" placeholder="Password" value={newUser.password} onChange={handleUserData} required />
        <label>Role:</label>
        <select name="role" value={newUser.role} onChange={handleUserData} required>
          <option value="super-admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
        </select>
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctorForm;
