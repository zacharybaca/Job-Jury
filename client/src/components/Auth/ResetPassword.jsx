import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetcher } from '../../hooks/useFetcher.js';
import './auth-forms.css'; // Reusing your existing auth styling

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Extract the token directly from the URL (e.g., /resetpassword/12345abcde)
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { fetcher } = useFetcher();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    // Send the PUT request with the token in the URL and the new password in the body
    const response = await fetcher(`/api/auth/resetpassword/${resetToken}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });

    if (response.success) {
      setMessage('Password successfully reset! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Password reset successful. Please log in.' },
        });
      }, 3000);
    } else {
      setError(
        response.error || 'Failed to reset password. The link may have expired.'
      );
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Your Password</h2>

        {message && <div className="message-banner success">{message}</div>}
        {error && <div className="message-banner error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="auth-form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="auth-submit-btn">
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
