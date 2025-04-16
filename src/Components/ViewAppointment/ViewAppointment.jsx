import "./ViewAppointment.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import $ from "jquery";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewAppointment() {
	const location = useLocation();
	const navigate = useNavigate();
	const [appointment, setAppointment] = useState(null);
	const [patient, setPatient] = useState(null);
	const [medicalRecords, setMedicalRecords] = useState([]);
	const [doctorNotes, setDoctorNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const server_url = process.env.REACT_APP_API_URL;

	useEffect(() => {
		if (location.state?.appointment) {
			const appointmentData = location.state.appointment;
			setAppointment(appointmentData);
			setPatient(appointmentData.patient);
			setDoctorNotes(appointmentData.notes || "");

			fetchMedicalRecords(appointmentData.patient.id);
		} else {
			setLoading(false);
		}
	}, [location]);

	const fetchMedicalRecords = async (patientId) => {
		try {
			$.ajax({
				url: `${server_url}/medicalRecords/get-by/${patientId}`,
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
					setMedicalRecords(response.medical_record);
				},
				error: function (error) {
					console.log(error);
				},
			});
		} catch (err) {
			setError("Failed to load medical records");
			console.error("Error fetching medical records:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleNotesChange = (e) => {
		setDoctorNotes(e.target.value);
	};

	const handleSaveNotes = async () => {
		if (!appointment) return;

		setIsSubmitting(true);
		try {
            const payload = {
                notes: doctorNotes,
            }

            if (appointment) {
                $.ajax({
                    url: `${server_url}/appointment/add-appointment-note/${appointment.id}`,
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify(payload),
                    success: function (response) {
                        if (response.success == true) {
                            toast.success("Notes saved successfully");
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
            }
		} catch (err) {
			setError("Failed to save notes");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCompleteAppointment = async () => {
		if (!appointment) return;

		setIsSubmitting(true);
		try {
			

            if (appointment) {
                $.ajax({
                    url: `${server_url}/appointment/conclude-appointment/${appointment.id}`,
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    success: function (response) {
                        if (response.success == true) {
                            navigate("/doctor-home");
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
            }
		} catch (err) {
			setError("Failed to complete appointment");
			console.error("Error completing appointment:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		navigate(-1);
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<p>Loading appointment details...</p>
			</div>
		);
	}

	if (!appointment) {
		return <div className="error-message">No appointment data found</div>;
	}

	return (
		<div className="view-appointment-doc">
			<PageHeader title="View Appointment (Doctor)" />

			{error && <div className="error-message">{error}</div>}

			<div className="appointment-layout">
				<div className="left-column">
					<section className="appointment-section">
						<h2 className="section-title">Appointment Details</h2>
						<div className="detail-grid">
							<div className="detail-row">
								<span className="detail-label">Date:</span>
								<span>{new Date(appointment.date).toLocaleDateString()}</span>
							</div>
							<div className="detail-row">
								<span className="detail-label">Time:</span>
								<span>{appointment.time}</span>
							</div>
							
							<div className="detail-row">
								<span className="detail-label">Reason:</span>
								<span>{appointment.reason || "Not specified"}</span>
							</div>
						</div>
					</section>

					<section className="patient-section">
						<h2 className="section-title">Patient Information</h2>
						{patient ? (
							<div className="detail-grid">
								<div className="detail-row">
									<span className="detail-label">Name:</span>
									<span>
										{patient.firstName} {patient.lastName}
									</span>
								</div>
								<div className="detail-row">
									<span className="detail-label">Gender:</span>
									<span>{patient.gender || "Not specified"}</span>
								</div>
								<div className="detail-row">
									<span className="detail-label">Date of Birth:</span>
									<span>
										{patient.dateOfBirth
											? new Date(patient.dateOfBirth).toLocaleDateString()
											: "Not specified"}
									</span>
								</div>
								<div className="detail-row">
									<span className="detail-label">Phone:</span>
									<span>{patient.phone || "Not specified"}</span>
								</div>
								<div className="detail-row">
									<span className="detail-label">Email:</span>
									<span>{patient.email || "Not specified"}</span>
								</div>
							</div>
						) : (
							<div className="no-data">No patient information available</div>
						)}
					</section>
				</div>

				<div className="right-column">
					<section className="medical-records-section">
						<h2 className="section-title">Medical Records</h2>
						{medicalRecords && 
							<div className="records-list">
								
									<div key={medicalRecords.id} className="record-item">
										<div className="record-header">
											<span className="record-date">
												{new Date(medicalRecords.date).toLocaleDateString()}
											</span>
											
										</div>
										<div className="record-details">
                                            <p>
                                            <strong>Current Medications:</strong> <span className="record-type">{medicalRecords.current_medications}</span>
                                            </p>
											<p>
												<strong>Family medical History:</strong> <span>{medicalRecords.family_medical_history}</span>
											</p>
											<p>
												<strong>Lifestyle factors:</strong> {medicalRecords.lifestyle_factors}
											</p>
											<p>
												<strong>Past Illnesses:</strong> {medicalRecords.past_illnesses}
											</p>
                                            <p>
												<strong>Surgeries:</strong> {medicalRecords.surgeries}
											</p>
                                            <p>
												<strong>Treatment Plans:</strong> {medicalRecords.treatment_plans}
											</p>
										</div>
									</div>

							</div>}
					</section>

					<section className="doctor-notes-section">
						<h2 className="section-title">Doctor's Notes</h2>
						<textarea
							className="notes-textarea"
							value={doctorNotes}
							onChange={handleNotesChange}
							placeholder="Enter notes..."
							rows={6}
						/>
						<div className="notes-actions">
							<button
								className="btn save-btn"
								onClick={handleSaveNotes}
								disabled={isSubmitting || appointment.status == "completed"}>
								{isSubmitting ? "Saving..." : "Save Notes"}
							</button>
						</div>
					</section>
				</div>
			</div>

			<div className="action-buttons">
				<button
					className="btn complete-btn"
					onClick={handleCompleteAppointment}
					disabled={isSubmitting || appointment.status == "completed"}>
					{isSubmitting ? "Processing..." : "Conclude Appointment"}
				</button>
				<button className="btn cancel-btn" onClick={handleCancel}>
					Back
				</button>
			</div>
		</div>
	);
}

export default ViewAppointment;
