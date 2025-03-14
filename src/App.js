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
// import 'bootstrap/dist/css/bootstrap.min.css';


const AppContent = () => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

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
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setShowNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <Header showNav={showNav} setShowNav={setShowNav} />
          {/* <NavBar /> */}
          
         <Sidebar show={showNav} setShowNav={setShowNav} ref={sidebarRef} />
          
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