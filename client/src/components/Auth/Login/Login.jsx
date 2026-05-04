import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher.js';
import { useAuth } from '../../../hooks/useAuth.js';
import Toast from '../../Layout/Toast/Toast.jsx';
import Logo from '../../Layout/Logo/Logo.jsx';
import AlternateLogo from '../../Layout/AlternateLogo/AlternateLogo.jsx';
import '../auth-forms.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // New state to control the Toast (message and type)
  const [toastConfig, setToastConfig] = useState(null);

  const { fetcher } = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const { checkUserAuth } = useAuth();

  // 1. Check for messages passed from the NavBar (like Logout)
  useEffect(() => {
    if (location.state?.message) {
      setToastConfig({
        message: location.state.message,
        type: 'success',
      });
      // Clear the history state so the toast doesn't pop up again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastConfig(null); // Clear any existing toasts before trying again

    const response = await fetcher('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      await checkUserAuth();
      const origin = location.state?.from?.pathname || '/';
      if (
        response.data.isEmployer &&
        response.data.verificationStatus === 'unverified'
      ) {
        navigate('/employer/dashboard');
      } else {
        navigate(origin);
      }
    } else {
      // 2. Replace the alert() with a professional Error Toast
      setToastConfig({
        message: response.error || 'Login failed. Check your credentials.',
        type: 'error',
      });
    }
  };

  return (
    <div className="auth-page-container">
      {/* 3. Conditionally render the Toast */}
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}

      <div className="auth-card">
        {/* NEW: Wrapper to constrain the Logo proportions */}
        <div className="auth-logo-wrapper">
          <AlternateLogo />
        </div>

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
            {/* NEW: Flex container to align the label and the forgot password link */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label>Password</label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '0.85rem',
                  color: '#10b981',
                  textDecoration: 'none',
                }}
              >
                Forgot Password?
              </Link>
            </div>
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
