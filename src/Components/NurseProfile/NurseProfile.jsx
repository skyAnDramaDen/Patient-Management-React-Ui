import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import $ from "jquery";
import "./NurseProfile.css";
import PageHeader from '../PageHeader/PageHeader';

const NurseProfile = () => {
  const server_url = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (location.state && location.state.nurse) {
      setNurse(location.state.nurse);
      setFormData(location.state.nurse); 
    } else {
      console.error("No Nurse data passed in location state");
      // navigate("/staff/nurses"); 
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsSaveDisabled(false);
  };

  const handleSave = () => {
    $.ajax({
      url: `${server_url}/nurses/nurse/update/${nurse.id}`,
      method: 'PUT',
      headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
      },
      data: JSON.stringify(formData),
      success: function(response) {
          navigate('/nurse-profile', { state: { nurse: response } });
      },
      error: function(error) {
          console.error('There was an error updating the Nurse!', error);
          alert('Failed to update Nurse.');
      }
    });
    
    setIsSaveDisabled(true);
    alert("Nurse details saved successfully!");
  };

  if (!location.state) {
    return <p>No state passed</p>;
  }

  if (!nurse) {
    return <p>Loading Nurse data...</p>;
  }

  return (
    <div className='nurse-profile'>
      <PageHeader title="Nurse Profile" />
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Middle Name:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={formData.gender || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address Line 1:</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1 || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address Line 2:</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2 || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Specialization:</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Medical License Number:</label>
          <input
            type="text"
            name="medicalLicenseNumber"
            value={formData.medicalLicenseNumber || ''}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default NurseProfile;
