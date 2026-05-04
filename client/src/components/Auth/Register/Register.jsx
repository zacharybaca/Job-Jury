import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher.js';
import Toast from '../../Layout/Toast/Toast.jsx';
import '../auth-forms.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    isEmployer: false, // Added tracking for the employer role
  });
  const { fetcher } = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();

  const [toastConfig, setToastConfig] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      setToastConfig({
        message: location.state.message,
        type: 'success',
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastConfig(null);
    const response = await fetcher('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (response.success) {
      if (
        response.data.isEmployer &&
        response.data.verificationStatus === 'unverified'
      ) {
        navigate('/employer/dashboard');
      } else {
        navigate('/login', {
          state: { message: 'Registration successful! Please log in.' },
        });
      }
    } else {
      setToastConfig({ message: response.error, type: 'error' });
    }
  };

  return (
    <div className="auth-page-container">
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}
      <div className="auth-card">
        <div className="auth-logo-wrapper-alt">
          <img
            src="/assets/icons/job_jury_banner_brick_logo.png"
            alt="Join the Jury Banner"
          />
        </div>
        <h2 className="auth-title">Join the Jury</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* NEW: Employer Role Toggle */}
          <div className="auth-form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isEmployer}
                onChange={(e) =>
                  setFormData({ ...formData, isEmployer: e.target.checked })
                }
              />
              Register as an Employer / Company Representative
            </label>
          </div>

          <button type="submit" className="auth-submit-btn">
            Create Account
          </button>
        </form>
        <p className="auth-footer">
          Already a member?{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
