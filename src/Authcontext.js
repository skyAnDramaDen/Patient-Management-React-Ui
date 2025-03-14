import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = localStorage.getItem("user");
  
    let parsedUser = null;
    
    if (user) {
      try {
        parsedUser = JSON.parse(user);
      } catch (error) {
        console.error("Failed to parse storedUser:", error);
      }
    }
  
    if (token && role) {
      setIsLoggedIn(true);
      setRole(role);
      setUser(parsedUser);
    }
  
    setLoading(false);
  }, []);

  //use effect hook for when user logs in to establish the socket
  const useLoginEffect = (isLoggedIn, role, user) => {
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      if (isLoggedIn && role && user) {
        // ssocket connection
        const newSocket = io("http://localhost:3000", {
          transports: ["websocket"],
          query: { userId: user.id, role: role }
        });
  
        setSocket(newSocket);
  
        newSocket.on("connect", () => {
          console.log("Connected to WebSocket as", user.username);
          newSocket.emit('join', { username: user.username, role, userId: user.id }); // emitting join event here
        });
  
        return () => newSocket.close();
      }
    }, [isLoggedIn, role, user]);
  
    return socket;
  };

  const socket = useLoginEffect(isLoggedIn, role, user);

  const login = (token, role, user) => {
    localStorage.setItem("token", token);

    //to set the role below, i could've used the state role
    //but that is not updated as quickly and so when i login
    //i have to reload to see the effects so i pass the role
    //from the response which is set at the time
    localStorage.setItem("role", role);
    
    localStorage.setItem("user", JSON.stringify(user));

    setIsLoggedIn(true);
    setRole(role);
    setUser(user);

    const newSocket = io("http://localhost:3000", {
      query: { userId: user.id, role: role }
    });

    // setSocket(newSocket);

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

    if (socket) {
      socket.disconnect();
      // setSocket(null);
    }

    navigate("/login"); 
  }, [socket, navigate]);

  
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
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role, user, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
