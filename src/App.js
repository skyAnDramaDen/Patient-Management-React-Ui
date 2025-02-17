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

const AppContent = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  console.log(isLoggedIn);

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
        )}      

    
      
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
