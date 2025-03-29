import { useNavigate } from "react-router-dom";
import "./ViewPatients.css";
import PatientCard from "../PatientCard/PatientCard";
import React, { useState, useEffect } from "react";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

const ViewPatients = () => {
	const navigate = useNavigate();
	const [patients, setPatients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchedPatients, setSearchedPatients] = useState([]);
	const [patientSearch, setPatientSearch] = useState("");
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [totalRecords, setTotalRecords] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 2;
	const server_url = process.env.REACT_APP_API_URL;

	const totalPages = Math.ceil(totalRecords / pageSize);

	useEffect(() => {
		const fetchPatients = (page) => {
			$.ajax({
				url: `${server_url}/patients?page=${page}&pageSize=${pageSize}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
					setPatients(response.patients);
					setLoading(false);
          			setTotalRecords(response.totalRecords);
				},
				error: function (error) {
					setError("Failed to fetch patients");
					setLoading(false);
				},
			});
		};

		fetchPatients(currentPage);
	}, [currentPage]);

	useEffect(() => {
		if (patientSearch.length > 1) {
			$.ajax({
				url: `${server_url}/patients/get-patients-by-name?search=${patientSearch}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
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

	const handlePatientClick = (patient) => {
		navigate("/patient-profile", { state: { patient } });
	};

	const handlePatientSelect = (patient) => {
		setSelectedPatient(patient);
		setPatientSearch("");
		setPatients([]);
	};

	return (
		<div className="view-patients">
			<PageHeader title="Patients" backPath="/patient-management" />
			<div className="form-group">
				<label>Search Patient:</label>
				<input
					type="text"
					value={patientSearch}
					onChange={(e) => setPatientSearch(e.target.value)}
					placeholder="Enter patient name..."
				/>
				{Array.isArray(searchedPatients) && searchedPatients.length > 0 && (
					<ul className="dropdown">
						{searchedPatients.map((p) => (
							<li key={p.id} onClick={() => handlePatientSelect(p)}>
								{p.firstName + " " + p.lastName}
							</li>
						))}
					</ul>
				)}
				{Array.isArray(patients) &&
					patients.length === 0 &&
					patientSearch.length > 1 && (
						<ul className="dropdown">
							<li>No patients found</li>
						</ul>
					)}
			</div>
			<div>
				<div className="pagination-control">
				<div className="pagination-btns">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}>
						Previous
					</button>
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}>
						Next
					</button>
				</div>
				</div>
				<div className="patient-list">
					{patients.map((patient) => (
						<div key={patient.id} onClick={() => handlePatientClick(patient)}>
							<PatientCard patient={patient} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ViewPatients;
