import "./Settings.css";

import React, { useState, useContext, useEffect, Link } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import $ from "jquery";
import AuthProvider, { AuthContext } from "../../Authcontext";


import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Settings() {
	const { user, socket } = useContext(AuthContext);
	const server_url = process.env.REACT_APP_API_URL;
	const [fetchedUser, setFetchedUser] = useState({
		username: "",
		password: "",
		confirmedPassword: "",
	});

	const [allUsers, setAllUsers] = useState([]);

	const [onlineUsers, setOnlineUsers] = useState([]);

	useEffect(() => {
		if (socket) {
			socket.on("users", (users) => {
				setOnlineUsers(users);
			});

			return () => {
				socket.off("users");
			};
		}
	}, [socket]);

	const [changed, setChanged] = useState(false);

	useEffect(() => {
		$.ajax({
			url: `${server_url}/user/get-user-details-by/${user.id}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setFetchedUser(response);
			},
			error: function (error) {
				console.log(error);
			},
		});
	}, []);

	useEffect(() => {
		$.ajax({
			url: `${server_url}/user/get-all-users`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			success: function (response) {
				setAllUsers(response);
			},
			error: function (error) {
				console.error("Failed to fetch users:", error);
			},
		});
	}, []);

	const handleUserDetailsChange = (e) => {
		setFetchedUser({
			...fetchedUser,
			[e.target.name]: e.target.value || "",
		});
		setChanged(true);
	};

	const handleSubmitUserDetails = () => {
		if (fetchedUser.username.length < 3) {
			toast.error("Username must be at least three characters");
			return;
		}

		if (fetchedUser.password && fetchedUser.password.trim().length != 0) {
			if (fetchedUser.confirmedPassword && fetchedUser.confirmedPassword.trim().length != 0) {
				if (fetchedUser.password.trim().length < 8 || fetchedUser.confirmedPassword.trim().length < 8) {
					toast.error("Your password is less than eight characters");
					return;
				}
				if (fetchedUser.password.trim() == fetchedUser.confirmedPassword.trim()) {

				} else {
					toast.error("The passwords do not match");
				}
			} else {
				toast.error("Confirm your password please");
				return;
			}
		}

		if (fetchedUser.username || 
			(fetchedUser.password && fetchedUser.confirmedPassword && fetchedUser.password.trim() == fetchedUser.confirmedPassword.trim())) {
			const { confirmPassword, ...requiredData } = fetchedUser;

			let user_password = fetchedUser.password
				? fetchedUser.password.trim()
				: "";
			let payload;
			if (fetchedUser.username) {
				if (fetchedUser.password && fetchedUser.confirmedPassword && fetchedUser.password.trim() == fetchedUser.confirmedPassword.trim()) {
					payload = {
						username: fetchedUser.username,
						password: fetchedUser.password,
					};
				} else {
					payload = {
						username: fetchedUser.username,
					};
				}
			} else if (fetchedUser.password) {
				if (fetchedUser.confirmedPassword) {
					if (fetchedUser.password.trim() == fetchedUser.confirmedPassword.trim()) {
						payload = {
							password: fetchedUser.password,
						};
					}
				}
				
				
			} else {
				return;
			}

			$.ajax({
				url: `${server_url}/user/update-user-details/${user.id}`,
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(payload),
				success: function (response) {
					if (response.success == true) {
						alert("User details updated successfully!");
					}

					setChanged(false);
				},
				error: function (error) {
					console.error("Update failed:", error);
				},
			});
		} else {
			console.log("there is nothing");
		}
	};

	return (
		<div className="settings">
			<PageHeader title="Settings" />
			<div>
				<div className="container">
					<p>Edit login details</p>
					<input
						name="username"
						value={fetchedUser.username || ""}
						onChange={handleUserDetailsChange}
						type="text"
						className="input-field"
						placeholder="Username"
					/>
					<input
						name="password"
						value={fetchedUser.password || ""}
						onChange={handleUserDetailsChange}
						type="text"
						className="input-field"
						placeholder="New password"
					/>
					<input
						name="confirmedPassword"
						value={fetchedUser.confirmedPassword || ""}
						onChange={handleUserDetailsChange}
						type="text"
						className="input-field"
						placeholder="Current password"
					/>
					{changed && (
						<button onClick={handleSubmitUserDetails} className="submit-btn">
							Submit
						</button>
					)}
				</div>
				{user && user.role == "super-admin" && (
					<div>
						<div className="users-container">
							{onlineUsers && (
								<div className="users-section">
									<h3>🟢 Online Users</h3>
									<div className="user-grid">
										{onlineUsers.map((user, index) => (
											<div className="user-card" key={index}>
												<p>
													<strong>{user.username}</strong>
												</p>
												<span className="role-tag">{user.role}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{allUsers && (
								<div className="users-section">
									<h3>👥 All Users</h3>
									<div className="user-grid">
										{allUsers.map((user, index) => (
											<div className="user-card" key={index}>
												<p>
													<strong>{user.username}</strong>
												</p>
												<span className="role-tag">{user.role}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Settings;
