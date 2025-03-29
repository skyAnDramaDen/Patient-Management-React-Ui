import "./DoctorManagement.css";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import PageHeader from "../PageHeader/PageHeader";

const DoctorManagement = () => {
    const server_url = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");

    // useEffect(() => {
    //     const now = new Date(Date.now());
        
    //     $.ajax({
    //         url: 'http://localhost:3000/doctors',
    //         method: 'GET',
    //         headers: {
    //             "Authorization": `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json"
    //         },
    //         success: function(response) {
    //             setDoctors(response);
    //         },
    //         error: function(error) {
    //             console.error('There was an error fetching the doctors!', error);
    //         }
    //     });
        
    // }, []);

    useEffect(() => {
        const now = new Date(Date.now());
        $.ajax({
            url: `${server_url}/doctors`,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(),
            success: function(response) {
                console.log(response);
                setDoctors(response);
                
            },
            error: function(error) {
                console.error('There was an error fetching the doctors!', error);
            }
        });
    }, [])

    useEffect(() => {
        if (doctors) {
            console.log(doctors)
        }
    }, [doctors])

    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        setSchedule(doctor.schedules || []);
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
    
    // console.log(timeOptions);

    const handleSaveNewSchedule = () => {
        if (!selectedDate || (!selectedStartTime && !selectedEndTime)) {
            alert("Please select both date and time.");
            return;
        }

        const newScheduleEntry = {
            id: schedule.length + 1, 
            start_time: `${selectedDate}T${selectedStartTime}:00Z`,
            end_time: `${selectedDate}T${selectedEndTime}`,
            status: 1,
            doctorId: selectedDoctor.id,
            date: selectedDate
        };

        const scheduleEntry = {
            startTime: `${selectedDate}T${selectedStartTime}:00Z`,
            endTime: `${selectedDate}T${selectedEndTime}`,
            status: 1,
            doctorId: selectedDoctor.id,
            date: selectedDate
        };

        // setSchedule([...schedule, newScheduleEntry]);

        $.ajax({
            url: `${server_url}/schedule/create`,
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(scheduleEntry),
            success: function(response) {
                console.log('New schedule added successfully:', response);
                setSchedule([...schedule, response]);

                setSelectedDate("");
                setSelectedEndTime("");
                setSelectedStartTime("");
            },
            error: function(error) {
                console.error('Error adding new schedule', error);
                alert('Failed to add schedule.');
            }
        });
    };

    const addDoctor = function() {
            
    }

    return (
        
        <div className="doctor-management">
            <PageHeader  title="Doctor Management" backPath="/staff-management"  />

            <div className="mngt-board">
                <div className="sidebar">
                    <h3>Doctors</h3>
                    <button>All Schedules</button>
                    <Link to="/staff/doctors/add" style={{ textDecoration: "none", color: "inherit" }}>
                        <button onClick={addDoctor}>➕ Add Doctor</button>
                    </Link>
                    
                    <ul>
                        {doctors.map((doctor, index) => (
                            <li key={doctor.id} onClick={() => handleDoctorClick(doctor)}>
                                {doctor.firstName} {doctor.lastName}
                                <Link 
                                    to="/view-doctor-schedule"
                                    state={{ doctor }} 
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
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
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.startTime}</td>
                                        <td>{item.endTime}</td>
                                        <td>{item.status}</td>
                                        <td>{item.date}</td>
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