import "./DoctorDashboard.css";
import React from 'react';
import { useLocation } from 'react-router-dom';

const DoctorDashboard = () => {
  const location = useLocation();
  const { user } = location.state || {};

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.username}!</p>
          {/* Render other user data as needed */}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
