import "./DischargePatient.css";

import React, { useState, useEffect, use } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

function DischargePatient() {
	const location = useLocation();
	const [patient, setPatient] = useState(null);
	const [admission, setAdmission] = useState(null);
	const [admittedFor, setAdmittedFor] = useState();
	const server_url = process.env.REACT_APP_API_URL;
	const [billingCategories, setBillingCategories] = useState([]);
	const [admissionFee, setAdmissionFee] = useState();
	const [bedAllocationFee, setBedAllocationFee] = useState();
	const [noOfHoursStayed, setNoOfHoursStayed] = useState();
	let admittedForNoOfDays = 0;

	useEffect(() => {
		$.ajax({
			url: `${server_url}/admissions/get-admission-billing-categories`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				console.log(response);
				response.map((item) => {
					if (item.code == 1123) {
						setAdmissionFee(item);
					} else if (item.code == 1244) {
						setBedAllocationFee(item);
					}
				});
				setBillingCategories(response);
			},
			error: function (error) {
				console.log("error");
				console.log(error);
			},
		});
	}, []);

	useEffect(() => {
		if (location) {
			setPatient(location.state.admission.admissionPatient);
			setAdmission(location.state.admission);
		}
	}, [location]);

	const getNoOfHoursStayed = (date) => {
		const milliseconds = new Date(date).getTime();

		return Math.floor((new Date().getTime() - milliseconds) / (1000 * 60 * 60));
	};

	useEffect(() => {
		admittedForNoOfDays = admittedFor;
	}, [admittedFor]);

	const getNoOfEachMeal = () => {
		let noOfBreakfast = 0,
			noOfLunches = 0,
			noOfDinners = 0;

		if (admission) {
			const admittedForNoOfDays = diffInDays(admission.admissionDate);
			const admissionDate = new Date(admission.admissionDate);
			const now = new Date();

			const isBefore = (now, targetDate) => now < targetDate;
			const isAfter = (now, targetDate) => now > targetDate;
			const isBetween = (now, start, end) => now >= start && now < end;

			const startOf9AM = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				9
			);
			const startOf12PM = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				12
			);
			const startOf6PM = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				18
			);

			if (admissionDate < startOf9AM) {
				if (isBefore(now, startOf9AM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf9AM, startOf12PM)) {
					noOfBreakfast = admittedForNoOfDays + 1;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf12PM, startOf6PM)) {
					noOfBreakfast = admittedForNoOfDays + 1;
					noOfLunches = admittedForNoOfDays + 1;
					noOfDinners = admittedForNoOfDays;
				} else {
					noOfBreakfast = admittedForNoOfDays + 1;
					noOfLunches = admittedForNoOfDays + 1;
					noOfDinners = admittedForNoOfDays + 1;
				}
			} else if (isBetween(now, startOf9AM, startOf12PM)) {
				if (isBefore(now, startOf9AM)) {
					noOfBreakfast = admittedForNoOfDays - 1;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf9AM, startOf12PM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf12PM, startOf6PM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays + 1;
					noOfDinners = admittedForNoOfDays;
				} else if (isAfter(now, startOf6PM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays + 1;
				}
			} else if (isBetween(now, startOf12PM, startOf6PM)) {
                if (isBefore(now, startOf9AM)) {
					noOfBreakfast = admittedForNoOfDays - 1;
					noOfLunches = admittedForNoOfDays - 1;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf9AM, startOf12PM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays - 1;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf12PM, startOf6PM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays;
				} else if (isAfter(now, startOf6PM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays + 1;
				}
            } else if (isAfter(now, startOf6PM)) {
                if (isBefore(now, startOf9AM)) {
					noOfBreakfast = admittedForNoOfDays;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf9AM, startOf12PM)) {
					noOfBreakfast = admittedForNoOfDays + 1;
					noOfLunches = admittedForNoOfDays;
					noOfDinners = admittedForNoOfDays;
				} else if (isBetween(now, startOf12PM, startOf6PM)) {
					noOfBreakfast = admittedForNoOfDays + 1;
					noOfLunches = admittedForNoOfDays + 1;
					noOfDinners = admittedForNoOfDays;
				} else if (isAfter(now, startOf6PM)) {
					noOfBreakfast = admittedForNoOfDays + 1;
					noOfLunches = admittedForNoOfDays + 1;
					noOfDinners = admittedForNoOfDays + 1;
				}
            }
		}

		return { noOfBreakfast, noOfLunches, noOfDinners };
	};

	const diffInDays = (date_of_admission) => {
		const admissionDate = new Date(date_of_admission);

		const now = new Date();

		const diff_in_milliseconds = now - admissionDate;

		const diffInDays = Math.floor(diff_in_milliseconds / (1000 * 60 * 60 * 24));
		const diffInHours = Math.ceil(diff_in_milliseconds / (60 * 1000 * 60));

		return diffInDays;
	};

	useEffect(() => {
		if (admission) {
			setNoOfHoursStayed(getNoOfHoursStayed(admission.admissionDate));

			setAdmittedFor(diffInDays(admission.admissionDate));
			console.log(getNoOfEachMeal());
		}
	}, [admission]);

	return (
		<div className="discharge-patient">
			<PageHeader title="Discharge Patient" />
			<div>
				<div>
					{admission && (
						<div>
							Name: {patient && patient.firstName + " " + patient.lastName}
							<div>
								<strong>Admitted on:</strong> {admission.admissionDate}
								{admittedFor && (
									<div>
										<strong>Admitted for:</strong> {admittedFor} Days
									</div>
								)}
							</div>
							<div>
								<table className="billing-categories-table">
									<thead className="table-header">
										<tr>
											<th className="col-name">Name</th>
											<th className="col-rate">Rate</th>
											<th className="col-quantity">Quantity</th>
											<th>Total</th>
										</tr>
									</thead>
									<tbody className="table-body">
										<tr>
											<td>Admissionn Fee</td>
											<td>{admissionFee && admissionFee.rate}</td>
											<td>x 1</td>
											<td>{admissionFee && admissionFee.rate * 1}</td>
										</tr>
										<tr>
											<td>Bed Allocation Fee</td>
											<td>{bedAllocationFee && bedAllocationFee.rate}</td>
											<td>x {noOfHoursStayed && noOfHoursStayed}</td>
											<td>
												{bedAllocationFee &&
													noOfHoursStayed &&
													bedAllocationFee.rate * noOfHoursStayed}
											</td>
										</tr>
										{/* {billingCategories?.map((item) => (
											<tr key={item.id} className="table-row">
												<td className="col-name cell">{item.name}</td>
												<td className="col-rate cell">{item.rate}</td>
                                                <td>
                                                    {
                                                        item.code == 1234 ? 1 : ""
                                                    }
                                                </td>
                                                <td>
                                                    
                                                </td>
											</tr>
										))} */}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default DischargePatient;
