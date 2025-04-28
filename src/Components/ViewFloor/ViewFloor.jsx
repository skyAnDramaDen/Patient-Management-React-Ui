import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ViewFloor.css";

export default function ViewFloor() {
    const navigate = useNavigate();
    const location = useLocation();
    const server_url = process.env.REACT_APP_API_URL;
    
    const [floor, setFloor] = useState(null);
    const [wards, setWards] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [wardName, setWardName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddingWard, setIsAddingWard] = useState(false);

    useEffect(() => {
        if (location.state?.floor) {
            setFloor(location.state.floor);
        } else {
            toast.error("No floor data provided");
            navigate("/view-floors");
        }
    }, [location.state, navigate]);

    const fetchWards = async () => {
        if (!floor?.id) return;
        
        setIsLoading(true);
        try {
            const response = await $.ajax({
                url: `${server_url}/floors/get-floor-wards-by/${floor.id}`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setWards(response.wards || []);
        } catch (error) {
            console.error("Error fetching wards:", error);
            toast.error("Failed to load wards");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWards();
    }, [floor, server_url]);

    const handleAddWard = async () => {
        if (!wardName.trim()) {
            toast.error("Please enter a ward name");
            return;
        }

        setIsAddingWard(true);
        try {
            await $.ajax({
                url: `${server_url}/wards/create`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    floorId: floor.id,
                    name: wardName.trim()
                })
            });

            toast.success("Ward added successfully!");
            setShowInput(false);
            setWardName("");
            await fetchWards();
        } catch (error) {
            console.error("Error adding ward:", error);
            const errorMessage = error.responseJSON?.message || 
                               error.responseText || 
                               "Failed to add ward";
            toast.error(errorMessage);
        } finally {
            setIsAddingWard(false);
        }
    };

    const handleDeleteFloor = async () => {
        const userConfirmed = window.confirm(
            `Are you sure you want to permanently delete ${floor.name} (Floor ${floor.floorNumber})? ` +
            `This will also delete all associated wards and cannot be undone.`
        );
        
        if (!userConfirmed) return;

        setIsDeleting(true);
        try {
            await $.ajax({
                url: `${server_url}/floors/delete/${floor.id}`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            toast.success("Floor and associated wards deleted successfully!");
            navigate("/view-floors");
        } catch (error) {
            console.error("Error deleting floor:", error);
            const errorMessage = error.responseJSON?.message || 
                               error.responseText || 
                               "Failed to delete floor";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!floor) {
        return (
            <div className="floor-container">
                <div className="loading-error-state">
                    <p>Loading floor information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="floor-container">
            <ToastContainer position="top-right" autoClose={5000} />
            
            <PageHeader 
                title={`${floor.name} (Floor ${floor.floorNumber})`} 
                showBackButton={true}
                backPath="/view-floors"
            />
            
            <div className="floor-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowInput(!showInput)}
                    disabled={isAddingWard || isDeleting}
                >
                    {showInput ? "Cancel" : "+ Add Ward"}
                </button>
                
                <button
                    className="btn btn-danger"
                    onClick={handleDeleteFloor}
                    disabled={isDeleting || isAddingWard}
                >
                    {isDeleting ? (
                        <>
                            <span className="spinner"></span> Deleting...
                        </>
                    ) : "Delete Floor"}
                </button>
            </div>

            {showInput && (
                <div className="add-ward-card">
                    <h3>Add New Ward</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter ward name"
                            value={wardName}
                            onChange={(e) => setWardName(e.target.value)}
                            className="form-input"
                            disabled={isAddingWard}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddWard()}
                        />
                        <button
                            onClick={handleAddWard}
                            className="btn btn-save"
                            disabled={!wardName.trim() || isAddingWard}
                        >
                            {isAddingWard ? (
                                <>
                                    <span className="spinner"></span> Adding...
                                </>
                            ) : "Save Ward"}
                        </button>
                    </div>
                </div>
            )}

            <div className="wards-section">
                <h2>Wards on This Floor</h2>
                
                {isLoading ? (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Loading wards...</p>
                    </div>
                ) : wards.length === 0 ? (
                    <div className="empty-state">
                        <p>No wards found. Add your first ward to get started.</p>
                    </div>
                ) : (
                    <>
                        <div className="wards-count">
                            {wards.length} ward{wards.length !== 1 ? 's' : ''} found
                        </div>
                        <div className="wards-grid">
                            {wards.map((ward) => (
                                <Link
                                    to="/view-ward"
                                    state={{ ward }}
                                    className="ward-card"
                                    key={ward.id}
                                >
                                    <h3>{ward.name}</h3>
                                    <div className="ward-actions">
                                        <span className="view-details">View Details →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}