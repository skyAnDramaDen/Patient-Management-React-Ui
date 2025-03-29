import "./DischargePatient.css";

import React, { useState, useEffect, use } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom"; 

import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

function DischargePatient() {
    const location = useLocation();
    const [patient, setPatient] = useState(null);
    const [admission, setAdmission] = useState(null);
    const [admittedFor, setAdmittedFor] = useState();
	const server_url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        console.log();
        $.ajax({
            url: `${server_url}/billingCategory/`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                // console.log(response);
            },
            error: function(error) {
                console.timeLog(error);
            }
        })
    }, [])

    useEffect(() => {
        if (location) {
            setPatient(location.state.admission.admissionPatient)
            setAdmission(location.state.admission);
        }
    }, [location])

    useEffect(() => {
        if (admission) {
            const admissionDate = new Date(admission.admissionDate);
            
            const now = new Date();

            const diff_in_milliseconds = now - admissionDate;
            
            const diffInDays = Math.floor(diff_in_milliseconds / (1000 * 60 * 60 * 24));
            
            setAdmittedFor(diffInDays);
        }
    }, [admission])
  return (
    <div className="discharge-patient">
        <PageHeader title="Discharge Patient" />
        <div>
            <div>
                {
                    admission && <div>
                        Name: {patient && patient.firstName + " " + patient.lastName}
                        <div>
                            <strong>Admitted on:</strong> {admission.admissionDate}
                            {
                                admittedFor && <div>
                                    <strong>Admitted for:</strong> {admittedFor} Days
                                </div>
                            }
                        </div>
                    </div>
                }

            </div>
        </div>
      
    </div>
  )
}

export default DischargePatient
