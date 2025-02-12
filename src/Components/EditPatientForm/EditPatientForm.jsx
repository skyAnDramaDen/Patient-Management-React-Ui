import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditPatientForm.css';
import $ from 'jquery';

const EditPatientForm = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(state ? state.patient : null);

    useEffect(() => {
        if (!state) {
            // Redirect to a safe page or display an error message if state is null
            navigate('/');
        }
    }, [state, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        $.post(`http://localhost:8000/patients/update`, patient, (response) => {
            console.log('Patient updated successfully!', response);
            navigate('/patient-profile', { state: { patient: response } });
        }).fail((error) => {
            console.error('There was an error updating the patient!', error);
            alert('Failed to update patient.');
        });
    };

    if (!patient) {
        return <p>Loading patient data...</p>; // Add a fallback if patient is null
    }

    return (
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
    );
};

export default EditPatientForm;
