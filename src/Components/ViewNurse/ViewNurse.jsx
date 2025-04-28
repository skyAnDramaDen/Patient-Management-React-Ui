import "./ViewNurse.css";

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import $ from "jquery";
import NurseScheduleComp from '../NurseScheduleComp/NurseScheduleComp';
import PageHeader from '../PageHeader/PageHeader';

const ViewNurse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (location.state && location.state.nurse) {
      setNurse(location.state.nurse);
    } else {
      console.error("No nurse data passed in location state");
    }
  }, [location]);

  useEffect(() => {
    if (nurse != null) {
        $.ajax({
            url: `${server_url}/nurses/nurse-schedule/${nurse.id}`,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                setSchedules(response.nurse.schedules);
                setLoading(false);
            },
            error: function(error) {
                setLoading(false);
            }
        });
    }
  }, [nurse]);

  if (!location.state) {
    return <p>No state passed</p>;
  }

  if (loading) {
    return <p>Loading schedules...</p>;
  }

  return (
    <div className="view-doctor">
      <PageHeader  title="Nurse Schedule"/>
      {schedules.length === 0 ? (
        <p>No schedules available for this nurse.</p>
      ) : (
        <NurseScheduleComp nurse={ nurse }/>
      )}
    </div>
  );
};

export default ViewNurse;
