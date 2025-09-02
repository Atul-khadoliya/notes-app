import React, { useState } from 'react';
import apiClient from '../services/api';

const Auth = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/token' : '/users/';

    try {
      let response;
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        response = await apiClient.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setToken(response.data.access_token);
      } else {
        await apiClient.post(endpoint, { username, password });
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const loginResponse = await apiClient.post('/token', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setToken(loginResponse.data.access_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred.');
    }
  };

  return (
    <div className="auth-container card">
      <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn primary-btn">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="btn switch-btn"
      >
        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
      </button>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Auth;
