import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import $ from "jquery";
import './ViewDoctor.css'; // Import the CSS file
import DoctorScheduleComp from '../DoctorScheduleComp/DoctorScheduleComp';
import PageHeader from '../PageHeader/PageHeader';

const ViewDoctor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

//   console.log(location);

  useEffect(() => {
    if (location.state && location.state.doctor) {
      setDoctor(location.state.doctor);
    } else {
      console.error("No doctor data passed in location state");
    }
  }, [location]);

  useEffect(() => {
    if (doctor != null) {
        $.ajax({
            url: `http://localhost:3000/doctors/doctor-schedule/${doctor.id}`,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                console.log('Schedules fetched successfully!', response);
                if (response.schedules == null) {
                    setSchedules([]);
                } else {
                    setSchedules(response.schedules);
                }
                
                setLoading(false);
            },
            error: function(error) {
                console.error('There was an error fetching the schedules!', error);
                alert('Failed to fetch schedules.');
                setLoading(false);
            }
        });
    }
  }, [doctor]);

  if (!location.state) {
    return <p>No state passed</p>;
  }

  if (loading) {
    return <p>Loading schedules...</p>;
  }

  return (
    <div class="view-doctor">
      <PageHeader  title="Doctor Schedule"/>
      {schedules.length === 0 ? (
        <p>No schedules available for this doctor.</p>
      ) : (
        // <ul className="no-bullets"> {/* Apply the CSS class */}
        //   {schedules.map((schedule) => (
        //     <li key={schedule.id}>
        //       <strong>Date:</strong> {schedule.date} <br />
        //       <strong>Time:</strong> {schedule.time} <br />
        //       <strong>Patient:</strong> {schedule.patientName} <br />
        //       <strong>Notes:</strong> {schedule.notes}
        //     </li>
        //   ))}
        // </ul>
        <DoctorScheduleComp doctor={ doctor }/>
      )}
    </div>
  );
};

export default ViewDoctor;
