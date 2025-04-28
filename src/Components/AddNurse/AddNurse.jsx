import "./AddNurse.css";

import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, Link } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

function AddNurse() {
	const server_url = process.env.REACT_APP_API_URL;
	const navigate = useNavigate();
	const [newUser, setNewUser] = useState({
		username: "",
		password: "",
		role: "nurse",
	});
	const [nurse, setNurse] = useState({
		firstName: "",
		lastName: "",
		middleName: "",
		dateOfBirth: "",
		gender: "",
		email: "",
		phoneNumber: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		postalCode: "",
		country: "",
		specialization: "",
	});

	const handleChange = (e) => {
		setNurse({ ...nurse, [e.target.name]: e.target.value });
	};

	const handleUserData = (e) => {
		setNewUser({ ...newUser, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {
			nurse: nurse,
			user: newUser,
		};

		$.ajax({
			url: `${server_url}/nurses/create`,
			method: "POST",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			data: JSON.stringify(payload),
			success: function (response) {
				console.log("Nurse created successfully!", response);
				navigate("/nurse-profile", { state: { patient: response } });
			},
			error: function (error) {
				console.error("There was an error creating the nurse!", error);
				alert("Failed to create nurse.");
			},
		});

		// setNurse({
		// 	firstName: "",
		// 	lastName: "",
		// 	middleName: "",
		// 	dateOfBirth: "",
		// 	gender: "",
		// 	email: "",
		// 	phoneNumber: "",
		// 	addressLine1: "",
		// 	addressLine2: "",
		// 	city: "",
		// 	state: "",
		// 	postalCode: "",
		// 	country: "",
		// 	specialization: "",
		// });
	};
	return (
		<div className="add-nurse">
			<PageHeader title="Add Nurse" backPath="/staff/nurses" />

			<form onSubmit={handleSubmit} className="add-nurse-form">
				<h3>Add Nurse</h3>
				<input
					type="text"
					name="firstName"
					placeholder="First Name"
					value={nurse.firstName}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="lastName"
					placeholder="Last Name"
					value={nurse.lastName}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="middleName"
					placeholder="Middle Name"
					value={nurse.middleName}
					onChange={handleChange}
				/>
				<input
					type="date"
					name="dateOfBirth"
					value={nurse.dateOfBirth}
					onChange={handleChange}
					required
				/>
				<select
					name="gender"
					value={nurse.gender}
					onChange={handleChange}
					required>
					<option value="select" disabled>
						Select Gender
					</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</select>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={nurse.email}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="phoneNumber"
					placeholder="Phone Number"
					value={nurse.phoneNumber}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="addressLine1"
					placeholder="Address Line 1"
					value={nurse.addressLine1}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="addressLine2"
					placeholder="Address Line 2"
					value={nurse.addressLine2}
					onChange={handleChange}
				/>
				<input
					type="text"
					name="city"
					placeholder="City"
					value={nurse.city}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="state"
					placeholder="State"
					value={nurse.state}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="postalCode"
					placeholder="Postal Code"
					value={nurse.postalCode}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="country"
					placeholder="Country"
					value={nurse.country}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="specialization"
					placeholder="Specialization"
					value={nurse.specialization}
					onChange={handleChange}
					required
				/>

				<input
					type="text"
					name="username"
					placeholder="Username"
					value={newUser.username}
					onChange={handleUserData}
					required
				/>
				<input
					type="text"
					name="password"
					placeholder="Password"
					value={newUser.password}
					onChange={handleUserData}
					required
				/>
				<label>Role:</label>
				<select
					name="role"
					value={newUser.role}
					onChange={handleUserData}
					required>
					<option value="nurse">Nurse</option>
				</select>
				<button type="submit">Add Nurse</button>
			</form>
		</div>
	);
}

export default AddNurse;
