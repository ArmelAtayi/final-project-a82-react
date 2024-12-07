import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';  


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Hardcoded credentials
  const hardcodedUsername = 'Armel';
  const hardcodedPassword = 'Armel123#';

  // Check if the user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard'); // Redirect to dashboard if logged in
    }
  }, [navigate]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (username === hardcodedUsername && password === hardcodedPassword) {
      const token = 'mock-jwt-token'; 
      localStorage.setItem('authToken', token);
      navigate('/dashboard'); 
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
