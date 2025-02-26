import React, { useContext } from 'react';

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
import AddDoctorForm from '../AddDoctor/AddDoctor';
import DoctorProfile from '../DoctorProfile/DoctorProfile';
import AuthProvider, { AuthContext } from "../../Authcontext";
import DoctorMenu from '../DoctorMenu/DoctorMenu';
import DoctorHome from '../DoctorHome/DoctorHome';
import DoctorDashboard from '../DoctorDashboard/DoctorDashboard';
import AppointmentDetails from '../AppointmentDetails/AppointmentDetails';
import ViewDoctor from '../ViewDoctor/ViewDoctor';

export default function BodyContent() {
	const { role } = useContext(AuthContext);

	const renderMenu = () => {
		if (role === 'super-admin') {
		  return <Menu />;
		} else if (role === 'doctor') {
		  return <DoctorMenu />;
		} else {
		  return null;
		}
	  };
  return (
    <div className='bodycontent'>
        {renderMenu()}
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
								Add Appointment
							</Route>
				<Route path="/staff/doctors" element={<DoctorManagement />}>
								Doctors
							</Route>
				<Route path="/staff/doctors/add" element={<AddDoctorForm />}>
								Add Doctors
							</Route>
				<Route path="/staff/doctor/profile" element={<DoctorProfile />}>
								Profile
				</Route>
				<Route path="/doctor-home" element={<DoctorHome />}>
								Home (Doctor)
				</Route>
				<Route path="/doctor-dashboard" element={<DoctorDashboard />}>
								Home (Doctor)
				</Route>
				<Route path="/appointment-details" element={<AppointmentDetails />}>
								Appointment Details
				</Route>
				<Route path="/view-doctor-schedule" element={<ViewDoctor />}>
								View Doctor
				</Route>
			</Routes>
		</div>
    </div>
  )
}
