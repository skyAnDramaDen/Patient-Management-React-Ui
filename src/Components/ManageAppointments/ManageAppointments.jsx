import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import PageHeader from "../PageHeader/PageHeader";
import "./ManageAppointments.css";
import $ from "jquery";

const ManageAppointments = () => {
	const navigate = useNavigate();
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState("upcoming");
	const server_url = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				$.ajax({
					url: `${server_url}/appointment`,
					method: "GET",
					headers: {
						"Authorization": `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
					success: function (response) {
						setAppointments(response);
					},
					error: function (error) {
						setError(error.message || "Failed to fetch appointments");
					},
				});
			} catch (err) {
				setError(err.message || "Failed to fetch appointments");
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, []);

	const filteredAppointments = appointments.filter((appt) => {
		const now = new Date();

		const datePart = new Date(appt.date).toISOString().split("T")[0];
		const appointmentDate = new Date(`${datePart}T${appt.time}`);

		if (filter === "upcoming") {
			return appointmentDate > now;
		}
		if (filter === "past") {
			return appointmentDate <= now;
		}
		return true;
	});

	const handleViewDetails = (appointment) => {
		navigate("/view-appointment", { state: { appointment } });
	};

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const formatTime = (timeString) => {
		return timeString.substring(0, 5);
	};

	if (loading) {
		return <div className="loading">Loading appointments...</div>;
	}

	if (error) {
		return <div className="error">Error: {error}</div>;
	}

	const handleRescheduleAppointment = (appt) => {
		navigate("/reschedule-appointment", { state: { appointment: appt } });
	};

	return (
		<div className="manage-appointments">
			<PageHeader title="Manage Appointments" />

			<div className="controls">
				<div className="filter-controls">
					<button
						className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
						onClick={() => setFilter("upcoming")}>
						Upcoming
					</button>
					<button
						className={`filter-btn ${filter === "past" ? "active" : ""}`}
						onClick={() => setFilter("past")}>
						Past
					</button>
					<button
						className={`filter-btn ${filter === "all" ? "active" : ""}`}
						onClick={() => setFilter("all")}>
						All
					</button>
				</div>

				<Link to="/appointments/new" className="add-btn">
					+ New Appointment
				</Link>
			</div>

			<div className="appointments-table-container">
				<table className="appointments-table">
					<thead>
						<tr>
							<th>Date</th>
							<th>Time</th>
							<th>Patient</th>
							<th>Doctor</th>
							<th>Status</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{filteredAppointments.length > 0 ? (
							filteredAppointments.map((appt) => (
								<tr
									key={appt.id}
									className={
										new Date(`${appt.date}T${appt.time}`) < new Date()
											? "past"
											: ""
									}>
									<td>{formatDate(appt.date)}</td>
									<td>{formatTime(appt.time)}</td>
									<td>
										{appt.patient
											? `${appt.patient.firstName} ${appt.patient.lastName}`
											: "N/A"}
									</td>
									<td>
										{appt.doctor
											? `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`
											: "N/A"}
									</td>
									<td>
										<span
											className={`status-badge ${appt.status.toLowerCase()}`}>
											{appt.status}
										</span>
									</td>
									<td className="buttons-td">
										<button
											className="view-btn"
											onClick={() => handleViewDetails(appt)}>
											View
										</button>
										<button
										disabled={appt.status == "completed"}
											onClick={() => {
												handleRescheduleAppointment(appt);
											}}
											className="reschedule-appointment">
											Reschedule
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6" className="no-appointments">
									No {filter} appointments found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageAppointments;
