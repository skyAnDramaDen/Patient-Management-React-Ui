import React, { useContext, useState, useEffect, useRef } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./BodyContent.css";
import Menu from "../Menu/Menu";
import HomePage from "../HomePage/HomePage";
import PatientRegistrationForm from "../PatientRegistrationForm/PatientRegistrationForm";
import PatientManagement from "../PatientManagement/PatientManagement";
import ViewPatients from "../ViewPatients/ViewPatients";
import PatientProfile from "../PatientProfile/PatientProfile";
import StaffManagement from "../StaffManagement/StaffManagement";
import ManageAppointments from "../ManageAppointments/ManageAppointments";
import EditPatientForm from "../EditPatientForm/EditPatientForm";
import AddAppointment from "../AddAppointment/AddAppointment";
import DoctorManagement from "../DoctorManagement/DoctorManagement";
import AddDoctorForm from "../AddDoctor/AddDoctor";
import DoctorProfile from "../DoctorProfile/DoctorProfile";
import AuthProvider, { AuthContext } from "../../Authcontext";
import DoctorMenu from "../DoctorMenu/DoctorMenu";
import DoctorHome from "../DoctorHome/DoctorHome";
import AppointmentDetails from "../AppointmentDetails/AppointmentDetails";
import ViewDoctor from "../ViewDoctor/ViewDoctor";
import HomeChat from "../HomeChat/HomeChat";
import DoctorChat from "../DoctorChat/DoctorChat";
import MedicalRecords from "../MedicalRecords/MedicalRecords";
import MedicalRecord from "../MedicalRecord/MedicalRecord";
import ViewFloors from "../ViewFloors/ViewFloors";
import ViewFloor from "../ViewFloor/ViewFloor";
import ViewWard from "../ViewWard/ViewWard";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Billing from "../Billing/Billing";
import Admissions from "../Admissions/Admissions";
import AdmitPatient from "../AdmitPatient/AdmitPatient";
import ViewAdmission from "../ViewAdmission/ViewAdmission";
import BillingCategory from "../BillingCategory/BillingCategory";
import DischargePatient from "../DischargePatient/DischargePatient";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Settings from "../Settings/Settings";
import ViewAppointment from "../ViewAppointment/ViewAppointment";
import RescheduleAppointment from "../RescheduleAppointment/RescheduleAppointment";
import NurseManagement from "../NurseManagement/NurseManagement";
import AddNurse from "../AddNurse/AddNurse";
import ViewNurse from "../ViewNurse/ViewNurse";
import NurseHome from "../NurseHome/NurseHome";
import NurseProfile from "../NurseProfile/NurseProfile";
import ViewNurseSchedules from "../ViewNurseSchedules/ViewNurseSchedules";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function BodyContent() {
	const { role } = useContext(AuthContext);
	const [active, setActive] = useState(false);
	const menuRef = useRef(null);

	const renderMenu = () => {
		if (role === "super-admin") {
			return <Menu />;
		} else if (role === "doctor") {
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
		<div className="bodycontent">
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
			<div className="content-div">
				<Routes>
					<Route path="/" element={<HomePage />}></Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "nurse"]} />
						}>
						<Route path="/patient-registration" element={<PatientRegistrationForm />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "nurse"]} />
						}>
						<Route path="/patient-management" element={<PatientManagement />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "nurse"]} />
						}>
						<Route path="/patients" element={<ViewPatients />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "nurse"]} />
						}>
						<Route path="/patient-profile" element={<PatientProfile />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/staff-management" element={<StaffManagement />} />
					</Route>
					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "nurse"]} />
						}>
						<Route path="/appointments" element={<ManageAppointments />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "nurse"]} />
						}>
						<Route path="/reschedule-appointment" element={<RescheduleAppointment />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "nurse"]} />
						}>
						<Route path="/patient/edit" element={<EditPatientForm />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "nurse"]} />
						}>
						<Route path="/appointments/new" element={<AddAppointment />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/staff/doctors" element={<DoctorManagement />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/staff/doctors/add" element={<AddDoctorForm />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/doctor-profile" element={<DoctorProfile />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "doctor"]} />
						}>
						<Route path="/doctor-home" element={<DoctorHome />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "nurse"]} />
						}>
						<Route path="/appointment-details" element={<AppointmentDetails />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/view-doctor-schedule" element={<ViewDoctor />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/staff/nurses" element={<NurseManagement />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/home-chat" element={<HomeChat />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "doctor"]} />
						}>
						<Route path="/doctor-chat" element={<DoctorChat />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "doctor", "nurse", "admin"]} />
						}>
						<Route path="/medical-records" element={<MedicalRecords />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "doctor", "nurse", "admin"]} />
						}>
						<Route path="/patient-medical-record" element={<MedicalRecord />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/view-floors" element={<ViewFloors />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/view-floor" element={<ViewFloor />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/view-ward" element={<ViewWard />} />
					</Route>
					
					<Route path="/billing-and-payment" element={<Billing />}>
						Billing
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "nurse"]} />
						}>
						<Route path="/admissions" element={<Admissions />} />
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
					{/* <Route path="/discharge-patient" element={<DischargePatient />}>
								Discharge Patient
				</Route> */}
					<Route
						path="/discharge-patient"
						element={
							<Elements stripe={stripePromise}>
								<DischargePatient />
							</Elements>
						}
					/>
					<Route path="/settings" element={<Settings />}>
						Settings
					</Route>
					<Route path="/view-appointment" element={<ViewAppointment />}>
						View Appointment (Doctor)
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/add-nurse" element={<AddNurse />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/view-nurse-schedule" element={<ViewNurse />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "nurse"]} />
						}>
						<Route path="/nurse-home" element={<NurseHome />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin"]} />
						}>
						<Route path="/nurse-profile" element={<NurseProfile />} />
					</Route>

					<Route
						element={
							<ProtectedRoute allowedRoles={["super-admin", "admin", "nurse"]} />
						}>
						<Route path="/nurse/view-nurse-schedules" element={<ViewNurseSchedules />} />
					</Route>
				</Routes>
			</div>
		</div>
	);
}
