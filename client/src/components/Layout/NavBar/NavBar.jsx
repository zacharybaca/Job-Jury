import React from 'react';
import { Link } from 'react-router-dom';
import './nav-bar.css';

const NavBar = () => {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="footer-logo">
          Job<span className="logo-accent">Jury</span>
        </Link>

        {/* Links Section */}
        <ul className="nav-links">
          <li><Link to="/register" className="nav-item">Sign Up</Link></li>
          <li><Link to="/login" className="nav-item">Login</Link></li>
          <li><Link to="/" className="nav-item">Browse Companies</Link></li>
          <li><Link to="/register-company" className="nav-item">Register Company</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
