import "./NurseManagement.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const NurseManagement = () => {
	const server_url = process.env.REACT_APP_API_URL;
	const navigate = useNavigate();
	const [nurses, setNurses] = useState([]);
	const [selectedNurse, setSelectedNurse] = useState(null);
	const [schedules, setSchedules] = useState([]);
	const [selectedDate, setSelectedDate] = useState("");
	const [selectedStartTime, setSelectedStartTime] = useState("");
	const [selectedEndTime, setSelectedEndTime] = useState("");
	const [startOfWeek, setStartOfWeek] = useState();
	const [scheduleCategory, setScheduleCategory] = useState("single-day");
    const [reachedLastSunday, setReachedLastSunday] = useState(true);
    const [startOfWeekFormattedDate, setStartOfWeekFormattedDate] = useState();
	const [nurseSearch, setNurseSearch] = useState("");
	const [fetchedNurses, setFetchedNurses] = useState([]);

	const [weekdays, setWeekdays] = useState({
		monday: { selected: false, time: "" },
		tuesday: { selected: false, time: "" },
		wednesday: { selected: false, time: "" },
		thursday: { selected: false, time: "" },
		friday: { selected: false, time: "" },
		saturday: { selected: false, time: "" },
		sunday: { selected: false, time: "" },
	});

	useEffect(() => {
		if (nurseSearch.length > 1) {
			$.ajax({
				url: `${server_url}/nurses/get-nurses-by-name?search=${nurseSearch}`,
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (data) {
					if (Array.isArray(data.nurses)) {
						setFetchedNurses(data.nurses);
					} else {
						setFetchedNurses([]);
					}
				},
				error: function (err) {
					console.error("Error fetching patients:", err);
					setFetchedNurses([]);
				},
			});
		} else {
			setFetchedNurses([]);
		}
	}, [nurseSearch]);

	useEffect(() => {
		const { formattedDate, nextSunday } = findNextSunday();
		setStartOfWeek(nextSunday);
        setStartOfWeekFormattedDate(formattedDate);
		$.ajax({
			url: `${server_url}/nurses`,
			method: "GET",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setNurses(response.nurses);
			},
			error: function (error) {
				console.error("There was an error fetching the nurses!", error);
			},
		});
	}, []);

	const handleNurseClick = (nurse) => {
		setSelectedNurse(nurse);
		setSchedules(nurse.schedules);
	};

	const handleDateChange = (e) => {
		setSelectedDate(e.target.value);
		setSelectedStartTime("");
		setSelectedEndTime("");
	};

	const handleStartTimeChange = (e) => {
		setSelectedStartTime(e.target.value);
	};

	const handleEndTimeChange = (e) => {
		setSelectedEndTime(e.target.value);
	};

	const generateTimeOptions = () => {
		const times = [];
		for (let hour = 0; hour < 24; hour++) {
			for (let minute = 0; minute < 60; minute += 5) {
				const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
				const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
				times.push(`${formattedHour}:${formattedMinute}`);
			}
		}
		return times;
	};

	const timeOptions = React.useMemo(() => generateTimeOptions(), []);

	const handleSaveNewSchedule = () => {
		if (scheduleCategory === "single-day") {
			if (!selectedDate || (!selectedStartTime && !selectedEndTime)) {
				alert("Please select both date and time.");
				return;
			}

			const scheduleEntry = {
				startTime: `${selectedDate}T${selectedStartTime}:00Z`,
				endTime: `${selectedDate}T${selectedEndTime}`,
				status: "available",
				nurseId: selectedNurse.id,
				date: selectedDate,
			};

			$.ajax({
				url: `${server_url}/schedule/create`,
				method: "POST",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(scheduleEntry),
				success: function (response) {
					toast.success("The schedule has been created successfully");
					setSchedules([...schedules, response]);
					setSelectedDate("");
					setSelectedEndTime("");
					setSelectedStartTime("");
				},
				error: function (error) {
					if (error.status === 408) {
						toast.error(
							"Cannot create a schedule for a date that is in the past."
						);
					} else if (error.status === 400) {
						toast.error("Nurse is scheduled for the same day already.");
					}
				},
			});
		} else if (scheduleCategory === "whole-week" && weekdays) {
			console.log("The second batch of conditions");
			if (weekdays && selectedNurse) {
				for (const [day, data] of Object.entries(weekdays)) {
					if (data.selected && !data.time) {
						toast.error(
							"You have not selected a shift time for a selected day!"
						);
						return;
					}
				}

				const { formattedDate, nextSunday } = findNextSunday();

				let payload = {
					weekdays: weekdays,
					nextSunday: nextSunday,
					nurseId: selectedNurse.id,
				};

				$.ajax({
					url: `${server_url}/schedule/create-schedule-for-coming-week`,
					method: "POST",
					headers: {
						"Authorization": `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(payload),
					success: function (response) {
						console.log(response);
						setSchedules([...schedules, ...response.created_schedules]);
						toast.success("The nurse has been scheduled for the selected days");
					},
					error: function (error) {
						if (
							error.status === 408 ||
							error.status === 400 ||
							error.status === 404 ||
							error.status === 409
						) {
							toast.error(error.responseJSON.message);
						}
					},
				});
			}
		}
	};

	const handleCancelSchedule = (individual_schedule) => {
		const confirmCancel = window.confirm(
			"Are you sure you want to cancel the schedule?"
		);
		if (confirmCancel) {
			const payload = { schedule: individual_schedule };
			$.ajax({
				url: `${server_url}/schedule/cancel-schedule`,
				method: "POST",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(payload),
				success: function (response) {
					if (response.success === true) {
						setSchedules((prevSchedules) =>
							prevSchedules.filter(
								(schedule) => schedule.id !== individual_schedule.id
							)
						);
						toast.success("The scheduling has been cancelled successfully");
					}
				},
				error: function (error) {
					toast.error("The was an error in cancelling the schedule");
				},
			});
		}
	};

	const handleChangeNextSunday = (num) => {
        if (startOfWeekFormattedDate) {
            const date = new Date(startOfWeekFormattedDate);

            date.setDate(date.getDate() + num);
            
            let new_date = new Date(date.getTime());

            let now_date = new Date();

            let two_sundays_ago;

            if (num < 0) {
                two_sundays_ago = new Date(new_date.getTime());
                two_sundays_ago.setDate(two_sundays_ago.getDate() - 7);

                if (two_sundays_ago < now_date) {
                    setStartOfWeekFormattedDate(new_date.toISOString().split('T')[0]);
                    setReachedLastSunday(true);
                    return;
                } else {
                    setReachedLastSunday(false);
                }
            } else if (num > 0) {
                setReachedLastSunday(false);
            }

            setStartOfWeekFormattedDate(new_date.toISOString().split('T')[0]);
            return new_date;
        }
    }

	const handleDayCheckboxChange = (e) => {
		let weekday = e.target.id;
		setWeekdays((prevState) => {
			const isSelected = prevState[weekday].selected;
			return {
				...prevState,
				[weekday]: {
					...prevState[weekday],
					selected: !isSelected,
					time: !isSelected ? prevState[weekday].time : "",
				},
			};
		});
	};

	const handleShiftSelectChange = (e, weekday) => {
		setWeekdays((prevState) => ({
			...prevState,
			[weekday]: {
				...prevState[weekday],
				time: e.target.value,
			},
		}));
	};

	const findNextSunday = () => {
		let today = new Date();
		let nextSunday = new Date(today);

		while (nextSunday.getDay() !== 0) {
			nextSunday.setDate(nextSunday.getDate() + 1);
		}

		const date = new Date(nextSunday);
		const formattedDate = date.toISOString().split("T")[0];
		return {
			formattedDate: formattedDate,
			nextSunday: nextSunday.toDateString(),
		};
	};

	const handleScheduleCatChange = (e) => {
		if (e.target.name === "single-day") {
			setScheduleCategory(e.target.checked ? e.target.name : "");
		}
		if (e.target.name === "whole-week") {
			setScheduleCategory(e.target.checked ? e.target.name : "");
		}
	};

	return (
		<div className="nurse-management">
			<PageHeader title="Nurse Management" backPath="/staff-management" />
			<div className="mngt-board">
				<div className="sidebar3">
					<h3>Nurses</h3>
					<button>All Schedules</button>
					<Link
						to="/add-nurse"
						style={{ textDecoration: "none", color: "inherit" }}>
						<button>➕ Add Nurse</button>
					</Link>

					<label>Search nurse</label>
                    <input
                    type="text"
                    value={nurseSearch} 
                    onChange={(e) => setNurseSearch(e.target.value)}
                    />

					<ul>
                        {
                            fetchedNurses.map((one_nurse) => (
                                <li key={one_nurse.id} onClick={() => {
                                    handleNurseClick(one_nurse);
                                }}>{one_nurse.firstName + " " + one_nurse.lastName}<button className="view-filtered-doc-btn"
                                onClick={() => {
									console.log(one_nurse);
                                    navigate("/view-nurse-schedule", { state: { nurse: one_nurse } });
                                }}
                                >View</button>
                                </li>
                            ))
                            
                        }
                    </ul>

					<ul>
						{nurses &&
							nurses.map((nurse, index) => (
								<li key={nurse.id} onClick={() => handleNurseClick(nurse)}>
									{nurse.firstName} {nurse.lastName}
									<Link
										to="/view-nurse-schedule"
										state={{ nurse }}
										style={{ textDecoration: "none", color: "inherit" }}>
										<button>View</button>
									</Link>
								</li>
							))}
					</ul>
				</div>
				<div className="main-content">
					{selectedNurse ? (
						<div className="nurse-details">
							<h3>Nurse Details</h3>
							<p>
								<strong>Name:</strong> {selectedNurse.firstName}{" "}
								{selectedNurse.lastName}
							</p>
							<p>
								<strong>Specialization:</strong> {selectedNurse.specialization}
							</p>
						</div>
					) : (
						<p>Select a nurse to see the details</p>
					)}
					<div className="schedule">
						<h3>Set Schedule</h3>
                        <div className="schedule-types-checkboxes">
                            <div className="day-checkbox-div margin-pad">
                                <input type="checkbox"
                                checked ={scheduleCategory == "single-day"}
                                 name="single-day" onChange={(e) => {
                                    handleScheduleCatChange(e)
                                }} />
                                <label>For single day</label>
                            </div>
                            <div className="day-checkbox-div">
                                <input type="checkbox"
                                checked ={scheduleCategory == "whole-week"} name="whole-week" onChange={(e) => {
                                    handleScheduleCatChange(e)
                                }} />
                                <label>For coming week</label>
                            </div>
                        </div>
						{
                            scheduleCategory == "single-day" && <>
                            <div>
                                <label>Date: </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="input-field-1"
                                />
                            </div>
                            <div className="times">
                                <div>
                                    <label>Start Time: </label>
                                    <select
                                        value={selectedStartTime}
                                        onChange={handleStartTimeChange}>
                                        {timeOptions.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>End Time: </label>
                                    <select value={selectedEndTime} onChange={handleEndTimeChange}>
                                        {timeOptions.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            </>
                        }
						

                        {
                            scheduleCategory == "whole-week" && (
                                <div className="checkboxes-div">
                                    <div className="week-select-div">
                                    <button
                                    disabled = {reachedLastSunday === true}
                                    onClick={() => {
                                        handleChangeNextSunday(-7)
                                    }}
                                    className="dm-next-btn"
                                    >Previous</button>
                                    <strong className="for-week-strong-el">For week: {startOfWeekFormattedDate && startOfWeekFormattedDate}</strong>
                                    <button
                                    onClick={() => {
                                        handleChangeNextSunday(7)
                                    }}
                                    className="dm-next-btn"
                                    >Next</button>
                                    </div>
                                    <div className="day-selection-container">
                                        <div className="day-checkbox-div">
                                            <input 
                                                type="checkbox" 
                                                id="monday" 
                                                className="checkbox-me" 
                                                checked={weekdays.monday.selected}
                                                onChange={handleDayCheckboxChange}
                                            />
                                            <label htmlFor="monday">Monday</label>
                                        </div>
                                        <div className="time-select-parent-div">
                                            <select 
                                                className="time-select"
                                                disabled={!weekdays.monday.selected}
                                                onChange={(e) => handleShiftSelectChange(e, "monday")}
                                                value={weekdays.monday.time || ""}
                                            >
                                                <option value="">Select a shift</option>
                                                <option value="8:30am - 8:30pm">8:30am - 8:30pm</option>
                                                <option value="8:30pm - 8:30am">8:30pm - 8:30am</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="day-selection-container">
                                        <div className="day-checkbox-div">
                                            <input 
                                                type="checkbox" 
                                                id="tuesday" 
                                                className="checkbox-me" 
                                                checked={weekdays.tuesday.selected}
                                                onChange={handleDayCheckboxChange}
                                            />
                                            <label htmlFor="tuesday">Tuesday</label>
                                        </div>
                                        <div>
                                            <select 
                                                className="time-select"
                                                disabled={!weekdays.tuesday.selected}
                                                onChange={(e) => handleShiftSelectChange(e, "tuesday")}
                                                value={weekdays.tuesday.time || ""}
                                            >
                                                <option value="">Select a shift</option>
                                                <option value="8:30am - 8:30pm">8:30am - 8:30pm</option>
                                                <option value="8:30pm - 8:30am">8:30pm - 8:30am</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="day-selection-container">
                                        <div className="day-checkbox-div">
                                            <input
                                                type="checkbox"
                                                id="wednesday"
                                                className="checkbox-me"
                                                checked={weekdays.wednesday.selected}
                                                onChange={handleDayCheckboxChange}
                                            />
                                            <label htmlFor="wednesday">Wednesday</label>
                                        </div>
                                        <div>
                                            <select 
                                                className="time-select"
                                                disabled={!weekdays.wednesday.selected}
                                                onChange={(e) => handleShiftSelectChange(e, "wednesday")}
                                                value={weekdays.wednesday.time || ""}
                                            >
                                                <option value="">Select a shift</option>
                                                <option value="8:30am - 8:30pm">8:30am - 8:30pm</option>
                                                <option value="8:30pm - 8:30am">8:30pm - 8:30am</option>
                                            </select>
                                        </div>
                                    </div>
                            
                                    <div className="day-selection-container">
                                        <div className="day-checkbox-div">
                                            <input
                                                type="checkbox"
                                                id="thursday"
                                                className="checkbox-me"
                                                checked={weekdays.thursday.selected}
                                                onChange={handleDayCheckboxChange}
                                            />
                                            <label htmlFor="thursday">Thursday</label>
                                        </div>
                                        <div>
                                            <select 
                                                className="time-select"
                                                disabled={!weekdays.thursday.selected}
                                                onChange={(e) => handleShiftSelectChange(e, "thursday")}
                                                value={weekdays.thursday.time || ""}
                                            >
                                                <option value="">Select a shift</option>
                                                <option value="8:30am - 8:30pm">8:30am - 8:30pm</option>
                                                <option value="8:30pm - 8:30am">8:30pm - 8:30am</option>
                                            </select>
                                        </div>
                                    </div>
                            
                                    <div className="day-selection-container">
                                        <div className="day-checkbox-div">
                                            <input 
                                                type="checkbox" 
                                                id="friday" 
                                                className="checkbox-me" 
                                                checked={weekdays.friday.selected}
                                                onChange={handleDayCheckboxChange}
                                            />
                                            <label htmlFor="friday">Friday</label>
                                        </div>
                                        <div>
                                            <select 
                                                className="time-select"
                                                disabled={!weekdays.friday.selected}
                                                onChange={(e) => handleShiftSelectChange(e, "friday")}
                                                value={weekdays.friday.time || ""}
                                            >
                                                <option value="">Select a shift</option>
                                                <option value="8:30am - 8:30pm">8:30am - 8:30pm</option>
                                                <option value="8:30pm - 8:30am">8:30pm - 8:30am</option>
                                            </select>
                                        </div>
                                    </div>
                            
                                    <div className="day-selection-container">
                                        <div className="day-checkbox-div">
                                            <input
                                                type="checkbox"
                                                id="saturday"
                                                className="checkbox-me"
                                                checked={weekdays.saturday.selected}
                                                onChange={handleDayCheckboxChange}
                                            />
                                            <label htmlFor="saturday">Saturday</label>
                                        </div>
                                        <div>
                                            <select 
                                                className="time-select"
                                                disabled={!weekdays.saturday.selected}
                                                onChange={(e) => handleShiftSelectChange(e, "saturday")}
                                                value={weekdays.saturday.time || ""}
                                            >
                                                <option value="">Select a shift</option>
                                                <option value="8:30am - 8:30pm">8:30am - 8:30pm</option>
                                                <option value="8:30pm - 8:30am">8:30pm - 8:30am</option>
                                            </select>
                                        </div>
                                    </div>
                            
                                    <div className="day-selection-container">
                                        <div className="day-checkbox-div">
                                            <input 
                                                type="checkbox" 
                                                id="sunday" 
                                                className="checkbox-me" 
                                                checked={weekdays.sunday.selected}
                                                onChange={handleDayCheckboxChange}
                                            />
                                            <label htmlFor="sunday">Sunday</label>
                                        </div>
                                        <div>
                                            <select 
                                                className="time-select"
                                                disabled={!weekdays.sunday.selected}
                                                onChange={(e) => handleShiftSelectChange(e, "sunday")}
                                                value={weekdays.sunday.time || ""}
                                            >
                                                <option value="">Select a shift</option>
                                                <option value="8:30am - 8:30pm">8:30am - 8:30pm</option>
                                                <option value="8:30pm - 8:30am">8:30pm - 8:30am</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

						<div className="save-schedule-div">
							<button
								onClick={handleSaveNewSchedule}
								disabled={selectedNurse === null || scheduleCategory == ""}
								className="save-schedule-btn">
								Save New Schedule
							</button>
						</div>
					</div>
					<div className="schedule">
						<h3>Schedule</h3>
						<table>
							<thead>
								<tr>
									<th>Start Time</th>
									<th>End Time</th>
									<th>Status</th>
									<th>Date</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{schedules && schedules.map((item) => (
									<tr key={item.id}>
										<td>{item.startTime}</td>
										<td>{item.endTime}</td>
										<td>{item.status}</td>
										<td>{item.date}</td>
										<td>
											<button
												className="cancel-schedule-btn"
												onClick={() => {
													handleCancelSchedule(item);
												}}>
												Cancel
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NurseManagement;
