import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher.js';
import { useAuth } from '../../../hooks/useAuth.js';
import '../auth-forms.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { fetcher } = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();

  // CRITICAL: Pull setUser from your AuthContext
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetcher('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  console.log("Full Login Response:", response); // DEBUG: Check this in your browser console

  if (response.success) {
    // 1. CHECK THE PATH: Based on your previous patterns, it's likely response.data.user
    // But if that fails, try: setUser(response.data);
    const userData = response.data?.user || response.data;

    setUser(userData);

    const origin = location.state?.from?.pathname || '/';
    navigate(origin);
  } else {
    alert(response.error || "Login failed.");
  }
};

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn">
            Login to Job Jury
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
