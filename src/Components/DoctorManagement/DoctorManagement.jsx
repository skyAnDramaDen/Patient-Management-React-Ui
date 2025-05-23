import "./DoctorManagement.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect, use, useContext } from "react";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorManagement = () => {
	const server_url = process.env.REACT_APP_API_URL;
	const navigate = useNavigate();
	const [doctors, setDoctors] = useState([]);
	const [selectedDoctor, setSelectedDoctor] = useState(null);
	const [schedules, setSchedules] = useState([]);
	const [selectedDate, setSelectedDate] = useState("");
	const [selectedStartTime, setSelectedStartTime] = useState("");
	const [selectedEndTime, setSelectedEndTime] = useState("");
    const [startOfWeek, setStartOfWeek] = useState();
    const [startOfWeekFormattedDate, setStartOfWeekFormattedDate] = useState();
    const [scheduleCategory, setScheduleCategory] = useState("single-day");
    const [doctorSearch, setDoctorSearch] = useState("");
    const [fetchedDoctors, setFetchedDoctors] = useState([]);
    const [reachedLastSunday, setReachedLastSunday] = useState(true);

    const [weekdays, setWeekdays] = useState({
        monday: { selected: false, time: "" },
        tuesday: { selected: false, time: "" },
        wednesday: { selected: false, time: "" },
        thursday: { selected: false, time: "" },
        friday: { selected: false, time: "" },
        saturday: { selected: false, time: "" },
        sunday: { selected: false, time: "" },
    })

	const [scheduleData, setScheduleData] = useState({
		date: "",
		startTime: "",
		endTime: "",
	});

	useEffect(() => {
        const { formattedDate, nextSunday } = findNextSunday();
        
        setStartOfWeek(nextSunday);
        setStartOfWeekFormattedDate(formattedDate);
		$.ajax({
			url: `${server_url}/doctors`,
			method: "GET",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setDoctors(response);
			},
			error: function (error) {
				console.error("There was an error fetching the doctors!", error);
			},
		});
	}, []);

    useEffect(() => {
		if (doctorSearch.length > 1) {
			$.ajax({
				url: `${server_url}/doctors/get-doctors-by-name?search=${doctorSearch}`,
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (data) {
                    
					if (Array.isArray(data.doctors)) {
						setFetchedDoctors(data.doctors);
					} else {
						setFetchedDoctors([]);
					}
				},
				error: function (err) {
					console.error("Error fetching patients:", err);
					setFetchedDoctors([]);
				},
			});
		} else {
			setFetchedDoctors([]);
		}
	}, [doctorSearch]);

	const handleDoctorClick = (doctor) => {
		setSelectedDoctor(doctor);
		setSchedules(doctor.schedules);
        setFetchedDoctors([]);
	};

	const handleDateChange = (e) => {
		setSelectedDate(e.target.value);
		setSelectedStartTime("");
		setSelectedEndTime("");
		// setScheduleData(prev => ({ ...prev, date: date.format("YYYY-MM-DD") }));
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
		if (scheduleCategory == "single-day") {
            if (!selectedDate || (!selectedStartTime && !selectedEndTime)) {
                alert("Please select both date and time.");
                return;
            }
            const newScheduleEntry = {
                id: schedules.length + 1,
                start_time: `${selectedDate}T${selectedStartTime}:00Z`,
                end_time: `${selectedDate}T${selectedEndTime}`,
                status: 1,
                doctorId: selectedDoctor.id,
                date: selectedDate,
            };
    
            const scheduleEntry = {
                startTime: `${selectedDate}T${selectedStartTime}:00Z`,
                endTime: `${selectedDate}T${selectedEndTime}`,
                status: 1,
                doctorId: selectedDoctor.id,
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
                    if (error.status == 408) {
                        toast.error(
                            "Cannot create a schedule for a date that is in the past."
                        );
                    } else if (error.status == 400) {
                        toast.error("Doctor is scheduled for the same day already.");
                    }
                },
            });
        } else if (scheduleCategory == "whole-week" && weekdays && startOfWeekFormattedDate) {
            if (weekdays && selectedDoctor) {
                for (const [day, data] of Object.entries(weekdays)) {
                    if (data.selected && !data.time) {
                        toast.error(`You have not selected a shift time for ${day.toUpperCase()}!`);
                        return false;
                    }
                }

                const { formattedDate, nextSunday } = findNextSunday();

                let payload = {
                    weekdays: weekdays,
                    nextSunday: new Date(startOfWeekFormattedDate).toDateString(),
                    doctorId: selectedDoctor.id,
                }

                $.ajax({
                    url: `${server_url}/schedule/create-schedule-for-coming-week`,
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify(payload),
                    success: function (response) {
                        setSchedules([...schedules, ...response]);
                        toast.success("The doctor has been scheduled for the selected days");
                    },
                    error: function (error) {
                        if (error.status == 408) {
                            toast.error(
                                "Cannot create a schedule for a date that is in the past."
                            );
                        } else if (error.status == 400) {
                            toast.error(error.responseJSON.message);
                        } else if (error.status == 404) {
                            toast.error(error.responseJSON.message);
                        } else if (error.status == 409) {
                            toast.error(error.responseJSON.message);
                        }
                    },
                });
            }
        }
	};

	const addDoctor = function () {};

	const handleCancelSchedule = (individual_schedule) => {
		const confirmCancel = window.confirm("Are you sure you want to cancel the scheduling?");

		if (confirmCancel) {
			const payload = {
				schedule: individual_schedule,
			};

			$.ajax({
				url: `${server_url}/schedule/cancel-schedule`,
				method: "POST",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(payload),
				success: function (response) {
					if (response.success == true) {
						setSchedules((prevSchedules) =>
							prevSchedules.filter(
								(schedule) => schedule.id !== individual_schedule.id
							)
						);
					}
				},
				error: function (error) {
					console.log(error);
				},
			});
		}
	};

    const handleDayCheckboxChange = (e) => {
        let weekday = e.target.id;

        setWeekdays((prevState) => {
            const isSelected = prevState[weekday].selected;

            return {
                ...prevState,
                [weekday]: {
                    ...prevState[weekday],
                    selected: !prevState[weekday].selected,
                    time: !isSelected ? prevState[weekday].time : "",
                }
            };
        })
    }

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
        if (e.target.name == "single-day") {
            if (e.target.checked) {
                setScheduleCategory(e.target.name);
            } else {
                setScheduleCategory("");
            }
        }

        if (e.target.name == "whole-week") {
            if (e.target.checked) {
                setScheduleCategory(e.target.name);
            } else {
                setScheduleCategory("");
            }
        }
    }

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
    
	return (
		<div className="doctor-management">
			<PageHeader title="Doctor Management" backPath="/staff-management" />

			<div className="mngt-board">
				<div className="sidebar">
					<h3>Doctors</h3>
					<button>All Schedules</button>
					<Link
						to="/staff/doctors/add"
						style={{ textDecoration: "none", color: "inherit" }}>
						<button onClick={addDoctor}>➕ Add Doctor</button>
					</Link>
                    <label>Search doctor</label>
                    <input
                    type="text"
                    value={doctorSearch} 
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    />

                    <ul>
                        {
                            fetchedDoctors.map((doc) => (
                                <li key={doc.id} onClick={() => {
                                    handleDoctorClick(doc);
                                }}>{doc.firstName + " " + doc.lastName}<button className="view-filtered-doc-btn"
                                onClick={() => {
                                    navigate("/view-doctor-schedule", { state: { doctor: doc } });
                                }}
                                >View</button>
                                </li>
                            ))
                            
                        }
                    </ul>

					<ul className="scrollable-side-list">
						{doctors.map((doctor, index) => (
							<li key={doctor.id} onClick={() => handleDoctorClick(doctor)}>
								{doctor.firstName} {doctor.lastName}
								<Link
									to="/view-doctor-schedule"
									state={{ doctor }}
									style={{ textDecoration: "none", color: "inherit" }}>
									<button>View</button>
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="main-content">
					{selectedDoctor ? (
						<div className="doctor-details">
							<h3>Doctor Details</h3>
							<p>
								<strong>Name:</strong> {selectedDoctor.firstName}{" "}
								{selectedDoctor.lastName}
							</p>
							<p>
								<strong>Specialization:</strong> {selectedDoctor.specialization}
							</p>
						</div>
					) : (
						<p>Select a doctor to see the details</p>
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
								disabled={selectedDoctor === null || scheduleCategory == ""}
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
								{schedules.map((item) => (
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

export default DoctorManagement;
