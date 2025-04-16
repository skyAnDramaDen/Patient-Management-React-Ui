import "./DischargePatient.css";
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import CardDetailsForm from "../CardDetailsForm/CardDetailsForm";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import AuthProvider, { AuthContext } from "../../Authcontext";

function DischargePatient() {
	const location = useLocation();
	const [patient, setPatient] = useState(null);
	const [admission, setAdmission] = useState(null);
	const server_url = process.env.REACT_APP_API_URL;
	const [showBillingForm, setShowBillingForm] = useState(false);
	const [paymentType, setPaymentType] = useState();
	const [paidCash, setPaidCash] = useState(false);
    const [paidCard, setPaidCard] = useState(false);
    const { user } = useContext(AuthContext);

	const stripe = useStripe();
	const elements = useElements();

	const [fees, setFees] = useState({
		admissionFee: null,
		bedAllocationFee: null,
		lunch: null,
		dinner: null,
		breakfast: null,
		hourlyBedUse: null,
	});

	const [quantities, setQuantities] = useState({
		hoursStayed: 0,
		lunches: 0,
		dinners: 0,
		breakfasts: 0,
	});

	const calculateTotal = () => {
		let total = 0;

		if (fees.admissionFee) total += Number(fees.admissionFee.rate);
		if (fees.bedAllocationFee) total += Number(fees.bedAllocationFee.rate);
		if (fees.hourlyBedUse)
			total += Number(fees.hourlyBedUse.rate * quantities.hoursStayed);
		if (fees.lunch) total += Number(fees.lunch.rate * quantities.lunches);
		if (fees.dinner) total += Number(fees.dinner.rate * quantities.dinners);
		if (fees.breakfast)
			total += Number(fees.breakfast.rate * quantities.breakfasts);

		return total;
	};

	useEffect(() => {
		$.ajax({
			url: `${server_url}/admissions/get-admission-billing-categories`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				const feeData = {
					admissionFee: response.find((item) => item.code === "1123") || null,
					bedAllocationFee:
						response.find((item) => item.code === "1244") || null,
					lunch: response.find((item) => item.code === "1327") || null,
					dinner: response.find((item) => item.code === "9251") || null,
					breakfast: response.find((item) => item.code === "8734") || null,
					hourlyBedUse: response.find((item) => item.code === "5230") || null,
				};

				setFees(feeData);
			},
			error: function (error) {
				// console.error("Error loading billing categories:", error);
			},
		});
	}, []);

	useEffect(() => {
		if (location.state?.admission) {
			setPatient(location.state.admission.admissionPatient);
			setAdmission(location.state.admission);
		}
	}, [location]);

	useEffect(() => {
		if (!admission) return;

		const calculateStayDetails = () => {
			const admissionDate = new Date(admission.admissionDate);
			const now = new Date();

			const hoursStayed = Math.floor((now - admissionDate) / (1000 * 60 * 60));

			const daysStayed = Math.floor(hoursStayed / 24);
			const remainingHours = hoursStayed % 24;

			const currentHour = now.getHours();
			let breakfasts = daysStayed;
			let lunches = daysStayed;
			let dinners = daysStayed;

			if (currentHour >= 9) breakfasts += 1;
			if (currentHour >= 12) lunches += 1;
			if (currentHour >= 18) dinners += 1;

			setQuantities({
				hoursStayed,
				breakfasts,
				lunches,
				dinners,
			});
		};

		calculateStayDetails();
	}, [admission]);

	const handleProcessPayment = () => {
		let total_bill = calculateTotal();
		if (patient) {
			$.ajax({
				url: `${server_url}/admissions/process-payment/${patient.id}`,
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
                    
                    if (response.success == true) {
                        setPaidCard(true);
                    }
				},
				error: function (error) {
					// console.log(error);
					if (error.responseJSON.success == false) {
						setShowBillingForm(true);
					}
				},
			});
		}
	};

	const handleFormSubmit = async () => {
		if (!stripe || !elements) {
			console.error("Stripe has not loaded");
			return;
		}

		const cardElement = elements.getElement(CardElement);

		try {
			const { paymentMethod, error } = await stripe.createPaymentMethod({
				type: "card",
				card: cardElement,
				billing_details: {
					name: `${patient.firstName} ${patient.lastName}`,
				},
			});

			if (error) {
				console.error("Error creating payment method:", error);
			} else {
				console.log("Payment Method created successfully:", paymentMethod);

				$.ajax({
					url: `${server_url}/admissions/save-billing-details`,
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
					data: JSON.stringify({
						patientId: patient.id,
						paymentMethodId: paymentMethod.id,
						total_bill: calculateTotal(),
					}),
					success: function (response) {
						console.log("Payment processed successfully:", response);
						alert("Payment successful!");
					},
					error: function (error) {
						console.error(error);
						alert("Payment failed. Please try again.");
					},
				});
			}
		} catch (err) {
			console.error("An error occurred:", err);
		}
	};

	const handleCheckboxChange = (e) => {
		if (e.target.id == "cardCheckbox") {
			setPaidCash(false);
		} else if (e.target.id == "cashCheckbox") {
            setPaidCard(false)
        }
		setPaymentType(e.target.id);
	};

	const handleCashCheckboxChange = (e) => {
		setPaidCash((prev) => !prev);
	};

    const handleDischargePatient = () => {
        const payload = {
            paymentType: paymentType
        }
        if (patient && paymentType) {
            $.ajax({
                url: `${server_url}/admissions/discharge-patient/${patient.id}`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(payload),
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            })
        }
    }

	return (
		<div className="discharge-container discharge-patient">
			<PageHeader title="Discharge Patient" />
			{admission && patient && (
				<div className="patient-info-card">
					<h2 className="patient-name">
						Patient: {patient.firstName} {patient.lastName}
					</h2>
					<div className="admission-details">
						<p className="admission-date">
							<strong>Admitted on:</strong>{" "}
							{new Date(admission.admissionDate).toLocaleString()}
						</p>
						<p className="stay-duration">
							<strong>Duration:</strong>{" "}
							{Math.floor(quantities.hoursStayed / 24)} days,{" "}
							{quantities.hoursStayed % 24} hours
						</p>
					</div>

					<table className="invoice-table">
						<thead className="table-header">
							<tr className="header-row">
								<th className="item-col">Item</th>
								<th className="rate-col">Rate</th>
								<th className="qty-col">Quantity</th>
								<th className="subtotal-col">Subtotal</th>
							</tr>
						</thead>
						<tbody className="table-body">
							{fees.admissionFee && (
								<tr className="item-row">
									<td className="item-name">Admission Fee</td>
									<td className="item-rate">{fees.admissionFee.rate}</td>
									<td className="item-qty">1</td>
									<td className="item-subtotal">{fees.admissionFee.rate}</td>
								</tr>
							)}
							{fees.bedAllocationFee && (
								<tr className="item-row">
									<td className="item-name">Bed Allocation Fee</td>
									<td className="item-rate">{fees.bedAllocationFee.rate}</td>
									<td className="item-qty">1</td>
									<td className="item-subtotal">
										{fees.bedAllocationFee.rate}
									</td>
								</tr>
							)}
							{fees.hourlyBedUse && (
								<tr className="item-row">
									<td className="item-name">Bed Usage</td>
									<td className="item-rate">{fees.hourlyBedUse.rate}/hour</td>
									<td className="item-qty">{quantities.hoursStayed}</td>
									<td className="item-subtotal">
										{fees.hourlyBedUse.rate * quantities.hoursStayed}
									</td>
								</tr>
							)}
							{fees.breakfast && quantities.breakfasts > 0 && (
								<tr className="item-row">
									<td className="item-name">Breakfast</td>
									<td className="item-rate">{fees.breakfast.rate}</td>
									<td className="item-qty">{quantities.breakfasts}</td>
									<td className="item-subtotal">
										{fees.breakfast.rate * quantities.breakfasts}
									</td>
								</tr>
							)}
							{fees.lunch && quantities.lunches > 0 && (
								<tr className="item-row">
									<td className="item-name">Lunch</td>
									<td className="item-rate">{fees.lunch.rate}</td>
									<td className="item-qty">{quantities.lunches}</td>
									<td className="item-subtotal">
										{fees.lunch.rate * quantities.lunches}
									</td>
								</tr>
							)}
							{fees.dinner && quantities.dinners > 0 && (
								<tr className="item-row">
									<td className="item-name">Dinner</td>
									<td className="item-rate">{fees.dinner.rate}</td>
									<td className="item-qty">{quantities.dinners}</td>
									<td className="item-subtotal">
										{fees.dinner.rate * quantities.dinners}
									</td>
								</tr>
							)}
							<tr className="total-row">
								<td colSpan="3" className="total-label">
									<strong>Total</strong>
								</td>
								<td className="total-amount">
									<strong>{calculateTotal()}</strong>
								</td>
							</tr>
						</tbody>
					</table>
					<div>
						<div>
                            <div>
                                <p>Payment Options</p>
                            </div>
							<div>
								<input
									type="checkbox"
									id="cardCheckbox"
									onChange={handleCheckboxChange}
									checked={paymentType === "cardCheckbox"}
								/>
								<label htmlFor="cardCheckbox">Card</label>

								<input
									type="checkbox"
									id="cashCheckbox"
									onChange={handleCheckboxChange}
									checked={paymentType === "cashCheckbox"}
								/>
								<label htmlFor="cardCheckbox">Cash</label>
							</div>
							<div></div>
						</div>
						{!showBillingForm && paymentType == "cardCheckbox" && (
							<div>
								<button
									onClick={handleProcessPayment}
									className="process-payment"
                                    disabled={paidCard || paidCash}
                                    >
									Process payment
								</button>
							</div>
						)}
						{showBillingForm && !paidCash && paymentType == "cardCheckbox" && (
							<div className="card-details-form">
								<h3>Please Enter Billing Details</h3>
								<CardDetailsForm
									handleInput={(event) => {
									}}
								/>
								<button onClick={handleFormSubmit}>Submit</button>
							</div>
						)}

						{paymentType == "cashCheckbox" && user.role == "super-admin" && (
							<div>
								<input
									type="checkbox"
									id="paidCashCheckBox"
									onChange={handleCashCheckboxChange}
								/>
								<label htmlFor="cardCheckbox">
									Has cash payment been made and confirmed?
								</label>
							</div>
						)}

                        <button
                        className="discharge-patient" disabled = {!paidCard && !paidCash} 
                        onClick={handleDischargePatient}
                        >Discharge patient</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default DischargePatient;
