import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (token, role, user) => {
    localStorage.setItem("token", token);

    //to set the role below, i couldve used the state role
    //but that is not updated as quickly and so when i login
    //i have to reload to see the effects so i pass the role
    //from the response which is set at the time
    localStorage.setItem("role", role);
    
    localStorage.setItem("user", JSON.stringify(user));

    setIsLoggedIn(true);
    setRole(role);
    setUser(user);
    // console.log(user);
    if (role == "super-admin") {
      navigate("/");
    } else if (role == "doctor") {
      navigate("/doctor-home");
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    navigate("/login"); 
  }, [navigate]);

  
  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(logout, 10 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(logoutTimer);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
