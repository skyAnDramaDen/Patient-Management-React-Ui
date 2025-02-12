import './PatientProfile.css';
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const PatientProfile = () => {
    const { state } = useLocation();
    const patient = state ? state.patient : null;
    const navigate = useNavigate();

    if (!state) {
        return <p>hello there</p>;
    }

    if (!patient) {
        return <p>Loading patient data...</p>;
    }

    console.log(patient);

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

            {/* Personal Information */}
            <section className="profile-section personal-info">
                <h3 className="section-title">Personal Information</h3>
                <div className="section-content">
                    <p><strong>Name:</strong> {patient.firstName}</p>
                    <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Blood Type:</strong> {patient.bloodType}</p>
                    <p><strong>Marital Status:</strong> {patient.maritalStatus}</p>
                    <p><strong>Nationality:</strong> {patient.nationality}</p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="profile-section contact-info">
                <h3 className="section-title">Contact Information</h3>
                <div className="section-content">
                    <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Address:</strong> {patient.addressLine1}</p>
                    {patient.emergencyContact && (
                        <>
                            <p><strong>Emergency Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relation})</p>
                            <p><strong>Emergency Phone:</strong> {patient.emergencyContact.phone}</p>
                        </>
                    )}
                </div>
            </section>

            {/* Medical History */}
            <section className="profile-section medical-history">
                <h3 className="section-title">Medical History</h3>
                <div className="section-content">
                    {patient.chronicConditions && <p><strong>Chronic Conditions:</strong> {patient.chronicConditions.join(", ")}</p>}
                    {patient.allergies && <p><strong>Allergies:</strong> {patient.allergies.join(", ")}</p>}
                    {patient.medications && <p><strong>Medications:</strong> {patient.medications.join(", ")}</p>}
                    {patient.pastSurgeries && <p><strong>Past Surgeries:</strong> {patient.pastSurgeries.join(", ")}</p>}
                    {patient.familyMedicalHistory && <p><strong>Family Medical History:</strong> {patient.familyMedicalHistory}</p>}
                </div>
            </section>

            {/* Insurance Information */}
            <section className="profile-section insurance-info">
                <h3 className="section-title">Insurance Information</h3>
                <div className="section-content">
                    {patient.insurance && (
                        <>
                            <p><strong>Provider:</strong> {patient.insurance.provider}</p>
                            <p><strong>Policy Number:</strong> {patient.insurance.policyNumber}</p>
                            <p><strong>Coverage Details:</strong> {patient.insurance.coverageDetails}</p>
                        </>
                    )}
                </div>
            </section>

            {/* Recent Visits */}
            <section className="profile-section recent-visits">
                <h3 className="section-title">Recent Visits</h3>
                <div className="section-content">
                    {patient.recentVisits && patient.recentVisits.map((visit, index) => (
                        <div key={index} className="visit-card">
                            <p><strong>Date:</strong> {visit.date}</p>
                            <p><strong>Doctor:</strong> {visit.doctor}</p>
                            <p><strong>Reason:</strong> {visit.reason}</p>
                            <p><strong>Notes:</strong> {visit.notes}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Billing Information */}
            <section className="profile-section billing-info">
                <h3 className="section-title">Billing Information</h3>
                <div className="section-content">
                    {patient.billing && (
                        <>
                            <p><strong>Outstanding Balance:</strong> ${patient.billing.outstandingBalance}</p>
                            <p><strong>Last Payment:</strong> {patient.billing.lastPaymentDate}</p>
                            <p><strong>Next Due Date:</strong> {patient.billing.nextDueDate}</p>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PatientProfile;
