import "./ViewFloor.css";

import React, { useState, useEffect } from 'react';

import { useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import PageHeader from "../PageHeader/PageHeader";

export default function ViewFloor() {
    const [floor, setFloor] = useState(null);
    const [wards, setWards] = useState([]);
    const location = useLocation();


    useEffect(() => {
        setFloor(location.state.floor);
    })

    useEffect(() => {
        let floor_id;
        if (location.state.floor) {
            floor_id = location.state.floor.id;
        }
        $.ajax({
            url: `http://localhost:3000/floors/get-floor-by/${floor_id}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                // console.log(response);
                setFloor(response);
            },
            error: function(error) {
                console.log(error);
            }
        })
    }, [])



    useEffect(() => {
        let floor_id;
        if (location.state.floor) {
            floor_id = location.state.floor.id;
        }
        $.ajax({
            url: `http://localhost:3000/floors/get-floor-wards-by/${floor_id}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            success: function(response) {
                console.log(response);
                setWards(response.wards);
            },
            error: function(error) {
                console.log(error);
            }
        })
    }, [])

  return (
    <div className="floor">
        <PageHeader title="Floor" />
      
    </div>
  )
}
