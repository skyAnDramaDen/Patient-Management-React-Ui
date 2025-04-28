import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import "./MedicalRecords.css";

import AuthProvider, { AuthContext } from "../../Authcontext";

export default function MedicalRecords() {
	const [medicalRecords, setMedicalRecords] = useState([]);
	const [patientSearch, setPatientSearch] = useState("");
	const [patients, setPatients] = useState([]);
	const [patientsList, setPatientsList] = useState([]);
	const [selectedDoctor, setSelectedDoctor] = useState(null);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const server_url = process.env.REACT_APP_API_URL;
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (patientSearch.length > 1) {
			$.ajax({
				url: `${server_url}/medicalRecords/get-medical-record-by-patients-name?search=${patientSearch}`,
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (data) {
					if (Array.isArray(data)) {
						setPatients(data);
					} else {
						setPatients([]);
					}
				},
				error: function (err) {
					console.error("Error fetching patients:", err);
					setPatients([]);
				},
			});
		} else {
			setPatients([]);
		}
	}, [patientSearch]);

	useEffect(() => {
		$.ajax({
			url: `${server_url}/patients/patients-list`,
			method: "GET",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setPatientsList(response);
			},
			error: function (error) {
				console.error(
					"There was an error fetching the medical records!",
					error
				);
			},
		});
	}, []);

	const handlePatientSelect = (patient) => {
		setSelectedPatient(patient);
		setPatientSearch("");
		setPatients([]);
	};

	return (
		<div className="medical-records">
			<PageHeader title="Medical Records" backPath={user.role == "doctor" ? "/doctor-home" : user.role == "nurse" ? "/nurse-home" : "/"}/>
			<p>Enter a patients name</p>
			<input
				type="text"
				value={patientSearch}
				onChange={(e) => setPatientSearch(e.target.value)}
				placeholder="Enter patient name..."
				className="medrecords-search-input"
			/>
			{Array.isArray(patients) && patients.length > 0 && (
				<ul className="dropdown">
					{patients.map((patient) => (
						<Link
							to="/patient-medical-record"
							state={{patient}}
							style={{ textDecoration: "none", color: "inherit" }}
							key={patient.medical_record.id}>
							<li>{"PTN" + patient.id + " " + patient.firstName + " " + patient.lastName}</li>
						</Link>
					))}
				</ul>
			)}
			{patientsList &&
				patientsList.map((patient) => (
					<Link
						to="/patient-medical-record"
						state={{ patient }}
						style={{ textDecoration: "none", color: "inherit" }}
						key={patient.id}>
						<div key={patient.id} className="record-card">
							<p>
								<span>{patient.id}.</span> {patient.firstName}{" "}
								{patient.lastName}
							</p>
						</div>
					</Link>
				))
        || <p>there are no records</p>
        }
		</div>
	);
}
