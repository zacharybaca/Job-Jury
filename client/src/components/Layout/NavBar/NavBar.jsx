import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import JobJuryLogo from '../JobJuryLogo/JobJuryLogo.jsx';
import './nav-bar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    // 1. Wipe the UI preference so a new session gets a clean slate
    localStorage.removeItem('user-wallpaper');

    // 2. Clear the cookie on the server and set user to null locally
    await logout();

    // 3. Redirect to the login page (This triggers the CSS fade effect)
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="nav-logo-link">
          <JobJuryLogo className="nav-logo-svg" />
        </Link>

        {/* Links Section */}
        <ul className="nav-links">
          {!user && (
            <>
              <li>
                <Link to="/register" className="nav-item">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-item">
                  Login
                </Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <button
                  onClick={handleLogout}
                  className="nav-item logout-button"
                >
                  Logout
                </button>
              </li>
              <li>
                <Link to="/register-company" className="nav-item">
                  Register Company
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/" className="nav-item">
              Browse Companies
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
