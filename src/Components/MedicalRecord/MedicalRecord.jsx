import "./MedicalRecord.css";

import $ from "jquery";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";

export default function MedicalRecord() {
	const location = useLocation();
	const [patient, setPatient] = useState();

	const patient_self = location.state.patient;
	const server_url = process.env.REACT_APP_API_URL;

	const [medicalRecord, setMedicalRecord] = useState(null);
	const [formData, setFormData] = useState({
		allergies: "",
		current_medications: "",
		surgeries: "",
		family_medical_history: "",
		lifestyle_factors: "",
		past_illnesses: "",
		treatment_plans: "",
	});

	const [isSaveDisabled, setIsSaveDisabled] = useState(true);

	useEffect(() => {
		$.ajax({
			url: `${server_url}/medicalRecords/get-by/${location.state.patient.id}`,
			method: "GET",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setPatient(response);
				if (response.medical_record) {
					setMedicalRecord(response.medical_record);

					const normalizedData = Object.keys(response.medical_record).reduce(
						(acc, key) => {
							acc[key] =
								response.medical_record[key] === null
									? ""
									: response.medical_record[key];
							return acc;
						},
						{}
					);

					setFormData(normalizedData);
				}
			},
			error: (error) => {
				console.log(error);
			},
		});
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		setIsSaveDisabled(false);
	};

	const handleSave = () => {
		if (!medicalRecord) {
			alert("No medical record found to update.");
			return;
		}

		if (medicalRecord) {
			$.ajax({
				url: `${server_url}/medicalRecords/update/${medicalRecord.id}`,
				method: "POST",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(formData),
				success: function (response) {
					setMedicalRecord(response);
					setIsSaveDisabled(true);
					alert("Medical record updated successfully!");
				},
				error: function (error) {
					alert("Failed to update medical record.");
				},
			});
		}
	};

	return (
		<div className="medical-record">
			<PageHeader title="Medical Record" />
			<form>
				<div>
					<label>Allergies</label>
					<input
						type="text"
						name="allergies"
						value={formData.allergies || ""}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Medications</label>
					<input
						type="text"
						name="current_medications"
						value={formData.current_medications || ""}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Past Surgeries</label>
					<input
						type="text"
						name="surgeries"
						value={formData.surgeries || ""}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Family History</label>
					<input
						type="text"
						name="family_medical_history"
						value={formData.family_medical_history || ""}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Lifestyle factors</label>
					<input
						type="text"
						name="lifestyle_factors"
						value={formData.lifestyle_factors || ""}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Past Illnesses</label>
					<input
						type="text"
						name="past_illnesses"
						value={formData.past_illnesses || ""}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Treatment Plans</label>
					<input
						type="text"
						name="treatment_plans"
						value={formData.treatment_plans || ""}
						onChange={handleInputChange}
					/>
				</div>
				<button type="button" onClick={handleSave} disabled={isSaveDisabled}>
					Save
				</button>
			</form>
		</div>
	);
}
