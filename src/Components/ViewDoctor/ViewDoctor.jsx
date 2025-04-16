import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import $ from "jquery";
import './ViewDoctor.css';
import DoctorScheduleComp from '../DoctorScheduleComp/DoctorScheduleComp';
import PageHeader from '../PageHeader/PageHeader';

const ViewDoctor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.REACT_APP_API_URL;

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
            url: `${server_url}/doctors/doctor-schedule/${doctor.id}`,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
              if (response.schedules == null) {
                setSchedules([]);
              } else {
                setSchedules(response.schedules);
              }
              setLoading(false);
            },
            error: function(error) {
                console.error('There was an error fetching the schedules!', error);
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
    <div className="view-doctor">
      <PageHeader  title="Doctor Schedule"/>
      {schedules.length === 0 ? (
        <p>No schedules available for this doctor.</p>
      ) : (
        <DoctorScheduleComp doctor={ doctor }/>
      )}
    </div>
  );
};

export default ViewDoctor;
