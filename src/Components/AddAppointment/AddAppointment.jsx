import "./AddAppointment.css";
import React, { useState, useEffect } from "react";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAppointment = () => {
	const server_url = process.env.REACT_APP_API_URL;
	const navigate = useNavigate();
	const [patientSearch, setPatientSearch] = useState("");
	const [patients, setPatients] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [appointmentDate, setAppointmentDate] = useState();
	const [appointmentTime, setAppointmentTime] = useState("");
	const [doctors, setDoctors] = useState([]);
	const [selectedDoctor, setSelectedDoctor] = useState(null);

	useEffect(() => {
		if (patientSearch.length > 2) {
			$.ajax({
				url: `${server_url}/patients/get-patients-by-name?search=${patientSearch}`,
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
					setPatients([]);
				},
			});
		} else {
			setPatients([]);
		}
	}, [patientSearch]);

	useEffect(() => {
		if (appointmentDate != null) {
			console.log(appointmentDate)
			$.ajax({
				url: `${server_url}/doctors/scheduled-for/${appointmentDate}`,
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (data) {
					if (Array.isArray(data)) {
						setDoctors(data);
					} else {
						setDoctors([]);
					}
				},
				error: function (err) {
					setPatients([]);
				},
			});
		}
	}, [appointmentDate]);

	const handlePatientSelect = (patient) => {
		setSelectedPatient(patient);
		setPatientSearch("");
		setPatients([]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			!selectedPatient ||
			!selectedDoctor ||
			!appointmentDate ||
			!appointmentTime
		) {
			alert("Please fill all fields!");
			return;
		}

		const appointmentData = {
			patientId: selectedPatient.id,
			doctorId: selectedDoctor.id,
			time: appointmentTime,
			date: appointmentDate,
			status: "scheduled",
		};

		$.ajax({
			url: `${server_url}/appointment/create`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			data: JSON.stringify(appointmentData),
			success: function (response) {
				toast.success("Appointment created successfully!");
				navigate("/appointment-details", { state: { appointment: response } });
			},
			error: function (error) {
				console.error(error);
				if (error.status == 400) {
					toast.error("Appointment cannot be set as patient is admitted.");
				} else if (error.status == 409) {
					toast.error("Patient already has a scheduled appointment");
				}
				return;
			},
		});
	};

	return (
		<div className="add-appointment">
			<PageHeader title="➕ Add New Appointment" />

			<div className="sub-div">
				<div className="search-div">
					<label>Search Patient:</label>
					<input
						type="text"
						value={patientSearch}
						onChange={(e) => setPatientSearch(e.target.value)}
						placeholder="Enter patient name..."
					/>
					{Array.isArray(patients) && patients.length > 0 && (
						<ul className="dropdown">
							{patients.map((p) => (
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

				{selectedPatient && (
					<div className="selected-patient">
						<p>
							Patient Name:{" "}
							{selectedPatient.firstName + " " + selectedPatient.lastName}
						</p>
					</div>
				)}

				<div className="date-time-div">
					<div className="form-group">
						<label>Select Date:</label>
						<input
							type="date"
							value={appointmentDate}
							onChange={(e) => setAppointmentDate(e.target.value)}
						/>
					</div>

					<div className="form-group">
						<label>Select Time:</label>
						<input
							type="time"
							value={appointmentTime}
							onChange={(e) => setAppointmentTime(e.target.value)}
						/>
					</div>
				</div>

				<div className="form-group">
					<label>Select Doctor:</label>
					<select
						value={selectedDoctor?.id || ""}
						onChange={(e) => {
							const doc = doctors.find(
								(d) => d.id === parseInt(e.target.value)
							);
							setSelectedDoctor(doc);
						}}>
						<option value="">Select a Doctor</option>
						{doctors.map((doc) => (
							<option key={doc.id} value={doc.id}>
								Dr. {doc.firstName} - {doc.specialization}
							</option>
						))}
					</select>
				</div>

				<div className="add-appointment-div">
					<button onClick={handleSubmit} className="add-appointment-btn">
						✅ Save Appointment
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddAppointment;
