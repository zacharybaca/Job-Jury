import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetcher } from '../../hooks/useFetcher.js';
import './auth-forms.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetcher } = useFetcher();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    const response = await fetcher('/api/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    setIsSubmitting(false);

    if (response.success) {
      setMessage(
        'If an account exists with that email, a reset link has been sent.'
      );
      setEmail(''); // Clear the input
    } else {
      setError(response.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Enter your email address and we will send you a link to reset your
          password.
        </p>

        {/* Display success or error messages */}
        {message && <div className="message-banner success">{message}</div>}
        {error && <div className="message-banner error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '20px' }}>
          Remembered your password?{' '}
          <Link to="/login" className="auth-link">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
