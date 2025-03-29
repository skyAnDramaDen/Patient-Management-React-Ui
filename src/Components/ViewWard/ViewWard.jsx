import "./ViewWard.css";

import React, { useState, useEffect } from 'react';

import { useLocation, useNavigate } from "react-router-dom";

import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";
import { FaPlus } from "react-icons/fa6";


export default function ViewWard() {
    const server_url = process.env.REACT_APP_API_URL;
    const {state} = useLocation();
    const navigate = useNavigate();
    const [ward, setWard] = useState();
    const [roomName, setRoomName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [roomAdded, setRoomAdded] = useState(false);
    const [activeTab, setActiveTab] = useState("generalWard");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [addingBed, setAddingBed] = useState(false);
    const [selectedRoomBeds, setSelectedRoomBeds] = useState([]);

    const [bed, setBed] = useState({
        type: "regular" ,
        status: "available",
    })

    useEffect(() => {
        if (selectedRoom) {
            setSelectedRoomBeds(selectedRoom.beds);
        } else {
            setSelectedRoomBeds(null);
        }
    }, [selectedRoom])

    useEffect(() => {
        if (state.ward) {
            setWard(state.ward);
        }
    }, [])

    useEffect(() => {
        if (state.ward) {
            $.ajax({
                url: `${server_url}/wards/get-ward-rooms-by/${state.ward.id}`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                success: function(response) {
                    setWard(response);
                    if (response.rooms) {
                        setRooms(response.rooms)
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            })
        }
    }, [roomAdded])

    const handleAddRoom = () => {
        if (!roomName || !roomNumber) {
            alert("Enter the required details");
            return;
        }

        const payload = {
            name: roomName,
            wardId: ward.id,
            number: roomNumber
        }

        $.ajax({
            url: `${server_url}/rooms/create`,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: function(response) {
                console.log(response);
                setRoomAdded((prev) => !prev)
                setShowInput(false);
                setSelectedRoomBeds([...selectedRoomBeds, response]);
            },
            error: function(error) {
                console.log(error);
            }
        })
    }

    const handleBedData = function(e) {
        setBed({ ...bed, [e.target.name]: e.target.value })
    }

    const handleBedSave = () => {
        let roomId;

        if (selectedRoom) {
            roomId = selectedRoom.id;
        }

        const payload = {
            bed: bed,
            roomId: roomId
        }

        $.ajax({
            url: "http://localhost:3000/beds/create",
            method: "POST",
            headers: {
                //TODO: HttpOnly cookies instead of localstorage 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: function(response) {
                // console.log(response);
                // console.log(addingBed);
                setAddingBed((prev) => !prev);
                // console.log(addingBed);
                setSelectedRoomBeds((prevBeds) => [...prevBeds, response]);
            },
            error: function(error) {
                console.log(error);
            }
        })
    }
  return (
    <div className="view-ward">
        <PageHeader title= {state.ward.name} />
        <button
        onClick={() => {setShowInput(!showInput)}}
        className="add-room"
        >
            Add Room
        </button>

        {
            showInput && (
                <div
                
                className="input-divs">
                    <input
                    type="text"
                    value={roomName}
                    onChange={(e) => {setRoomName(e.target.value)}}
                    placeholder="Enter a room name"
                    className="input-field"
                    />
                    <input
                    type="number"
                    value={roomNumber}
                    onChange={(e) => {setRoomNumber(e.target.value)}}
                    placeholder="Enter a room number"
                    className="input-field"
                    />
                    <button
                    onClick={() => {handleAddRoom()}}
                    className="save-btn"
                    >Save</button>
                </div>
            )
        }

        <div className="main-div">
            <div className="room-and-beds">
                <div>
                <h3 className="room-title">ROOMS</h3>
                <div className="rooms-div">
                    {rooms && rooms.map((room) => (
                        <div
                            key={room.id}
                            className="room-line"
                            onClick={() => {
                                setSelectedRoom(room);
                                setActiveTab("roomDetails");
                            }}
                        >
                            {room.name}
                        </div>
                    ))}
                </div>
                </div>

                <hr className="line"/>
                <div className="tabs-div">
                    <div className="btns-div">
                        <button onClick={() => setActiveTab("generalWard")}
                        className="ward-button"
                        >
                            Ward Info
                        </button>
                        <button onClick={() => setActiveTab("roomDetails")}
                        className="ward-button">
                            Room Overview
                        </button>
                    </div>
                    <div>
                        <div className="content">
                            {activeTab === "generalWard" && (
                                <div className="general-ward">
                                    <h3>Ward Information</h3>
                                    {/* <p>Occupied beds: {wardInfo.occupied}</p>
                                    <p>Free beds: {wardInfo.free}</p> */}
                                </div>
                            )}
                            {activeTab === "roomDetails" && (
                                <div>
                                    {selectedRoom ? (
                                        <div>
                                            <div className="room-details">
                                                <div className="header-div">
                                                    <h3>Beds in {selectedRoom.name}</h3>
                                                    <button
                                                    className="button-8" role="button"
                                                    onClick={() => {setAddingBed(!addingBed)}}
                                                    >
                                                        {/* <FaPlus className="plus-sign"/>  */}
                                                    <span>Add Bed</span></button>
                                                </div>

                                                {
                                                    addingBed && (
                                                        <div className="bed-inputs">
                                                            <div className="div-with-inputs">
                                                                <label>
                                                                    <select name="type" value={bed.type} onChange={handleBedData} required>
                                                                        <option value="regular">Regular</option>
                                                                        <option value="ICU">ICU</option>
                                                                        <option value="pediatric">Pediatric</option>
                                                                        <option value="maternity">Maternity</option>
                                                                    </select>
                                                                </label>
                                                                <label>
                                                                    <select name="status" value={bed.status} onChange={handleBedData} required>
                                                                        <option value="available">Available</option>
                                                                        <option value="occupied">Occupied</option>
                                                                        <option value="under_maintainance">Under Maintainance</option>
                                                                    </select>
                                                                </label>
                                                            </div>
                                                            <button className="save-button" role="button"
                                                            onClick={() => {handleBedSave()}}
                                                            >Save</button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div>
                                                <ul>
                                                    {
                                                        selectedRoomBeds && selectedRoomBeds.map((bed) => {
                                                            return (
                                                                <li
                                                                key={bed.id}
                                                                >
                                                                    {
                                                                        bed.bedNumber + " " + "(" + bed.status + ")"
                                                                    }
                                                                </li>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>Please select a room.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
