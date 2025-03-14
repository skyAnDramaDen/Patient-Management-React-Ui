import "./ViewWard.css";

import React, { useState, useEffect } from 'react';

import { useLocation, useNavigate } from "react-router-dom";

import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";


export default function ViewWard() {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [ward, setWard] = useState();
    const [roomName, setRoomName] = useState();
    const [roomNumber, setRoomNumber] = useState();
    const [showInput, setShowInput] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [roomAdded, setRoomAdded] = useState(false);

    // console.log(state);

    useEffect(() => {
        if (state.ward) {
            setWard(state.ward);
        }
    })

    useEffect(() => {
        if (state.ward) {
            $.ajax({
                url: `http://localhost:3000/wards/get-ward-rooms-by/${state.ward.id}`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                success: function(response) {
                    console.log(response);
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
            url: "http://localhost:3000/rooms/create",
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
                <div>
                    <input
                    type="text"
                    value={roomName}
                    onChange={(e) => {setRoomName(e.target.value)}}
                    placeholder="Enter a room name"
                    />
                    <input
                    type="number"
                    value={roomNumber}
                    onChange={(e) => {setRoomNumber(e.target.value)}}
                    placeholder="Enter a room number"
                    />
                    <button
                    onClick={() => {handleAddRoom()}}
                    >Save</button>
                </div>
            )
        }

        {
            rooms && rooms.map((room) => {
                return (
                    <div
                    key={room.id}
                    >
                        {room.name}
                    </div>
                )
            })
        }
      
    </div>
  )
}
