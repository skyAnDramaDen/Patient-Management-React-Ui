import React, { useContext, useState, useEffect, useRef } from 'react';

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
import AppointmentDetails from '../AppointmentDetails/AppointmentDetails';
import ViewDoctor from '../ViewDoctor/ViewDoctor';
import HomeChat from '../HomeChat/HomeChat';
import DoctorChat from '../DoctorChat/DoctorChat';
import MedicalRecords from '../MedicalRecords/MedicalRecords';
import MedicalRecord from '../MedicalRecord/MedicalRecord';
import ViewFloors from '../ViewFloors/ViewFloors';
import ViewFloor from '../ViewFloor/ViewFloor';
import ViewWard from '../ViewWard/ViewWard';
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Billing from '../Billing/Billing';
import Admissions from '../Admissions/Admissions';
import AdmitPatient from '../AdmitPatient/AdmitPatient';
import ViewAdmission from '../ViewAdmission/ViewAdmission';
import BillingCategory from '../BillingCategory/BillingCategory';
import DischargePatient from '../DischargePatient/DischargePatient';

export default function BodyContent() {
	const { role } = useContext(AuthContext);
	const [active, setActive] = useState(false);
	const menuRef = useRef(null);

	const renderMenu = () => {
		if (role === 'super-admin') {
		  return <Menu />;
		} else if (role === 'doctor') {
		  return <DoctorMenu />;
		} else {
		  return null;
		}
	  };

	  useEffect(() => {
		let timer;
		if (active) {
		  timer = setTimeout(() => setActive(false), 5000);
		}
		return () => clearTimeout(timer);
	  }, [active]);

	  useEffect(() => {
		const handleClickOutside = (event) => {
		  if (menuRef.current && !menuRef.current.contains(event.target)) {
			setActive(false);
		  }
		};
	
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	  }, [active]);
  return (
    <div className='bodycontent'>
        {/* {renderMenu()} */}
        {/* {active && renderMenu()} */}
		
		{/* <div ref={menuRef}  className={active ? "side-menu active" : "side-menu"}>
			<p onClick={() => { setActive(!active); }}
			className=''
			
			>
				{active ? <IoMdClose /> : <FaBars />}
			</p>
			{active && renderMenu()}
		</div>
		{!active && (
			<div className="menu-handle" onClick={() => setActive(!active)}>
			<FaBars />
			</div>
		)} */}

		{/* <p onClick={() => {setActive(!active)}}>{active ? <IoMdClose /> : <FaBars />}</p> */}
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
				<Route path="/doctor-profile" element={<DoctorProfile />}>
								Profile
				</Route>
				<Route path="/doctor-home" element={<DoctorHome />}>
								Home (Doctor)
				</Route>
				<Route path="/appointment-details" element={<AppointmentDetails />}>
								Appointment Details
				</Route>
				<Route path="/view-doctor-schedule" element={<ViewDoctor />}>
								View Doctor
				</Route>
				<Route path="/home-chat" element={<HomeChat />}>
								Chat (Home)
				</Route>
				<Route path="/doctor-chat" element={<DoctorChat />}>
								Chat (Doctor)
				</Route>
				<Route path="/medical-records" element={<MedicalRecords />}>
								Medical Records
				</Route>
				<Route path="/patient-medical-record" element={<MedicalRecord />}>
								Medical Record
				</Route>
				<Route path="/view-floors" element={<ViewFloors />}>
								Floors
				</Route>
				<Route path="/view-floor" element={<ViewFloor />}>
								Floor
				</Route>
				<Route path="/view-ward" element={<ViewWard />}>
								Ward
				</Route>
				<Route path="/billing-and-payment" element={<Billing />}>
								Billing
				</Route>
				<Route path="/admissions" element={<Admissions />}>
								Admissions
				</Route>
				<Route path="/admit-patient" element={<AdmitPatient />}>
								Admit Patient
				</Route>
				<Route path="/view-admission" element={<ViewAdmission />}>
								View Admission
				</Route>
				<Route path="/billing-category" element={<BillingCategory />}>
								Billing Category
				</Route>
				<Route path="/discharge-patient" element={<DischargePatient />}>
								Discharge Patient
				</Route>
			</Routes>
		</div>
    </div>
  )
}
