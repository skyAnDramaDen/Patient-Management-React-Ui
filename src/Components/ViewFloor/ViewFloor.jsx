import "./ViewFloor.css";

import React, { useState, useEffect } from 'react';

import { useLocation, useNavigate, Link } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

export default function ViewFloor() {
    const navigate = useNavigate();
    const [floor, setFloor] = useState(null);
    const [wards, setWards] = useState([]);
    const location = useLocation();
    const [showInput, setShowInput] = useState(false);
    const [wardAdded, setWardAdded] = useState(false);

    const [wardName, setWardName] = useState();
    const server_url = process.env.REACT_APP_API_URL;


    useEffect(() => {
        setFloor(location.state.floor);
    })

    useEffect(() => {
        let floor_id;
        if (location.state.floor) {
            floor_id = location.state.floor.id;
            setFloor(location.state.floor);
        }
        // $.ajax({
        //     url: `http://localhost:3000/floors/get-floor-by/${floor_id}`,
        //     method: "GET",
        //     headers: {
        //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
        //         "Content-Type": "application/json"
        //     },
        //     success: function(response) {
        //         // console.log(response);
        //         setFloor(response);
        //     },
        //     error: function(error) {
        //         console.log(error);
        //     }
        // })
    }, [])



    useEffect(() => {
        let floor_id;
        if (location.state.floor) {
            floor_id = location.state.floor.id;
        }
        $.ajax({
            url: `${server_url}/floors/get-floor-wards-by/${floor_id}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                setWards(response.wards);
            },
            error: function(error) {
                console.log(error);
            }
        })
    }, [wardAdded])

    const handleAddWard = () => {
        if (!floor.id || !wardName) {
            alert("Error: Floor id or ward name missing!");
            return;
        }

        const payload = {
            floorId: floor.id,
            name: wardName
        }

        console.log(JSON.stringify(payload));

        $.ajax({
            url: `${server_url}/wards/create`,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: function(response) {
                // console.log(response);
                setShowInput(false);
                setWardAdded((prev) => !prev);
            },
            error: function(error) {
                console.log(error);
            }
        })
    }

    const handleDeleteFloor = () => {
        const userConfirmed = window.confirm("Are you sure you want to delete this floor?");

        if (userConfirmed) {

            $.ajax({
                url: `${server_url}/floors/delete/${floor.id}`,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                success: function(response) {
                    // console.log(response);
                    navigate(-1);
                },
                error: function(error) {
                    console.log(error);
                }
            })

            console.log("Floor deleted");
        } else {
            console.log("Floor not deleted");
        }
    }

  return (
    <div className="floor">
        <PageHeader title={floor && floor.name + " " + (floor.floorNumber)} />

        <button
        className="delete-floor-btn"
        onClick={handleDeleteFloor}
        
        >Delete floor</button>

        <button
        className="add-ward-btn"
        onClick={() => {setShowInput(!showInput)}}
        >
            Add Ward
        </button>
        

        {
            showInput && (
                <div className="input-button">
                    <input
                    value={wardName}
                    type="text"
                    onChange={(e) => { setWardName(e.target.value) }}
                    />
                    <button
                    onClick={() => {handleAddWard()}}
                    className="save-btn"
                    >
                        Save
                    </button>
                </div>
            )
        }

        {
            wards && wards.map((ward) => {
                return (
                    <Link
                    to="/view-ward"
                    state={{ward}}
                    style={{ textDecoration: "none", color: "inherit" }}
                    key={ward.id}>
                    <p
                    className="ward"
                    
                    >
                        {ward.name}
                    </p>
                    </Link>
                )
            })
        }
    </div>
  )
}
