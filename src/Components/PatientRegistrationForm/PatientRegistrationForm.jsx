import React, { useState } from 'react';
import './PatientRegistrationForm.css';
import { useNavigate, Link } from 'react-router-dom';
import $ from 'jquery';
import PageHeader from '../PageHeader/PageHeader';

const PatientRegistrationForm = () => {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        role: "patient"
      });
    const [patient, setPatient] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'select',
        email: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',

        medicalHistory: '',
        allergies: '',
        currentMedications: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        primaryCarePhysician: '',
        insuranceProvider: '',
        insurancePolicyNumber: '',
        occupation: '',
        maritalStatus: '',
        bloodType: '',
        height: '',
        weight: '',
        notes: '',
        ethnicity: ''
    });
    

    const handleUserData = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
      };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
    };

    

    const cleanData = (data) => {
        for (const key in data) {
          if (data[key] === "") {
            data[key] = null;
          }
        }
        return data;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleaned_patient_data = cleanData(patient); 

        const payload = {
            patient: cleaned_patient_data,
            user: newUser
        }
        
        console.log(payload);
        
        if (!payload.patient.firstName || !payload.patient.lastName) {
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/patients/create',
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: function(response) {
                console.log('Patient created successfully!', response);
                navigate('/patient-profile', { state: { patient: response } });
            },
            error: function(error) {
                console.error('There was an error creating the patient!', error);
                alert('Failed to create patient.');
            }
        });
    };

    return (
        <div className='patient-registration'>
            <PageHeader  title="Registration Form" backPath="/patient-management"  />
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
                    <select name="gender" value={patient.gender} onChange={handleChange} required>
                        <option value="select" disabled>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
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
                    Address Line 2:
                    <input type="text" name="addressLine2" value={patient.addressLine2} onChange={handleChange} />
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
                <label>
                    Username:
                    <input type="text" name="username" value={newUser.name} onChange={handleUserData} />
                </label>
                <label>
                    Password:
                    <input type="text" name="password" value={newUser.password} onChange={handleUserData} />
                </label>
                {/* <label>
                    <select name="role" value={newUser.role} onChange={handleUserData} required>
                        <option value="patient">Patient</option>
                        <option value="super-admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                    </select>
                </label> */}
                <label>
                    Medical History:
                    <textarea name="medicalHistory" value={patient.medicalHistory} onChange={handleChange}></textarea>
                </label>
                <label>
                    Allergies:
                    <textarea name="allergies" value={patient.allergies} onChange={handleChange}></textarea>
                </label>
                <label>
                    Current Medications:
                    <textarea name="currentMedications" value={patient.currentMedications} onChange={handleChange}></textarea>
                </label>
                <label>
                    Emergency Contact Name:
                    <input type="text" name="emergencyContactName" value={patient.emergencyContactName} onChange={handleChange} />
                </label>
                <label>
                    Emergency Contact Phone:
                    <input type="text" name="emergencyContactPhone" value={patient.emergencyContactPhone} onChange={handleChange} />
                </label>
                <label>
                    Primary Care Physician:
                    <input type="text" name="primaryCarePhysician" value={patient.primaryCarePhysician} onChange={handleChange} />
                </label>
                <label>
                    Insurance Provider:
                    <input type="text" name="insuranceProvider" value={patient.insuranceProvider} onChange={handleChange} />
                </label>
                <label>
                    Insurance Policy Number:
                    <input type="text" name="insurancePolicyNumber" value={patient.insurancePolicyNumber} onChange={handleChange} />
                </label>
                <label>
                    Occupation:
                    <input type="text" name="occupation" value={patient.occupation} onChange={handleChange} />
                </label>
                <label>
                    Marital Status:
                    <input type="text" name="maritalStatus" value={patient.maritalStatus} onChange={handleChange} />
                </label>
                <label>
                    Blood Type:
                    <input type="text" name="bloodType" value={patient.bloodType} onChange={handleChange} />
                </label>
                <label>
                    Height:
                    <input type="number" step="0.01" name="height" value={patient.height} onChange={handleChange} />
                </label>
                <label>
                    Weight:
                    <input type="number" step="0.01" name="weight" value={patient.weight} onChange={handleChange} />
                </label>
                <label>
                    Notes:
                    <textarea name="notes" value={patient.notes} onChange={handleChange}></textarea>
                </label>
                <label>
                    Ethnicity:
                    <input type="text" name="ethnicity" value={patient.ethnicity} onChange={handleChange} />
                </label>


                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default PatientRegistrationForm;
