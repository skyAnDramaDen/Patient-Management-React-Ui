import React from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import './BodyContent.css';
import Menu from '../Menu/Menu';
import HomePage from '../HomePage/HomePage';
import PatientRegistrationForm from '../PatientRegistrationForm/PatientRegistrationForm';
import PatientManagement from '../PatientManagement/PatientManagement';
import ViewPatients from '../ViewPatients/ViewPatients';
import PatientProfile from '../PatientProfile/PatientProfile';
import StaffManagement from '../StaffManagement/StaffManagement';
import ManageAppointments from '../ManageAppointments/ManageAppointments';
import EditPatientForm from '../EditPatientForm/EditPatientForm';
import AddAppointment from '../AddAppointment/AddAppointment';
import DoctorManagement from '../DoctorManagement/DoctorManagement';

export default function BodyContent() {
  return (
    <div className='bodycontent'>
        <Menu />
        <div className='content-div'>
        <Routes>
          <Route path="/" element ={<HomePage />}></Route>
          <Route path="/patient-registration" element={<PatientRegistrationForm />}>
						Home
					</Route>
          <Route path="/patient-management" element={<PatientManagement />}>
						Patient Management
					</Route>
          <Route path="/patients" element={<ViewPatients />}>
						View Patients
					</Route>
          {/* <Route path="/patient/:id" element={<PatientProfile />} /> */}
          <Route path="/patient-profile" element={<PatientProfile />}>
						Patient Profile
					</Route>
          <Route path="/staff-management" element={<StaffManagement />}>
						Staff Management
					</Route>
          <Route path="/appointments" element={<ManageAppointments />}>
						Appointments
					</Route>
          <Route path="/patient/edit" element={<EditPatientForm />}>
						Edit Patient
					</Route>
          <Route path="/appointments/new" element={<AddAppointment />}>
						Edit Patient
					</Route>
          <Route path="/staff/doctors" element={<DoctorManagement />}>
						Doctors
					</Route>
        </Routes>
        </div>
      
    </div>
  )
}
