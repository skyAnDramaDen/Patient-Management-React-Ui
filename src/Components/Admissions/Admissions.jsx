import "./Admissions.css";

import $ from "jquery";

import React, { useEffect, useState } from "react";

import { useNavigte, useLocation, Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";

function Admissions() {
	const server_url = process.env.REACT_APP_API_URL;
	const [patientSearch, setPatientSearch] = useState("");
	const [fetchedPatients, setFetchedPatients] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [admissions, setAdmissions] = useState([]);

	useEffect(() => {
		$.ajax({
			url: `${server_url}/admissions/`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				if (response) {
					setAdmissions(response);
				}
			},
			error: function (error) {
				console.log(error);
			},
		});
	}, []);

	useEffect(() => {
		if (patientSearch.length > 1) {
			$.ajax({
				url: `${server_url}/admissions/get-patient/?search=${patientSearch}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
					setFetchedPatients(response);
				},
				error: function (error) {
					console.log(error);
				},
			});
		}
	}, [patientSearch]);

	const handlePatientSelect = (patient) => {
		setSelectedPatient(patient);
		setPatientSearch("");
		setFetchedPatients([]);
	};
	const formatDateTimeValue = (datetime) => {
		const result = datetime.split("T");
		
		return result[0];
	};
	return (
		<div className="admissions-central">
			<PageHeader title="Admissions" />
			<div>
				<label>Search Patient:</label>
				<input
					type="text"
					value={patientSearch}
					onChange={(e) => {
						setPatientSearch(e.target.value);
					}}
					placeholder="Enter patient name..."
				/>
				{Array.isArray(fetchedPatients) && fetchedPatients.length > 0 && (
					<ul className="dropdown">
						{fetchedPatients.map((patient) => (
							<Link key={patient.id} to="/admit-patient" state={{ patient }}>
								<li>{patient.firstName + " " + patient.lastName}</li>
							</Link>
						))}
					</ul>
				)}
			</div>
			<div>
				{admissions &&
					admissions.map((admission) => {
						return (
							<Link
							to= "/view-admission"
							state={{admission}}
							key={admission.id} 
							style={{ textDecoration: "none", color: "inherit" }}>
							<p className="admission-item">
								<strong>
									{admission.admissionPatient.firstName +
										" " +
										admission.admissionPatient.lastName}
								</strong>{" "}
								- Admitted on:{" "}
								<strong>{formatDateTimeValue(admission.admissionDate)}</strong>{" "}
								- Reason: {admission.reasonForAdmission} - Bed:{" "}
								{admission.bedId} - Status: <strong>{admission.status}</strong>
							</p></Link>
						);
					})}
			</div>
		</div>
	);
}

export default Admissions;
