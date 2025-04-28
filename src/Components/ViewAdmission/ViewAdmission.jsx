import "./ViewAdmission.css";
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
	FaUserInjured,
	FaCalendarAlt,
	FaClock,
	FaProcedures,
	FaUserNurse,
	FaSearch,
	FaCheck,
} from "react-icons/fa";

function ViewAdmission() {
	const location = useLocation();
	const navigate = useNavigate();
	const [admission, setAdmission] = useState(null);
	const [ward, setWard] = useState(null);
	const [patient, setPatient] = useState(null);
	const [nurseSearch, setNurseSearch] = useState("");
	const [fetchedNurses, setFetchedNurses] = useState([]);
	const [selectedNurse, setSelectedNurse] = useState(null);
	const [assignedNurse, setAssignedNurse] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAssigning, setIsAssigning] = useState(false);

	const server_url = process.env.REACT_APP_API_URL;
	const admission_id = location.state.admission.id;

	useEffect(() => {
		if (!admission_id) {
			toast.error("No admission ID provided");
			// navigate("/");
			return;
		}

		$.ajax({
			url: `${server_url}/admissions/view-admission/${admission_id}`,
			method: "GET",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setPatient(response.admissionPatient);
				setAdmission(response);
				if (response.wardAdmissions?.[0]?.ward) {
					setWard(response.wardAdmissions[0].ward);
				}
				setIsLoading(false);
			},
			error: function (error) {
				toast.error("Failed to load admission details");
				console.error(error);
				setIsLoading(false);
			},
		});

		setIsLoading(true);
	}, []);

	const fetchAssignedNurse = useCallback(() => {
		if (!patient || !admission) return;

		$.ajax({
			url: `${server_url}/admissions/get-assigned-nurse`,
			method: "POST",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				admissionId: admission.id,
				patientId: patient.id,
			}),
			success: function (response) {
				setAssignedNurse(response.assignedNurse?.nurse || null);
			},
			error: function (error) {
				console.error("Error fetching assigned nurse:", error);
			},
		});
	}, [admission, patient, server_url]);

	useEffect(() => {
		const searchNurses = setTimeout(() => {
			if (nurseSearch.length > 1) {
				$.ajax({
					url: `${server_url}/nurses/get-nurses-by-name?search=${nurseSearch}`,
					method: "GET",
					headers: {
						"Authorization": `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
					success: function (data) {
						setFetchedNurses(Array.isArray(data.nurses) ? data.nurses : []);
					},
					error: function (err) {
						setFetchedNurses([]);
						console.error("Error searching nurses:", err);
					},
				});
			} else {
				setFetchedNurses([]);
			}
		}, 300);

		return () => clearTimeout(searchNurses);
	}, [nurseSearch, server_url]);

	useEffect(() => {
		fetchAssignedNurse();
	}, [fetchAssignedNurse]);

	const handleNurseClick = (nurse) => {
		setSelectedNurse(nurse);
		setNurseSearch(`${nurse.firstName} ${nurse.lastName}`);
		setFetchedNurses([]);
	};

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const formatDateTime = (dateTimeString) => {
		if (!dateTimeString) return "N/A";
		const options = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateTimeString).toLocaleDateString(undefined, options);
	};

	const handleAssignNurse = () => {
		if (!selectedNurse || !patient || !admission) return;

		setIsAssigning(true);
		const payload = {
			patientId: patient.id,
			nurseId: selectedNurse.id,
			admissionId: admission.id,
		};

		$.ajax({
			url: `${server_url}/admissions/assign-patient-nurse`,
			method: "POST",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			data: JSON.stringify(payload),
			success: function (response) {
				if (response.success) {
					setAssignedNurse(response.nurse);
					setSelectedNurse(null);
					setNurseSearch("");
					toast.success("Nurse assigned successfully!");
				} else {
					toast.error(response.message || "Failed to assign nurse");
				}
				setIsAssigning(false);
			},
			error: function (error) {
				if (error.status === 409) {
					toast.error("The nurse is already assigned to the patient");
				}
		
				setIsAssigning(false);
			},
		});
	};

	if (isLoading) {
		return (
			<div className="loading-container">
				<div className="spinner"></div>
				<p>Loading admission details...</p>
			</div>
		);
	}

	if (!admission) {
		return (
			<div className="error-container">
				<p>Failed to load admission details.</p>
				<button onClick={() => navigate(-1)}>Go Back</button>
			</div>
		);
	}

	return (
		<div className="view-admission-container">
			<ToastContainer position="top-right" autoClose={5000} />

			<div className="admission-header">
				<PageHeader title="Admission Details" />
				<div className="header-actions">
					<span className={`status-badge ${admission.status.toLowerCase()}`}>
						{admission.status}
					</span>
					<Link
						to="/discharge-patient"
						state={{ admission }}
						className="discharge-btn"
						style={{ textDecoration: "none" }}>
						<FaProcedures /> Discharge Patient
					</Link>
				</div>
			</div>

			<div className="admission-content-grid">
				<div className="info-card patient-info">
					<div className="card-header">
						<FaUserInjured className="card-icon" />
						<h3>Patient Information</h3>
					</div>
					<div className="info-grid">
						<div className="info-item">
							<label>Full Name:</label>
							<span>
								{patient?.firstName} {patient?.lastName}
							</span>
						</div>
						<div className="info-item">
							<label>Date of Birth:</label>
							<span>{formatDate(patient?.dateOfBirth)}</span>
						</div>
						<div className="info-item">
							<label>Gender:</label>
							<span>{patient?.gender}</span>
						</div>
					</div>
				</div>

				<div className="info-card admission-info">
					<div className="card-header">
						<FaCalendarAlt className="card-icon" />
						<h3>Admission Details</h3>
					</div>
					<div className="info-grid">
						<div className="info-item">
							<label>Admission Date:</label>
							<span>{formatDateTime(admission.admissionDate)}</span>
						</div>
						<div className="info-item">
							<label>Reason:</label>
							<span>{admission.reasonForAdmission || "Not specified"}</span>
						</div>
					</div>
				</div>

				<div className="info-card ward-info">
					<div className="card-header">
						<FaProcedures className="card-icon" />
						<h3>Ward Information</h3>
					</div>
					{ward ? (
						<div className="info-item">
							<label>Ward:</label>
							<span>
								{ward.name} (Floor {ward.floor?.floorNumber})
							</span>
						</div>
					) : (
						<div className="no-data">No ward assigned</div>
					)}
				</div>

				<div className="info-card nurse-info">
					<div className="card-header">
						<FaUserNurse className="card-icon" />
						<h3>Nurse Assignment</h3>
					</div>

					{assignedNurse ? (
						<div className="current-nurse">
							<div className="info-item">
								<label>Assigned Nurse:</label>
								<span>
									{assignedNurse.firstName} {assignedNurse.lastName}
								</span>
							</div>
						</div>
					) : (
						<div className="no-data">No nurse assigned</div>
					)}

					<div className="nurse-assignment">
						<h4>Assign New Nurse</h4>
						<div className="search-container">
							<div className="search-input">
								<FaSearch className="search-icon" />
								<input
									type="text"
									value={nurseSearch}
									onChange={(e) => setNurseSearch(e.target.value)}
									placeholder="Search nurses by name..."
								/>
							</div>

							{fetchedNurses.length > 0 && (
								<div className="search-results">
									{fetchedNurses.map((nurse) => (
										<div
											key={nurse.id}
											className="result-item"
											onClick={() => handleNurseClick(nurse)}>
											{nurse.firstName} {nurse.lastName}
										</div>
									))}
								</div>
							)}
						</div>

						{selectedNurse && (
							<div className="assignment-confirmation">
								<div className="selected-nurse">
									<span>Selected: </span>
									<strong>
										{selectedNurse.firstName} {selectedNurse.lastName}
									</strong>
								</div>
								<button
									className="confirm-btn"
									onClick={handleAssignNurse}
									disabled={isAssigning}>
									{isAssigning ? (
										"Assigning..."
									) : (
										<>
											<FaCheck /> Confirm Assignment
										</>
									)}
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="info-card notes-info">
					<div className="card-header">
						<h3>Additional Notes</h3>
					</div>
					<div className="notes-content">
						{admission.notes ? (
							<p>{admission.notes}</p>
						) : (
							<div className="no-data">No additional notes recorded</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ViewAdmission;
