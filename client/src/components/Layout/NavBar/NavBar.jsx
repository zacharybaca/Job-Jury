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
    localStorage.removeItem('user-wallpaper');
    await logout();

    // Pass a state object along with the route change
    navigate('/login', { state: { message: 'Successfully logged out.' } });
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
          <li>
            <Link to="/my-submissions" className="nav-item">
              My Submissions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
