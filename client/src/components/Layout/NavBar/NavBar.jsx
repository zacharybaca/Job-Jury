import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import JobJuryLogo from '../JobJuryLogo/JobJuryLogo.jsx';
import './nav-bar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State and Ref for the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown is open AND the click happened outside our ref, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('user-wallpaper');
    await logout();
    setIsDropdownOpen(false); // Close menu on logout
    navigate('/login', { state: { message: 'Successfully logged out.' } });
  };

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsDropdownOpen(false);

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo-link">
          <JobJuryLogo className="nav-logo-svg" />
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-item">
              Browse Companies
            </Link>
          </li>

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
            // The Dropdown Container
            <li className="user-menu-container" ref={dropdownRef}>
              <button
                className="dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {/* NEW: Dynamic Avatar Rendering */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="nav-avatar"
                  />
                ) : (
                  <div className="nav-avatar-fallback">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : '?'}
                  </div>
                )}

                <span className="nav-username">
                  {user.name || user.username}
                </span>
                <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </button>

              {/* The Dropdown Menu */}
              {/* The Dropdown Menu */}
              {isDropdownOpen && (
                <div className="nav-user-dropdown">
                  {' '}
                  {/* Renamed */}
                  <div className="nav-user-header">
                    {' '}
                    {/* Renamed */}
                    Signed in as <strong>{user.username}</strong>
                  </div>
                  <div className="nav-user-divider"></div> {/* Renamed */}
                  <Link
                    to="/register-company"
                    className="nav-user-item" // Renamed
                    onClick={closeMenu}
                  >
                    Register Company
                  </Link>
                  <Link
                    to="/my-submissions"
                    className="nav-user-item" // Renamed
                    onClick={closeMenu}
                  >
                    My Submissions
                  </Link>
                  <Link
                    to="/my-favorites"
                    className="nav-user-item" // Renamed
                    onClick={closeMenu}
                  >
                    My Favorites
                  </Link>
                  <Link
                    to="/newsfeed"
                    className="nav-user-item" // Renamed
                    onClick={closeMenu}
                  >
                    Newsfeed
                  </Link>

                  <Link
                    to="/settings"
                    className="nav-user-item" // Renamed
                    onClick={closeMenu}
                  >
                    Profile Settings
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="nav-user-item" // Renamed
                      onClick={closeMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="nav-user-divider"></div> {/* Renamed */}
                  <button
                    onClick={handleLogout}
                    className="nav-user-item logout-item" // Renamed
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
