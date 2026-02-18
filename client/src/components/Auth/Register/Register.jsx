import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetcher } from '../../hooks/useFetcher';
import '../auth-forms.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const { fetcher } = useFetcher();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetcher('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.success) {
      navigate('/login');
    } else {
      alert(response.error);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Join the Jury</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn">Create Account</button>
        </form>
        <p className="auth-footer">
          Already a member? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
