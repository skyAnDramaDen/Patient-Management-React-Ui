import React, { useState, useContext, useEffect } from 'react';
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { AuthContext } from "../../Authcontext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Structured", token);
      }
      // setIsLoggedIn(!!token);
    }, 3000);
    return () => clearTimeout(timer);
  });
  
  const loginUser = (username, password) => {
    setLoading(true);
    setError('');

    $.post('http://localhost:3000/login', { username, password }, function(response) {
      login(response.token);
      // localStorage.setItem('token', response.token);
      
      console.log('Login successful:', response.message);
    }).fail(function(error) {
      console.error('Login error:', error.responseJSON ? error.responseJSON.message : error.statusText);
      setError('Invalid credentials. Please try again.');
    }).always(function() {
      setLoading(false);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(username, password); 
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
