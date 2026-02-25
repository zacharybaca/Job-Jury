import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher.js';
import { useAuth } from '../../../context/Auth/AuthProvider'; // Verified path
import '../auth-forms.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { fetcher } = useFetcher();
  const { setUser } = useAuth(); // Accessing the global setUser function
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetcher('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      // Update the global auth state immediately with the logged-in user
      setUser(response.data.user);
      navigate('/');
    } else {
      alert(response.error || 'Login failed');
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
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
