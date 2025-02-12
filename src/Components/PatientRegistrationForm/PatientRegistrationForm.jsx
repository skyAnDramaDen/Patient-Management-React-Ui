import React, { useState } from 'react';
import './PatientRegistrationForm.css';
import { useNavigate, Link } from 'react-router-dom';
import $ from 'jquery';

const PatientRegistrationForm = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        phoneNumber: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        $.post('http://localhost:3000/patients/create', patient, (response) => {
            console.log('Patient created successfully!', response);
            navigate('/patient-profile', { state: { patient: response } });
        }).fail((error) => {
            console.error('There was an error creating the patient!', error);
            alert('Failed to create patient.');
        });
    };

    return (
        <div>
            <div className='top-view'>
        <button
            className="back-button"
            onClick={() => navigate("/patient-management")}
        >
            🔙 Back
        </button>
        <h2>List of Patients</h2>
      </div>
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input type="text" name="firstName" value={patient.firstName} onChange={handleChange} />
            </label>
            <label>
                Last Name:
                <input type="text" name="lastName" value={patient.lastName} onChange={handleChange} />
            </label>
            <label>
                Date of Birth:
                <input type="date" name="dateOfBirth" value={patient.dateOfBirth} onChange={handleChange} />
            </label>
            <label>
                Gender:
                <input type="text" name="gender" value={patient.gender} onChange={handleChange} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={patient.email} onChange={handleChange} />
            </label>
            <label>
                Phone Number:
                <input type="text" name="phoneNumber" value={patient.phoneNumber} onChange={handleChange} />
            </label>
            <label>
                Address Line 1:
                <input type="text" name="addressLine1" value={patient.addressLine1} onChange={handleChange} />
            </label>
            <label>
                City:
                <input type="text" name="city" value={patient.city} onChange={handleChange} />
            </label>
            <label>
                State:
                <input type="text" name="state" value={patient.state} onChange={handleChange} />
            </label>
            <label>
                Postal Code:
                <input type="text" name="postalCode" value={patient.postalCode} onChange={handleChange} />
            </label>
            <label>
                Country:
                <input type="text" name="country" value={patient.country} onChange={handleChange} />
            </label>
            <button type="submit">Save</button>
        </form>
        </div>
    );
};

export default PatientRegistrationForm;
