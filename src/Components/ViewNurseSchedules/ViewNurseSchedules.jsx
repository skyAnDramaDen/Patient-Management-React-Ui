import "./ViewNurseSchedules.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaClock, FaTimes, FaUserNurse } from "react-icons/fa";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

const ViewNurseSchedules = () => {
    const location = useLocation();
	const [schedules, setSchedules] = useState([]);
	const [showAllSchedules, setShowAllSchedules] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const server_url = process.env.REACT_APP_API_URL;

	useEffect(() => {
        const nurseId = location.state.nurseId;
        
		$.ajax({
			url: `${server_url}/nurses/get-nurse-schedules-by-id/${nurseId}`,
			method: "GET",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"content-Type": "application/json",
			},
			success: (response) => {
				console.log(response);
				setSchedules(response.schedules);
				setIsLoading(false);
			},
			error: (error) => {
				console.log(error);
				setError(error);
				setIsLoading(false);
			},
		});
	}, []);

	const handleCloseModal = () => {
		setShowAllSchedules(false);
	};

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	if (isLoading)
		return <div className="loading-spinner">Loading schedules...</div>;
	if (error) return <div className="error-message">Error: {error}</div>;

	return (
		<div className="nurse-schedules-container">
            <PageHeader title="Schedules" backPath="/nurse-home" />
			{/* <div className="schedules-header">
				<FaUserNurse className="nurse-icon" />
				<h3>Nurse Schedules</h3>
			</div> */}

			<div className="card-content">
				{schedules ? (
					<>
						<ul className="schedule-list">
							{schedules.filter((schedule) => new Date(schedule.date) >= new Date())
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
									{/* <div className="schedule-ward">
										<span>Ward: {schedule.ward || "General"}</span>
									</div> */}
								</li>
							))}
						</ul>
					</>
				) : (
					<div className="no-schedules">No schedules available</div>
				)}
			</div>

			{showAllSchedules && (
				<div className="modal-overlay">
					<div className="modal-content">
						<div className="modal-header">
							<h3>All Schedules</h3>
							<button className="close-btn" onClick={handleCloseModal}>
								<FaTimes />
							</button>
						</div>
						<div className="modal-body">
							<ul className="schedule-list-full">
								{schedules.map((schedule, index) => (
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
										<div className="schedule-ward">
											<span>Ward: {schedule.ward || "General"}</span>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewNurseSchedules;
