import "./DoctorManagement.css";
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import $ from 'jquery';

const DoctorManagement = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const [newSchedule, setNewSchedule] = useState({ date: "", time: "" });
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");

    useEffect(() => {
        // Fetch the list of doctors
        $.get('http://localhost:3000/doctors', (response) => {
            setDoctors(response);
            console.log(response);
        }).fail((error) => {
            console.error('There was an error fetching the doctors!', error);
        });

        // Mock schedule data
        setSchedule([
          {
            id: 1,
            start_time: "2025-02-11T09:00:00Z",
            end_time: "2025-02-11T10:00:00Z",
            status: "active"
          },
          {
            id: 2,
            start_time: "2025-02-11T10:30:00Z",
            end_time: "2025-02-11T11:30:00Z",
            status: "active"
          }
        ]);
    }, []);

    useEffect(() => {
        if (selectedDoctor) {
            const today = new Date();
            const nextThreeDays = [];
            for (let i = 0; i < 4; i++) {
                const date = new Date();
                date.setDate(today.getDate() + i);
                nextThreeDays.push(date.toISOString().split("T")[0]); // Format: YYYY-MM-DD
            }
            
            const doctorSchedule = schedule.filter(item => 
                item.doctorId === selectedDoctor.id && nextThreeDays.includes(item.date)
            );

            setFilteredSchedule(doctorSchedule);
        }
    }, [selectedDoctor, schedule]);

    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
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
    const handleStartTimeHourChange = (e) => {
        const hour = e.target.value;
        setSelectedStartTime(`${hour}:${selectedStartTime.split(":")[1]}`);
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

    const timeOptions = generateTimeOptions();
    
    
    const handleStartTimeMinuteChange = (e) => {
        const minute = e.target.value;
        setSelectedStartTime(`${selectedStartTime.split(":")[0]}:${minute}`);
    };
    
    const handleEndTimeHourChange = (e) => {
        const hour = e.target.value;
        setSelectedEndTime(`${hour}:${selectedEndTime.split(":")[1]}`);
    };
    
    const handleEndTimeMinuteChange = (e) => {
        const minute = e.target.value;
        setSelectedEndTime(`${selectedEndTime.split(":")[0]}:${minute}`);
    };
    

    const handleSaveNewSchedule = () => {
        if (!selectedDate || (!selectedStartTime && !selectedEndTime)) {
            alert("Please select both date and time.");
            return;
        }

        const newScheduleEntry = {
            id: schedule.length + 1, // Simple ID generation
            start_time: `${selectedDate}T${selectedStartTime}:00Z`,
            end_time: `${selectedDate}T${selectedEndTime}`,
            status: 1,
            doctorId: selectedDoctor.id
        };

        const scheduleEntry = {
            start_time: `${selectedDate}T${selectedStartTime}:00Z`,
            end_time: `${selectedDate}T${selectedEndTime}`,
            status: 1,
            doctorId: selectedDoctor.id
        };

        setSchedule([...schedule, newScheduleEntry]);
        setSelectedDate("");
        setSelectedEndTime("");
        setSelectedStartTime("");

        // Optionally, send the new schedule to the server
        $.post("http://localhost:3000/schedule/create", scheduleEntry, (response) => {
            console.log('New schedule added successfully:', response);
            setSchedule([...schedule, response]);
        }).fail((error) => {
            console.error('Error adding new schedule', error);
        });
    };

    return (
        <div className="doctor-management">
            <div className="top-view">
                <button className="back-button" onClick={() => navigate("/staff-management")}>
                    🔙 Back
                </button>
                <h2>Doctor Management</h2>
            </div>

            <div className="mngt-board">
                <div className="sidebar">
                    <h3>Doctors</h3>
                    <ul>
                        {doctors.map((doctor) => (
                            <li key={doctor.id} onClick={() => handleDoctorClick(doctor)}>
                                {doctor.firstName} {doctor.lastName}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="main-content">
                    {selectedDoctor ? (
                        <div className="doctor-details">
                            <h3>Doctor Details</h3>
                            <p><strong>Name:</strong> {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                            <p><strong>Email:</strong> {selectedDoctor.email}</p>
                            <p><strong>Phone:</strong> {selectedDoctor.phoneNumber}</p>
                        </div>
                    ) : (
                        <p>Select a doctor to see the details</p>
                    )}

                    <div className="schedule">
                        <h3>Add New Schedule</h3>
                        <div>
                            <label>Date: </label>
                            <input type="date" value={selectedDate} onChange={handleDateChange} />
                        </div>
                        <div className="times">
                            <div>
                                <label>Start Time: </label>
                                <select value={selectedStartTime} onChange={handleStartTimeChange}>
                                    {timeOptions.map((time, index) => (
                                        <option key={index} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>End Time: </label>
                                <select value={selectedEndTime} onChange={handleEndTimeChange}>
                                    {timeOptions.map((time, index) => (
                                        <option key={index} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <button onClick={handleSaveNewSchedule} disabled={selectedDoctor === null}>Save New Schedule</button>
                    </div>

                    <div className="schedule">
                        <h3>Schedule</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((item) => (
                                    <tr key={item.id}>
                                        <td>{new Date(item.start_time).toLocaleString()}</td>
                                        <td>{new Date(item.end_time).toLocaleString()}</td>
                                        <td>{item.status}</td>
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