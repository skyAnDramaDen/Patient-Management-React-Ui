import "./NurseHome.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	FaUserNurse,
	FaCalendarAlt,
	FaUserInjured,
	FaClock,
	FaCalendarCheck,
	FaProcedures,
} from "react-icons/fa";

import AuthProvider, { AuthContext } from "../../Authcontext";

const NurseHome = () => {
	const server_url = process.env.REACT_APP_API_URL;
	const [schedules, setSchedules] = useState([]);
	const [patients, setPatients] = useState([]);
	const [nurse, setNurse] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	useEffect(() => {
		$.ajax({
            url: `${server_url}/nurses/get-nurse-schedules/${user.id}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            success: function (response) {
                setNurse(response.nurse);
                setSchedules(response.nurse.schedules || []);
                setIsLoading(false);
            },
            error: function (error) {
                toast.error("Failed to fetch schedules. Please try again.");
            },
        });
	}, []);

    useEffect(() => {
        if (nurse) {
            $.ajax({
                url: `${server_url}/nurses/get-nurse-assigned-patients/${nurse.id}`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                success: function (response) {
					setPatients(response);
                },
                error: function (error) {
                    console.log(error);
                    toast.error("Failed to fetch schedules. Please try again.");
                    setIsLoading(false);
                },
            });
        }
    }, [nurse])

	const handleViewSchedules = () => {
		if (nurse) {
			let nurseId = nurse.id;
			navigate("/nurse/view-nurse-schedules", { state: { nurseId: nurseId } });
		}
	};

	const handleManagePatients = () => {
		navigate("/patient-management");
	};

	const formatDate = (dateString) => {
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	if (isLoading) {
		return (
			<div className="loading-container">
				<div className="spinner"></div>
				<p>Loading your dashboard...</p>
			</div>
		);
	}

	return (
		<div className="nurse-home-container">
			<header className="nurse-header">
				<div className="welcome-section">
					<FaUserNurse className="nurse-icon" />
					<h1>
						Welcome,{" "}
						<span>
							{nurse ? `${nurse.firstName} ${nurse.lastName}` : "Nurse"}
						</span>
					</h1>
				</div>
			</header>

			<div className="dashboard-grid">
				<div className="dashboard-card upcoming-shifts">
					<div className="card-header">
						<FaCalendarAlt className="card-icon" />
						<h3>Upcoming Shifts</h3>
					</div>
					<div className="card-content">
						{schedules.length > 0 ? (
							<ul className="schedule-list">
								{schedules
									.filter((schedule) => new Date(schedule.date) >= new Date())
									.slice(0, 3)
									.map((schedule, index) => (
										<li key={index} className="schedule-item">
											<div className="schedule-date">
												<FaCalendarCheck />
												<span>{formatDate(schedule.date)}</span>
											</div>
											<div className="schedule-time">
												<FaClock />
												<span>
													{schedule.startTime} - {schedule.endTime}
												</span>
											</div>
										</li>
									))}
								{schedules.length > 3 && (
									<button
										className="view-all-btn"
										onClick={handleViewSchedules}>
										View All ({schedules.length})
									</button>
								)}
							</ul>
						) : (
							<div className="empty-state">
								<p>No scheduled shifts</p>
								<button className="primary-btn" onClick={handleViewSchedules}>
									Check Availability
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="dashboard-card assigned-patients">
					<div className="card-header">
						<FaUserInjured className="card-icon" />
						<h3>Assigned Patients</h3>
					</div>
					<div className="card-content">
						{patients.length > 0 ? (
							<ul className="patient-list">
								{patients.slice(0, 3).map((patient, index) => (
									<Link key={index} 
									to ="/view-assigned-patient"
									state= {{patient}}
									style={{ textDecoration: "none", color: "inherit" }}
									>
									<li className="patient-item">
										<div className="patient-info">
											<span className="patient-name">{patient.firstName + " " + patient.lastName}</span>
											
										</div>
										<div className="patient-actions">
											<button className="action2-butn">Vitals</button>
											<button className="action2-butn">Notes</button>
										</div>
									</li>
									</Link>
								))}
								{patients.length > 3 && (
									<button
										className="view-all-btn"
										onClick={handleManagePatients}>
										View All ({patients.length})
									</button>
								)}
							</ul>
						) : (
							<div className="empty-state">
								<p>No patients currently assigned</p>
								<button className="primary-btn" onClick={handleManagePatients}>
									Check Assignments
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="dashboard-card quick-actions">
					<div className="card-header">
						<FaProcedures className="card-icon" />
						<h3>Quick Actions</h3>
					</div>
					<div className="card-content">
						<div className="action-buttons">
							<button
								className="action2-butn large"
								onClick={handleViewSchedules}>
								<FaCalendarAlt />
								<span>View Schedules</span>
							</button>
							<button
								className="action2-butn large"
								onClick={handleManagePatients}>
								<FaUserInjured />
								<span>Manage Patients</span>
							</button>
						</div>
					</div>
				</div>

				<div className="dashboard-card recent-activity">
					<div className="card-header">
						<h3>Recent Activity</h3>
					</div>
					<div className="card-content">
						<div className="activity-item">
							<p>No recent activity</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NurseHome;
