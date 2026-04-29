import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useFetcher } from '../../../hooks/useFetcher';
import Button from 'react-bootstrap/Button';
import './profile-settings.css';

const ProfileSettings = () => {
  const { user, logout } = useAuth();
  const { fetcher } = useFetcher();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Image State
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Populate initial data when component mounts
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
      }));
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create a temporary local URL to preview the image before uploading
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }

    setIsSubmitting(true);

    // Build FormData payload for Multer
    const submitData = new FormData();
    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('notificationsEnabled', formData.notificationsEnabled);

    if (formData.password) {
      submitData.append('password', formData.password);
    }

    if (avatarFile) {
      submitData.append('avatar', avatarFile);
    }

    const response = await fetcher('/api/users/profile', {
      method: 'PUT',
      body: submitData,
    });

    setIsSubmitting(false);

    if (response.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Clear password fields after successful update
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));

      // Optional: Force a hard reload to refresh the AuthContext globally
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setMessage({
        type: 'error',
        text: response.error || 'Failed to update profile.',
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'DANGER: Are you absolutely sure you want to delete your account? This will permanently erase your profile, avatar, and all of your reviews.'
    );

    if (confirmDelete) {
      const response = await fetcher('/api/users/profile', {
        method: 'DELETE',
      });

      if (response.success) {
        await logout();
        navigate('/', {
          state: { message: 'Your account has been permanently deleted.' },
        });
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Failed to delete account.',
        });
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <header className="profile-header">
          <h2>Profile Settings</h2>
          <p>Update your personal information and avatar.</p>
        </header>

        {message.text && (
          <div className={`message-banner ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-preview-container">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {formData.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="avatar-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => fileInputRef.current.click()}
              >
                Change Avatar
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden-file-input"
              />
              <p className="help-text">JPG, PNG, or WebP. Max size 5MB.</p>
            </div>
          </div>

          <hr className="divider" />

          {/* Account Details */}
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

          <hr className="divider" />

          {/* Password Update (Optional) */}
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
          </div>

          {formData.password && (
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>

        {/* Danger Zone */}
        <div className="danger-zone">
          <h3>Notifications</h3>
          <p>Turn Followed Company Updates on or off</p>
          {/* NEW: Notifications Toggle */}
          <Button
            variant={formData.notificationsEnabled ? 'success' : 'danger'}
            onClick={() => setFormData((prev) => ({
              ...prev,
              notificationsEnabled: !prev.notificationsEnabled,
            }))}
          >
            {formData.notificationsEnabled ? 'Notifications ON' : 'Notifications OFF'}
          </Button>

          <div className="danger-zone"></div>

          <h3>Danger Zone</h3>
          <p>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="btn-danger"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
