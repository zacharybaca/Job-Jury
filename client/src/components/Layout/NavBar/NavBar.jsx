import React from 'react';
import { Link } from 'react-router-dom';
import './nav-bar.css';

const NavBar = () => {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Job<span className="logo-accent">Jury</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-item">Browse Companies</Link>
          </li>
          <li>
            <Link to="/register-company" className="nav-item">Register Company</Link>
          </li>
          {/* Add more links here as your app grows */}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
