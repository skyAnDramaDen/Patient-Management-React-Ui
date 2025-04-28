import "./AdmitPatient.css";

import React, { useState, useEffect } from "react";
import $ from "jquery";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdmitPatient() {
	const server_url = process.env.REACT_APP_API_URL;
	const location = useLocation();
	const [patient, setPatient] = useState();
	const [admitted, setAdmitted] = useState(false);
	const [availableBeds, setAvailableBeds] = useState([]);
	const [bedType, setBedType] = useState(null);
	const [selectedBed, setSelectedBed] = useState();
	const [selectedCheckbox, setSelectedCheckbox] = useState(null);
	const [selectedFloor, setSelectedFloor] = useState("");
	const [selectedWard, setSelectedWard] = useState(null);
	const [floors, setFloors] = useState([]);
	const [wards, setWards] = useState([]);
	const [admissionType, setAdmissionType] = useState("standard");

	const [reasonForAdmission, setReasonForAdmission] = useState();

	const handleBedChange = (e) => {
		const selectedBedId = e.target.value;
		const selectedBed = availableBeds.find(
			(bed) => bed.id.toString() === selectedBedId
		);

		setSelectedBed(selectedBed);
	};

	const handleWardChange = (e) => {
		const selectedWardId = e.target.value;
		const found_ward = wards.find((ward) => {
			return ward.id.toString() === selectedWardId;
		});

		setSelectedWard(found_ward);

		$.ajax({
			url: `${server_url}/admissions/get-available-beds-by-ward/${selectedWardId}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setAvailableBeds(response);
			},
			error: function (error) {
				console.log(error);
			},
		});
	};

	const handleFloorChange = (e) => {
		const selectedFloorId = e.target.value;
		const found_floor = floors.find((floor) => {
			return floor.id.toString() === selectedFloorId;
		});

		setSelectedFloor(found_floor);

		$.ajax({
			url: `${server_url}/admissions/get-floor-wards/${selectedFloorId}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				console.log("wards", response);
				if (response) {
					setWards(response);
				}
			},
			error: function (error) {
				console.log(error);
			},
		});
	};

	const handleBedTypeChange = (e) => {
		setBedType(e.target.value);

		const payload = {
			bedType: e.target.value,
		};

		$.ajax({
			url: `${server_url}/admissions/get-beds-by-type`,
			method: "POST",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			data: JSON.stringify(payload),
			success: function (response) {
				if (response) {
					setAvailableBeds(response);
				}
			},
			error: function (error) {
				console.log(error);
			},
		});
	};

	const handleCheckboxChange = (checkbox) => {
		setSelectedCheckbox((prev) => (prev === checkbox ? null : checkbox));
		setAvailableBeds(null);
		
		if (checkbox == "type") {
			setWards();
			setSelectedWard();
			setAvailableBeds();
		}
	};

	const handleConfirmAdmission = () => {
		let payload;

		if (selectedBed != null && patient != null && reasonForAdmission != null) {
			payload = {
				bedId: selectedBed.id,
				patientId: patient.id,
				reasonForAdmission: reasonForAdmission,
				wardId: selectedWard.id,
				type: admissionType,
			};

			$.ajax({
				url: `${server_url}/admissions/create`,
				method: "POST",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(payload),
				success: function (response) {
					console.log(response);
					if (response.admission.status == "admitted") {
						setAdmitted(true);
					}
				},
				error: function (error) {
					console.log(error);
					toast.error(
						error.responseJSON?.message ||
							"An error occurred while processing the request."
					);
				},
			});
		} else {
			alert("There are missing fields that you have not entered");
		}
	};

	useEffect(() => {
		if (location.state) {
			setPatient(location.state.patient);

			$.ajax({
				url: `${server_url}/admissions/get-admission-by-patient/${location.state.patient.id}`,
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
					if (response.status == "admitted") {
						setAdmitted(true);
					}
				},
				error: function (error) {
					console.log(error);
				},
			});

			$.ajax({
				url: `${server_url}/admissions/get-floors`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
					if (response) {
						setFloors(response);
					}
				},
				error: function (error) {
					console.log(error);
				},
			});
		}
	}, []);

	const handleAdmissionTypeChange = (e) => {
		setAdmissionType(e.target.value);
	}

	return (
		<div className="admit-patient">
			<PageHeader title="Admit Patient" />
			<div className="admission-status-bar">
				{patient && (
					<>
						<p>Name: {patient.firstName + " " + patient.lastName}</p>
						<div>{admitted && <p>Admitted</p>}</div>
					</>
				)}
			</div>
			<div className={admitted ? "disabled-div" : ""}>
				<div className="admission-type">
					<select
					
					onChange={(e) => {handleAdmissionTypeChange(e)}}>
						<option value="" defaultValue >Admission Type</option>
						<option value="emergency">Emergency</option>
						<option value="standard">Standard</option>
						<option value="VIP">VIP</option>
						<option value="transfer">Transfer</option>
					</select>
				</div>
				<div>
					<p>Get available beds by</p>
					<div className="checkboxes">
						<label>
							<input
								type="checkbox"
								checked={selectedCheckbox === "type"}
								onChange={() => {
									handleCheckboxChange("type");
								}}
							/>{" "}
							Bed Type
						</label>
						<br />
						<label>
							<input
								type="checkbox"
								checked={selectedCheckbox === "floorWard"}
								onChange={() => {
									handleCheckboxChange("floorWard");
								}}
							/>{" "}
							Floor/Ward
						</label>
					</div>
				</div>
				{selectedCheckbox == "type" && (
					<div>
						<select
							name="role"
							value={bedType}
							onChange={handleBedTypeChange}
							required>
							<option value="select" defaultValue>
								Select
							</option>
							<option value="regular">Regular</option>
							<option value="maternity">Maternity</option>
							<option value="ICU">ICU</option>
							<option value="pediatric">Pediatric</option>
						</select>
					</div>
				)}
				{selectedCheckbox == "floorWard" && (
					<div>
						<select onChange={handleFloorChange} required>
							<option value="" disabled selected>
								Select an Available Floor
							</option>
							{floors &&
								floors.map((floor) => (
									<option key={floor.id} value={floor.id}>
										{`${floor.name}`}
									</option>
								))}
						</select>
						{selectedFloor && (
							<select onChange={handleWardChange} required>
								<option value="" disabled selected>
									Select an Available Ward
								</option>
								{wards &&
									wards.map((ward) => (
										<option key={ward.id} value={ward.id}>
											{`${ward.name} ward`}
										</option>
									))}
							</select>
						)}
					</div>
				)}
				<div>
					{(selectedWard || bedType) && (
						<div>
							<select onChange={handleBedChange} required>
								<option value="" disabled selected>
									Select an Available Bed
								</option>
								{availableBeds &&
									availableBeds.map((bed) => (
										<option key={bed.id} value={bed.id}>
											{`${bed.bedNumber}, Bed Type: ${bed.type}, Status: ${bed.status}, Room: ${bed.room.number}, Ward: ${bed.room.ward.name}`}
										</option>
									))}
							</select>
						</div>
					)}
					<label>Reason for admission:</label>
					<textarea
						value={reasonForAdmission}
						onChange={(e) => {
							setReasonForAdmission(e.target.value);
						}}
					/>
					<button
						onClick={() => {
							handleConfirmAdmission();
						}}>
						Confirm Admission
					</button>
				</div>
			</div>
		</div>
	);
}

export default AdmitPatient;
