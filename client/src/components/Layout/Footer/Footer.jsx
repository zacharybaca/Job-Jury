import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Job<span className="logo-accent">Jury</span>
          </Link>
          <p className="footer-tagline">
            Empowering employees through transparent workplace verdicts.
          </p>
        </div>

        <div className="footer-links-section">
          <div className="footer-column">
            <h4>Platform</h4>
            <Link to="/">Browse Companies</Link>
            <Link to="/register-company">Add a Company</Link>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Job Jury. All rights reserved.</p>
        <div className="footer-legal">
          <span>Built with the MERN Stack</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
