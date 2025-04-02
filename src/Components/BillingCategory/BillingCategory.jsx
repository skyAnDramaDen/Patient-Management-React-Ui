import "./BillingCategory.css";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import $ from "jquery";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BillingCategory() {
	const server_url = process.env.REACT_APP_API_URL;
	const [billingCategories, setBillingCategories] = useState([]);
	const [group, setGroup] = useState();

	const [addingBillingCategory, setAddingBillingCategory] = useState(false);
	const [categoryData, setCategoryData] = useState({
		name: "",
		rate: "",
		description: "",
		group: group,
	});

	const [editing, setEditing] = useState({
		rowId: null,
		columnName: null,
		value: "",
	});

	useEffect(() => {
		$.ajax({
			url: `${server_url}/billingCategory/`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setBillingCategories(response);
			},
			error: function (error) {
				console.log(error);
			},
		});
	}, []);

	const handleEdit = (rowId, columnName, currentValue) => {
		setEditing({
			rowId,
			columnName,
			value: currentValue,
		});
	};

	useEffect(() => {
		console.log(editing);
	}, [editing]);

	const handleCategorySave = () => {
		if (
			!categoryData.name.trim() ||
			!categoryData.rate.trim() ||
			!categoryData.description.trim()
		) {
			console.error("All fields must be filled before saving.");
			toast.error("Please fill in all fields before saving.");
			return;
		} else if (
			categoryData.name != null &&
			categoryData.rate != null &&
			!isNaN(categoryData.rate) &&
			categoryData.description != null &&
			group != null
		) {
			const payload = {
				categoryData: categoryData,
				group: group,
			};

			console.log(payload);

			$.ajax({
				url: `${server_url}/billingCategory/create`,
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(payload),
				success: function (response) {
					setBillingCategories((prevBillingCategories) => [
						...prevBillingCategories,
						response,
					]);

					setCategoryData({
						name: "",
						rate: "",
						description: "",
					});
					setAddingBillingCategory(!addingBillingCategory);
				},
				error: function (error) {
					console.log(error);
				},
			});
		} else if (isNaN(categoryData.rate)) {
			toast.error("Enter a valid number");
		}
	};

	const handleFieldChange = (e) => {
		setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
	};

	const handleSave = async () => {
		console.log(editing);
		let item_id;
		const updatedData = billingCategories.map((item) => {
			if (item.id === editing.rowId) {
				item_id = item.id;
				return { ...item, [editing.columnName]: editing.value };
			}
			return item;
		});

		setBillingCategories(updatedData);
		setEditing({ rowId: null, columnName: null, value: "" });

		const updatedItem = {
			id: editing.rowId,
			[editing.columnName]: editing.value,
		};

		const payload = {
			columnName: editing.columnName,
			value: editing.value,
		};

		$.ajax({
			url: `${server_url}/billingCategory/update/${item_id}`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			data: JSON.stringify(payload),
			succes: function (response) {
				// console.log(response);
			},
			error: function (error) {
				console.log(error);
			},
		});
	};

	const handleCancel = () => {
		setEditing({ rowId: null, columnName: null, value: "" });
	};

	const handleChange = (e) => {
		setEditing({ ...editing, value: e.target.value });
	};

	const handleCategoryDelete = (item_id) => {
		console.log();
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this category?"
		);

		if (confirmDelete) {
			$.ajax({
				url: `${server_url}/billingCategory/delete/${item_id}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				success: function (response) {
					console.log(response);
					setBillingCategories((prevCategories) =>
						prevCategories.filter((category) => category.id !== item_id)
					);
				},
				error: function (error) {
					console.log(error);
				},
			});
		} else {
		}
	};

	const handleGroupingChange = (e) => {
		console.log(e.target.value);
		setGroup(e.target.value);
	};

	return (
		<div className="billing-category-container">
			<PageHeader title="Billing Categories" />
			<div>
				<button
					onClick={() => {
						setAddingBillingCategory(!addingBillingCategory);
					}}
					className="add-category-btn">
					Add Billing Category
				</button>
				{addingBillingCategory && (
					<div className="billing-category-inputs">
						<input
							placeholder="name"
							onChange={handleFieldChange}
							value={categoryData.name}
							name="name"
						/>
						<input
							placeholder="rate"
							onChange={handleFieldChange}
							value={categoryData.rate}
							name="rate"
						/>
						<input
							placeholder="description"
							onChange={handleFieldChange}
							value={categoryData.description}
							name="description"
						/>
						<select onChange={handleGroupingChange}>
							<option value="" selected>
								Select a grouping
							</option>
							<option value="admission_fees">Admission Fees</option>
							<option value="consultation_fees">Consultation Fees</option>
							<option value="ward_charges">Ward Fees</option>
							<option value="miscellaneous">Miscellaneous Fees</option>
						</select>
						<button className="save-category-btn" onClick={handleCategorySave}>
							Save
						</button>
					</div>
				)}
			</div>
			<table className="billing-category-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Rate (£)</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{billingCategories &&
						billingCategories.map((item) => (
							<tr key={item.id} className="category-table-row">
								<td onClick={() => handleEdit(item.id, "name", item.name)}>
									{editing.rowId === item.id &&
									editing.columnName === "name" ? (
										<input
											type="text"
											value={editing.value}
											onChange={handleChange}
											autoFocus
											name="name"
										/>
									) : (
										item.name
									)}
								</td>
								<td onClick={() => handleEdit(item.id, "rate", item.rate)}>
									{editing.rowId === item.id &&
									editing.columnName === "rate" ? (
										<input
											type="text"
											value={editing.value}
											onChange={handleChange}
											name="rate"
										/>
									) : (
										item.rate
									)}
								</td>
								<td
									onClick={() =>
										handleEdit(item.id, "description", item.description)
									}>
									{editing.rowId === item.id &&
									editing.columnName === "description" ? (
										<input
											type="text"
											value={editing.value}
											onChange={handleChange}
											name="description"
										/>
									) : (
										item.description
									)}
								</td>
								<div className="select--btn-div">
									<select
										onChange={(e) => {
											const updatedCategories = billingCategories.map(
												(category) =>
													category.id === item.id
														? { ...category, code: e.target.value }
														: category
											);
											setBillingCategories(updatedCategories);
											handleEdit(item.id, "code", e.target.value)
										}}
										value={item.code}>
										<option value="">Select a grouping</option>
										<option value="admission_fees">Admission Fees</option>
										<option value="consultation_fees">Consultation Fees</option>
										<option value="ward_charges">Ward Fees</option>
										<option value="miscellaneous">Miscellaneous Fees</option>
									</select>
									<button
										className="category-delete-btn"
										onClick={() => {
											handleCategoryDelete(item.id);
										}}>
										Delete
									</button>
								</div>
							</tr>
						))}
				</tbody>
			</table>

			{editing.rowId && (
				<div className="edit-controls">
					<button onClick={handleSave}>Save</button>
					<button onClick={handleCancel}>Cancel</button>
				</div>
			)}
		</div>
	);
}

export default BillingCategory;
