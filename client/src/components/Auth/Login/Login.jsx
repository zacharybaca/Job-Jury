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

  // Pull checkUserAuth from your AuthContext
  const { checkUserAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetcher('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      /**
       * TRIGGER GLOBAL SYNC:
       * Instead of manually setting user state, we tell the Provider
       * to fetch the user data. This ensures isAdmin is correctly
       * identified before we leave this function.
       */
      await checkUserAuth();

      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } else {
      alert(response.error || "Login failed. Check your credentials.");
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
