import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaBed, FaInfoCircle, FaDoorOpen } from "react-icons/fa";
import "./ViewWard.css";

export default function ViewWard() {
    const server_url = process.env.REACT_APP_API_URL;
    const { state } = useLocation();
    const navigate = useNavigate();

    const [wardInfo, setWardInfo] = useState({
        occupiedBeds: 0,
        availableBeds: 0,
    });
    
    const [ward, setWard] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [roomForm, setRoomForm] = useState({
        name: "",
        number: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("wardInfo");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bedForm, setBedForm] = useState({
        type: "regular",
        status: "available"
    });
    const [isAddingBed, setIsAddingBed] = useState(false);

    useEffect(() => {
        if (!state?.ward) {
            toast.error("No ward data provided");
            navigate("/view-floors");
            return;
        }

        const fetchWardData = async () => {
            setIsLoading(true);
            try {
                $.ajax({
                    url: `${server_url}/wards/get-ward-rooms-by/${state.ward.id}`,
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    },
                    success: function(response) {
                        let occupied_beds = 0;
                        let available_beds = 0;

                        for (let x = 0; x < response.rooms.length; x++) {
                            for (let y = 0; y < response.rooms[x].beds.length; y++) {
                                if (response.rooms[x].beds[y].status == "available") {
                                    available_beds += 1;
                                }

                                if (response.rooms[x].beds[y].status == "occupied") {
                                    occupied_beds += 1;
                                }
                            }
                        }
                        setWard(response);
                        setRooms(response.rooms || []);
                    },
                    error: function(error) {

                    }
                });
                
            } catch (error) {
                toast.error("Failed to load ward information");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWardData();
    }, []);

    const handleAddRoom = async () => {
        if (!roomForm.name.trim() || !roomForm.number) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const response = await $.ajax({
                url: `${server_url}/rooms/create`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    name: roomForm.name.trim(),
                    wardId: ward.id,
                    number: roomForm.number
                })
            });

            toast.success("Room added successfully!");
            setRooms(prev => [...prev, response]);
            setShowRoomForm(false);
            setRoomForm({ name: "", number: "" });
        } catch (error) {
            console.error("Error adding room:", error);
            toast.error(error.responseJSON?.message || "Failed to add room");
        }
    };

    const handleAddBed = async () => {
        if (!selectedRoom) {
            toast.error("Please select a room first");
            return;
        }

        try {
            $.ajax({
                url: `${server_url}/beds/create`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    bed: bedForm,
                    roomId: selectedRoom.id
                }),
                success: function(response) {
                    toast.success("Bed added successfully!");
                    setSelectedRoom(prev => ({
                        ...prev,
                        beds: [...(prev.beds || []), response]
                    }));
                    setIsAddingBed(false);
                    setBedForm({
                        type: "regular",
                        status: "available"
                    });
                },
                error: function(error) {

                }
            });

            
        } catch (error) {
            console.error("Error adding bed:", error);
            toast.error(error.responseJSON?.message || "Failed to add bed");
        }
    };

    const handleRoomSelect = () => {

    }

    if (!ward) {
        return (
            <div className="ward-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading ward information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ward-container">
            <ToastContainer position="top-right" autoClose={5000} />
            
            <PageHeader 
                title={`${ward.name} Ward`}
                subtitle={`Floor ${ward.floor?.floorNumber || 'N/A'}`}
                showBackButton={true}
            />
            
            <div className="ward-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowRoomForm(!showRoomForm)}
                    disabled={isLoading}
                >
                    <FaPlus /> {showRoomForm ? "Cancel" : "Add Room"}
                </button>
            </div>

            {showRoomForm && (
                <div className="room-form-card">
                    <h3>Add New Room</h3>
                    <div className="form-group">
                        <label>Room Name</label>
                        <input
                            type="text"
                            value={roomForm.name}
                            onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                            placeholder="e.g. Room A, Private Suite"
                        />
                    </div>
                    <div className="form-group">
                        <label>Room Number</label>
                        <input
                            type="number"
                            value={roomForm.number}
                            onChange={(e) => setRoomForm({...roomForm, number: e.target.value})}
                            placeholder="e.g. 101, 202"
                            min="1"
                        />
                    </div>
                    <button
                        className="btn btn-save"
                        onClick={handleAddRoom}
                        disabled={!roomForm.name.trim() || !roomForm.number}
                    >
                        Save Room
                    </button>
                </div>
            )}

            <div className="ward-content">
                <div className="ward-layout">
                    <div className="rooms-sidebar">
                        <h3 className="sidebar-title">
                            <FaDoorOpen /> Rooms ({rooms.length})
                        </h3>
                        <div className="rooms-list">
                            {isLoading ? (
                                <div className="loading-indicator">
                                    <div className="spinner"></div>
                                </div>
                            ) : rooms.length === 0 ? (
                                <p className="empty-message">No rooms found</p>
                            ) : (
                                rooms.map(room => (
                                    <div
                                        key={room.id}
                                        className={`room-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setActiveTab("roomDetails");
                                        }}
                                    >
                                        <span className="room-name">{room.name}</span>
                                        <span className="room-number">#{room.number}</span>
                                        {room.beds?.length > 0 && (
                                            <span className="bed-count">
                                                <FaBed /> {room.beds.length}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="ward-details">
                        <div className="tabs">
                            <button
                                className={`tab-btn ${activeTab === "wardInfo" ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab("wardInfo");
                                    setSelectedRoom(null);
                                }}
                            >
                                <FaInfoCircle /> Ward Info
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "roomDetails" ? 'active' : ''}`}
                                onClick={() => setActiveTab("roomDetails")}
                                disabled={!selectedRoom}
                            >
                                <FaBed /> Room Details
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === "wardInfo" && (
                                <div className="ward-info">
                                    <h3>Ward Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Ward Name:</label>
                                            <span>{ward.name}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Floor:</label>
                                            <span>{ward.floor?.name || 'N/A'} (Floor {ward.floor?.floorNumber || 'N/A'})</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Total Rooms:</label>
                                            <span>{rooms.length}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Total Beds:</label>
                                            <span>{rooms.reduce((acc, room) => acc + (room.beds?.length || 0), 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "roomDetails" && (
                                <div className="room-details">
                                    {selectedRoom ? (
                                        <>
                                            <div className="room-header">
                                                <h3>{selectedRoom.name} (Room #{selectedRoom.number})</h3>
                                                <button
                                                    className="btn btn-add-bed"
                                                    onClick={() => setIsAddingBed(!isAddingBed)}
                                                >
                                                    <FaPlus /> {isAddingBed ? "Cancel" : "Add Bed"}
                                                </button>
                                            </div>

                                            {isAddingBed && (
                                                <div className="bed-form">
                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <label>Bed Type</label>
                                                            <select
                                                                name="type"
                                                                value={bedForm.type}
                                                                onChange={(e) => setBedForm({...bedForm, type: e.target.value})}
                                                            >
                                                                <option value="regular">Regular</option>
                                                                <option value="ICU">ICU</option>
                                                                <option value="pediatric">Pediatric</option>
                                                                <option value="maternity">Maternity</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Status</label>
                                                            <select
                                                                name="status"
                                                                value={bedForm.status}
                                                                onChange={(e) => setBedForm({...bedForm, status: e.target.value})}
                                                            >
                                                                <option value="available">Available</option>
                                                                <option value="occupied">Occupied</option>
                                                                <option value="under_maintenance">Under Maintenance</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn btn-save"
                                                        onClick={handleAddBed}
                                                    >
                                                        Save Bed
                                                    </button>
                                                </div>
                                            )}

                                            <div className="beds-list">
                                                <h4>Beds in this Room</h4>
                                                {selectedRoom.beds?.length > 0 ? (
                                                    <div className="bed-cards">
                                                        {selectedRoom.beds.map(bed => (
                                                            <div key={bed.id} className={`bed-card ${bed.status}`}>
                                                                <div className="bed-header">
                                                                    <FaBed />
                                                                    <span className="bed-number">Bed #{bed.bedNumber}</span>
                                                                </div>
                                                                <div className="bed-details">
                                                                    <span className={`badge ${bed.type}`}>{bed.type}</span>
                                                                    <span className={`badge ${bed.status}`}> ({bed.status.replace('_', ' ')})</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="empty-message">No beds in this room yet</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="select-room-prompt">
                                            <FaInfoCircle />
                                            <p>Please select a room to view details</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}