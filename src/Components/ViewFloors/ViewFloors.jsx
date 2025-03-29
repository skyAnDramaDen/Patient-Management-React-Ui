import "./ViewFloors.css";

import React, { useState, useEffect } from 'react';
import $ from "jquery";

import { useLocation, useNavigate, Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";

export default function ViewFloors() {
    const [showInput, setShowInput] = useState(false);
    const [floorName, setFloorName] = useState("");
    const [floorNumber, setFloorNumber] = useState();
    const [floors, setFloors] = useState([]);
    const [floorAdded, setFloorAdded] = useState(false);
    const server_url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        $.ajax({
            url: `${server_url}/floors`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                setFloors(Array.isArray(response) ? response : []);
            },
            error: (error) => {
                console.log(error);
            }
        })
    }, [floorAdded])

    const handleAddFloor = () => {
        if (!floorName) {
            console.log('there is no floor name');
            return;
        }

        $.ajax({
            url: `${server_url}/floors/create`,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ name: floorName, floorNumber: floorNumber }),
            success: function(response) {
                alert("Floor added successfully!");
                setShowInput(false);
                setFloorName("");
                setFloorAdded((prev) => !prev);
            },
            error: (error) => {
                console.log(error);
                alert("Failed to add floor");
            }
        })
    }

  return (
    <div className="wards">
        <PageHeader title = "FLOOR MANAGEMENT"/>

        <div className="add-floor-container">
        <button className="add-floor-btn" onClick={() => setShowInput(!showInput)}>
          + Add Floor
        </button>

        {showInput && (
          <div className="floor-input-container">
            <input
              type="text"
              placeholder="Enter floor name"
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter floor number"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
            />
            <button className="save-floor-btn" onClick={handleAddFloor}>Save</button>
          </div>
        )}

        {
            floors && floors.map((floor) => {
                return (
                    <Link 
                    to= "/view-floor"
                    state={{floor}}
                    style={{ textDecoration: "none", color: "inherit" }}
                    key={floor.id}
                    >
                        <p className="floor-name">{floor.name} ({floor.floorNumber})</p>
                    </Link>
                )
            })
        }
      </div>
    </div>
  )
}
