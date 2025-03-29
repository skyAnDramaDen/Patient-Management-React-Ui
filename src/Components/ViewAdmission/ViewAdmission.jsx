import "./ViewAdmission.css";

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

function ViewAdmission() {
    const location = useLocation();
    const [admission, setAdmission] = useState(null);
	const server_url = process.env.REACT_APP_API_URL;
    const [ward, setWard] = useState(null);
    const [patient, setPatient] = useState();

    useEffect(() => {
        let admission_id = location.state.admission.id;

        $.ajax({
            url: `${server_url}/admissions/view-admission/${admission_id}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                // console.log(response);
                setPatient(response.admissionPatient);
                setAdmission(response);
            },
            error: function(error) {
                console.log(error);
            }
        })
        
    }, [])

    useEffect(() => {
        if (admission) {
            setWard(admission.wardAdmissions[0].ward);
        }
    }, [admission])

    const handleDischarge = () => {
        // console.log();
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        const options = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            {
                admission && <div className="view-admission-container">
                <div className="admission-header">
                    <PageHeader title="Admission Details" />
                
                  <div className="admission-meta">
                    {/* <span className="admission-id">Admission ID: {admission.id}</span> */}
                    <span className={`status-badge ${admission.status.toLowerCase()}`}>
                      {admission.status}
                    </span>
                    <Link
                    to="/discharge-patient"
                    state={{admission}}
                    >
                    <button>Discharge Patient</button>
                    </Link>
                  </div>
                </div>
            
                <div className="admission-content">
                    
                  <div className="info-card patient-card">
                    <h3>Patient Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Patient ID:</label>
                        <span>{admission.admissionPatient?.id}</span>
                      </div>
                      <div className="info-item">
                        <label>Full Name:</label>
                        <span>{admission.admissionPatient?.firstName} {admission.admissionPatient?.lastName}</span>
                      </div>
                      <div className="info-item">
                        <label>Date of Birth:</label>
                        <span>{formatDate(admission.admissionPatient?.dateOfBirth)}</span>
                      </div>
                      <div className="info-item">
                        <label>Gender:</label>
                        <span>{admission.admissionPatient?.gender}</span>
                      </div>
                      <div className="info-item">
                        <label>Contact:</label>
                        <span>{admission.admissionPatient?.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
            
            
                  <div className="info-card admission-details">
                    <h3>Admission Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Admission Date:</label>
                        <span>{formatDateTime(admission.admissionDate)}</span>
                      </div>
                      <div className="info-item">
                        <label>Discharge Date:</label>
                        <span>{admission.dischargeDate ? formatDateTime(admission.dischargeDate) : 'Not discharged'}</span>
                      </div>
                      <div className="info-item">
                        <label>Reason:</label>
                        <span>{admission.reasonForAdmission || 'Not specified'}</span>
                      </div>
                      <div className="info-item">
                        <label>Attending Physician:</label>
                        <span>{admission.attendingPhysician || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
            
                  <div className="info-card ward-card">
                    <h3>Ward Assignment</h3>
                    {ward ? (
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Ward:</label>
                          <span>{ward.name} (Floor {ward.floor.floorNumber})</span>
                        </div>
                      </div>
                    ) : (
                      <p>No ward assigned</p>
                    )}
                  </div>
            
                  {/* Additional Notes Section */}
                  <div className="info-card notes-card">
                    <h3>Additional Notes</h3>
                    <div className="notes-content">
                      {admission.notes ? (
                        <p>{admission.notes}</p>
                      ) : (
                        <p className="no-notes">No additional notes recorded</p>
                      )}
                    </div>
                  </div>
                </div>
            
                {/* Action Buttons */}
                <div className="action-buttons">
                  {/* <button className="btn secondary" onClick={handleGoBack}>
                    Back to List
                  </button> */}
                  {admission.status === 'ACTIVE' && (
                    <>
                      {/* <button className="btn primary" onClick={handleEdit}>
                        Edit Admission
                      </button> */}
                      <button className="btn danger" onClick={handleDischarge}>
                        Discharge Patient
                      </button>
                    </>
                  )}
                </div>
              </div>
            }
        </div>
      );
}

export default ViewAdmission
