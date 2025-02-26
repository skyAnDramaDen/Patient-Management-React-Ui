import React from 'react';
import './Footer.css';
// import instagram_icon from "../Assets/instagram_icon.png";
// import pintrest_icon from "../Assets/pintester_icon.png";
// import whatsapp_icon from "../Assets/whatsapp_icon.png";

// import footer_logo from '../Assets/logo_big.png';

export default function Footer() {
  return (
    <div className='footer'>
        <div className="footer-logo">
            {/* <img src={footer_logo} alt="" /> */}
            <p>MediLife</p>
        </div>
        <ul className="footer-links">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Services</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                {/* <img src={instagram_icon} alt="" /> */}
            </div>
            <div className="footer-icons-container">
                {/* <img src={pintrest_icon} alt="" /> */}
            </div>
            <div className="footer-icons-container">
                {/* <img src={whatsapp_icon} alt="" /> */}
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2025 - All rights reserved by &dash Co. Limited</p>
        </div>
    </div>
  )
}
