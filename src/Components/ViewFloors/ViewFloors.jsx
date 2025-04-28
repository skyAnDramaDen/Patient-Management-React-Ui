import React, { useState, useEffect } from "react";
import $ from "jquery";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ViewFloors.css";

export default function ViewFloors() {
	const [showInput, setShowInput] = useState(false);
	const [floorName, setFloorName] = useState("");
	const [floorNumber, setFloorNumber] = useState("");
	const [floors, setFloors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const server_url = process.env.REACT_APP_API_URL;
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFloors = async () => {
			setIsLoading(true);
			try {
				$.ajax({
					url: `${server_url}/floors`,
					method: "GET",
					headers: {
						"Authorization": `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
					success: function (response) {
						setFloors(
							Array.isArray(response)
								? response.sort((a, b) => a.floorNumber - b.floorNumber)
								: []
						);
					},
					error: (error) => {
						console.log(error);
					},
				});
			} catch (error) {
				toast.error("Failed to load floors");
			} finally {
				setIsLoading(false);
			}
		};

		fetchFloors();
	}, []);

	const handleAddFloor = async () => {
		if (!floorName.trim()) {
			toast.error("Please enter a floor name");
			return;
		}

		if (!floorNumber || isNaN(floorNumber)) {
			toast.error("Please enter a valid floor number");
			return;
		}

		try {
      $.ajax({
        url: `${server_url}/floors/create`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
					name: floorName.trim(),
					floorNumber: parseInt(floorNumber),
				}),
        success: function (response) {
          toast.success("Floor added successfully!");
          setShowInput(false);
          setFloorName("");
          setFloorNumber("");
        },
        error: (error) => {
          console.log(error);
        },
      });
      
      let updatedFloors;

      $.ajax({
        url: `${server_url}/floors`,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        success: function (response) {
          updatedFloors = response;
          setFloors(
            Array.isArray(updatedFloors)
              ? updatedFloors.sort((a, b) => a.floorNumber - b.floorNumber)
              : []
          );
        },
        error: (error) => {
          
        },
      });
		} catch (error) {
			console.error("Error adding floor:", error);
			toast.error(error.responseJSON?.message || "Failed to add floor");
		}
	};

	const handleFloorClick = (floor) => {
		navigate("/view-floor", { state: { floor } });
	};

	return (
		<div className="floor-management-container">
			<ToastContainer position="top-right" autoClose={5000} />

			<PageHeader title="Floor Management" backPath="/"/>

			<div className="floor-content">
				<div className="floor-actions-2">
					<button
						className="add-floor-btn"
						onClick={() => setShowInput(!showInput)}>
						{showInput ? "Cancel" : "+ Add New Floor"}
					</button>

					{showInput && (
						<div className="floor-input-card">
							<h3>Add New Floor</h3>
							<div className="input-group">
								<label htmlFor="floorName">Floor Name</label>
								<input
									id="floorName"
									type="text"
									placeholder="e.g. Ground Floor, First Floor"
									value={floorName}
									onChange={(e) => setFloorName(e.target.value)}
								/>
							</div>
							<div className="input-group">
								<label htmlFor="floorNumber">Floor Number</label>
								<input
									id="floorNumber"
									type="number"
									placeholder="e.g. 0, 1, 2"
									value={floorNumber}
									onChange={(e) => setFloorNumber(e.target.value)}
									min="0"
								/>
							</div>
							<button
								className="save-btn"
								onClick={handleAddFloor}
								disabled={!floorName.trim() || !floorNumber}>
								Save Floor
							</button>
						</div>
					)}
				</div>

				<div className="floor-list-container">
					<h2>Building Floors</h2>

					{isLoading ? (
						<div className="loading-indicator">
							<div className="spinner"></div>
							<p>Loading floors...</p>
						</div>
					) : floors.length === 0 ? (
						<div className="empty-state">
							<p>No floors found. Add your first floor to get started.</p>
						</div>
					) : (
						<div className="floor-grid">
							{floors.map((floor) => (
								<div
									className="floor-card"
									key={floor.id}
									onClick={() => handleFloorClick(floor)}>
									<div className="floor-number-badge">{floor.floorNumber}</div>
									<h3>{floor.name}</h3>
									<div className="floor-actions">
										<span className="view-details">View Details →</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
