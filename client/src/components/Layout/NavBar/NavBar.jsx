import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/job-jury-logo-minimal.jpg';
import './nav-bar.css';

const NavBar = () => {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="nav-logo-link">
          <img src={logo} alt="Job Jury Logo" className="nav-logo-img" />
        </Link>

        {/* Links Section */}
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Browse Companies</Link></li>
          <li><Link to="/register-company" className="nav-item">Register Company</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
