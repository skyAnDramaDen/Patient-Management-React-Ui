import React, { useState, useEffect, useContext, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MedBanner from './Components/MedBanner/MedBanner';
import Footer from './Components/Footer/Footer';
import BodyContent from './Components/BodyContent/BodyContent';
import Login from './Components/Login/Login';
import AuthProvider, { AuthContext } from "./Authcontext";
import DoctorMenu from './Components/DoctorMenu/DoctorMenu';
import Header from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AppContent = () => {
  const { user } = useContext(AuthContext);
  const { isLoggedIn, role } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);

  const sidebarRef = useRef(null);
  const menuBurgerRef = useRef(null);

  const renderContent = () => {
    switch (role) {
      case 'super-admin':
        return (
          <>
            <NavBar />
            <BodyContent />
            <Footer />
          </>
        );
      case 'admin':
        return (
          <>
            <NavBar />
            {/* <AdminMenu /> */}
            <Footer />
          </>
        );
      case 'doctor':
        return (
          <>
            <NavBar />
            <DoctorMenu />
            <Footer />
          </>
        );
      case 'nurse':
        return (
          <>
            <NavBar />
            {/* <NurseMenu /> */}
            <Footer />
          </>
        );
      default:
        return <Login />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      //the event below at first would immediately turn showNav false
      //because when i click, its true but i click on a diff field 
      //thats not the sidebar and when the menu is open and there is
      //a click thats not the sidebar, it is to set to false. so i 
      //referenced the menu burger click as well and if the click is from
      //the menu burger, nothing happens
      if (sidebarRef.current && (!sidebarRef.current.contains(event.target) && !menuBurgerRef.current.contains(event.target))) {
        setShowNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowNav]);

  return (
    <div className="App">
      {isLoggedIn ? (
          <>
          <ToastContainer 
            position="top-right" 
            autoClose={5000} 
            hideProgressBar={false} 
            newestOnTop 
            closeOnClick 
            pauseOnHover 
            draggable 
            theme="colored" 
        />
          <Header showNav={showNav} setShowNav={setShowNav} ref={menuBurgerRef}/>
          {/* <NavBar /> */}
          
         {
          user && user.role == "super-admin" ? <Sidebar show={showNav} setShowNav={setShowNav}  ref={sidebarRef} /> : <p></p>
         }
          
          <BodyContent />
          {/* <Footer /> */}
          </>
        ) : (
          <Login />
        )
      }
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;