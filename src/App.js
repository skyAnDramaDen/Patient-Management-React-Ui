import React, { useState, useEffect, useContext } from 'react';
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
// import 'bootstrap/dist/css/bootstrap.min.css';


const AppContent = () => {
  const { isLoggedIn, role } = useContext(AuthContext);
  // console.log(role);

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

  // useEffect(() => {
    
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsLoggedIn(true);  
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  return (
    <div className="App">
      {isLoggedIn ? (
          <>
          <NavBar />
          <BodyContent />
          <Footer />
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