import "./Billing.css";

import React, {  useState, useEffect } from 'react';
import $ from "jquery";

import { useLocation, useNavigate, Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";

function Billing() {
  const server_url = process.env.REACT_APP_API_URL;
    const handlePayment = () => {
        $.ajax({
            url: `${server_url}/payment/create-checkout-session`,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                items: [
                    { id: 1, quantity: 3 },
                    { id: 2, quantity: 1 }
                ]
            }),
            success: function(response) {
                const { url } = response;
                
                window.location = url;
            },
            error: function(error) {
                console.timeLog(error);
            }
        })
    }
  return (
    <div className="billing">
      <PageHeader title="Billing" />
      <button
      onClick={handlePayment}
      >
        Pay
      </button>
      <Link
      to="/billing-category"
      >
      <button className="billing-category-btn">Billing Categories</button>
      </Link>
    </div>
  )
}

export default Billing
