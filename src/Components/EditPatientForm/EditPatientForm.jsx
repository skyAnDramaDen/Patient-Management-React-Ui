import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditPatientForm.css";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

const EditPatientForm = () => {
	const server_url = process.env.REACT_APP_API_URL;
	const { state } = useLocation();
	const navigate = useNavigate();
	const [patient, setPatient] = useState(state ? state.patient : null);
	const [newUser, setNewUser] = useState({
		username: "",
		password: "",
		role: "doctor",
	});

	const handleUserData = (e) => {
		setNewUser({ ...newUser, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (!state) {
			navigate("/");
		}
	}, [state, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPatient({ ...patient, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {
			patient: patient,
			user: newUser,
		};

		if (patient) {
			$.ajax({
				url: `${server_url}/patients/edit/${patient.id}`,
				method: "POST",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
					console.log(response);
				},
				error: function (error) {
					console.log(error);
				},
			});
		}

		// $.post(`${server_url}/patients/update`, payload, (response) => {
		//     console.log('Patient updated successfully!', response);
		//     navigate('/patient-profile', { state: { patient: response } });
		// }).fail((error) => {
		//     console.error('There was an error updating the patient!', error);
		//     alert('Failed to update patient.');
		// });
	};

	if (!patient) {
		return <p>Loading patient data...</p>;
	}

	return (
		<div className="patient-form">
			<PageHeader title="Edit Patient" />
			<form onSubmit={handleSubmit}>
				<label>
					First Name:
					<input
						type="text"
						name="firstName"
						value={patient.firstName}
						onChange={handleChange}
					/>
				</label>
				<label>
					Last Name:
					<input
						type="text"
						name="lastName"
						value={patient.lastName}
						onChange={handleChange}
					/>
				</label>
				<label>
					Date of Birth:
					<input
						type="date"
						name="dateOfBirth"
						value={patient.dateOfBirth}
						onChange={handleChange}
					/>
				</label>
				<label>
					Gender:
					<input
						type="text"
						name="gender"
						value={patient.gender}
						onChange={handleChange}
					/>
				</label>
				<label>
					Email:
					<input
						type="email"
						name="email"
						value={patient.email}
						onChange={handleChange}
					/>
				</label>
				<label>
					Phone Number:
					<input
						type="text"
						name="phoneNumber"
						value={patient.phoneNumber}
						onChange={handleChange}
					/>
				</label>
				<label>
					Address Line 1:
					<input
						type="text"
						name="addressLine1"
						value={patient.addressLine1}
						onChange={handleChange}
					/>
				</label>
				<label>
					City:
					<input
						type="text"
						name="city"
						value={patient.city}
						onChange={handleChange}
					/>
				</label>
				<label>
					State:
					<input
						type="text"
						name="state"
						value={patient.state}
						onChange={handleChange}
					/>
				</label>
				<label>
					Postal Code:
					<input
						type="text"
						name="postalCode"
						value={patient.postalCode}
						onChange={handleChange}
					/>
				</label>
				<label>
					Country:
					<input
						type="text"
						name="country"
						value={patient.country}
						onChange={handleChange}
					/>
				</label>
				<button type="submit">Save</button>
			</form>
		</div>
	);
};

export default EditPatientForm;
