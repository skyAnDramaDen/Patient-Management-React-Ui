import './PatientProfile.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import $ from "jquery";

const PatientProfile = () => {
    const { state } = useLocation();
    const state_patient = state ? state.patient : null;
    const [patient, setPatient] = useState(null);
    const navigate = useNavigate();

    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        dateOfBirth: "",
        gender: "",
        bloodType: "",
        maritalStatus: "",
        nationality: "",
        phoneNumber: "",
        email: "",
        addressLine1: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        chronicConditions: "",
        medications: "",
        pastSurgeries: "",
        familyMedicalHistory: "",
        insuranceProvider: "",
        policyNumber: "",
        coverageDetails: ""
      });
      

    useEffect(() => {
        if (state_patient) {
            setPatient(state_patient);
        }
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        setIsSaveDisabled(false);
    };

    const handleSave = () => {
        $.ajax({
          url: `http://localhost:3000/patients/edit/${patient.id}`,
          method: 'PUT',
          headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
          },
          data: JSON.stringify(formData),
          success: function(response) {
              console.log('Patient updated successfully!', response);
              navigate('/patient-profile', { state: { patient: response } });
          },
          error: function(error) {
              console.error('There was an error updating  the patient!', error);
              alert('Failed to create patient.');
          }
        });
        console.log("Saving patient data:", formData);
        
        setIsSaveDisabled(true);
        alert("Patient details saved successfully!");
      };

    if (!state) {
        return <p>hello there</p>;
    }

    if (!patient) {
        return <p>Loading patient data...</p>;
    }


    return (
        <div className="patient-profile">
            <div className="top-view">
                <button
                    className="back-button"
                    onClick={() => navigate("/patients")} // Navigate back to Patient Management page
                >
                    🔙 Back
                </button>
                <h2 className="patient-profile-title">Patient Profile</h2>

                <Link to="/patient/edit" state={{ patient }} style={{ textDecoration: "none", color: "inherit" }}>
                    <button>Edit</button>
                </Link>
            </div>

            <form>
                {/* Personal Information */}
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={patient.firstName || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={patient.dateOfBirth || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <input
                        type="text"
                        name="gender"
                        value={patient.gender || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Blood Type:</label>
                    <input
                        type="text"
                        name="bloodType"
                        value={patient.bloodType || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Marital Status:</label>
                    <input
                        type="text"
                        name="maritalStatus"
                        value={patient.maritalStatus || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Nationality:</label>
                    <input
                        type="text"
                        name="nationality"
                        value={patient.nationality || ""}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Contact Information */}
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={patient.phoneNumber || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={patient.email || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="addressLine1"
                        value={patient.addressLine1 || ""}
                        onChange={handleInputChange}
                    />
                </div>
                {patient.emergencyContact && (
                    <>
                        <div>
                            <label>Emergency Contact:</label>
                            <input
                                type="text"
                                name="emergencyContactName"
                                value={patient.emergencyContact.name || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Emergency Phone:</label>
                            <input
                                type="text"
                                name="emergencyContactPhone"
                                value={patient.emergencyContact.phone || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                )}

                {/* Medical History */}
                {patient.chronicConditions && (
                    <div>
                        <label>Chronic Conditions:</label>
                        <input
                            type="text"
                            name="chronicConditions"
                            value={patient.chronicConditions.join(", ") || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
                {/* {patient.allergies && (
                    <div>
                        <label>Allergies:</label>
                        <input
                            type="text"
                            name="allergies"
                            value={patient.allergies.join(", ") || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                )} */}
                {patient.medications && (
                    <div>
                        <label>Medications:</label>
                        <input
                            type="text"
                            name="medications"
                            value={patient.medications.join(", ") || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
                {patient.pastSurgeries && (
                    <div>
                        <label>Past Surgeries:</label>
                        <input
                            type="text"
                            name="pastSurgeries"
                            value={patient.pastSurgeries.join(", ") || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
                {patient.familyMedicalHistory && (
                    <div>
                        <label>Family Medical History:</label>
                        <textarea
                            name="familyMedicalHistory"
                            value={patient.familyMedicalHistory || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                {/* Insurance Information */}
                {patient.insurance && (
                    <>
                        <div>
                            <label>Provider:</label>
                            <input
                                type="text"
                                name="insuranceProvider"
                                value={patient.insurance.provider || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Policy Number:</label>
                            <input
                                type="text"
                                name="policyNumber"
                                value={patient.insurance.policyNumber || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Coverage Details:</label>
                            <textarea
                                name="coverageDetails"
                                value={patient.insurance.coverageDetails || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                )}

                {/* Save Button */}
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default PatientProfile;
