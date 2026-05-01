import React, { useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';

const AdminCreateUser = () => {
  const { fetcher } = useFetcher();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    isAdmin: false,
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);

    const response = await fetcher('/api/users', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    setIsSubmitting(false);

    if (response.success) {
      setMessage({
        type: 'success',
        text: `User ${formData.username} created successfully.`,
      });
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        isAdmin: false,
      });
    } else {
      setMessage({
        type: 'error',
        text: response.error || 'Failed to create user.',
      });
    }
  };

  return (
    <div className="admin-create-user-container">
      <div className="admin-create-user-card">
        <h2 className="admin-create-user-title">Create New User</h2>
        <p className="admin-create-user-subtitle">
          Manually provision an account without email verification.
        </p>

        {message.text && (
          <div className={`message-banner ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Temporary Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleInputChange}
              />
              Grant Administrative Privileges
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Provisioning...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUser;
