import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import JobJuryLogo from '../JobJuryLogo/JobJuryLogo.jsx';
import './nav-bar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    setIsDropdownOpen(false);
    navigate('/login', { state: { message: 'Successfully logged out.' } });
  };

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
            <li className="user-menu-container" ref={dropdownRef}>
              <button
                className="dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
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
              {isDropdownOpen && (
                <div className="nav-user-dropdown">
                  <div className="nav-user-header">
                    <div>
                      Signed in as <strong>{user.username}</strong>
                    </div>
                    {/* Role Indicator Badge */}
                    {(user.isAdmin || user.isEmployer) && (
                      <div
                        className="nav-user-role"
                        style={{
                          fontSize: '0.8rem',
                          color: '#64748b',
                          marginTop: '4px',
                        }}
                      >
                        {user.isAdmin ? 'Administrator' : 'Employer Account'}
                      </div>
                    )}
                  </div>
                  <div className="nav-user-divider"></div>

                  {/* Universal Links */}
                  <Link
                    to="/register-company"
                    className="nav-user-item"
                    onClick={closeMenu}
                  >
                    Register Company
                  </Link>

                  {/* Standard User Only Links */}
                  {!user.isEmployer && (
                    <>
                      <Link
                        to="/my-submissions"
                        className="nav-user-item"
                        onClick={closeMenu}
                      >
                        My Submissions
                      </Link>
                      <Link
                        to="/my-favorites"
                        className="nav-user-item"
                        onClick={closeMenu}
                      >
                        My Favorites
                      </Link>
                      <Link
                        to="/newsfeed"
                        className="nav-user-item"
                        onClick={closeMenu}
                      >
                        Newsfeed
                      </Link>
                    </>
                  )}

                  {/* Universal Links */}
                  <Link
                    to="/settings"
                    className="nav-user-item"
                    onClick={closeMenu}
                  >
                    Profile Settings
                  </Link>

                  {/* Role Dashboards */}
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="nav-user-item"
                      onClick={closeMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.isEmployer && (
                    <Link
                      to="/employer/dashboard"
                      className="nav-user-item"
                      onClick={closeMenu}
                    >
                      Employer Dashboard
                    </Link>
                  )}

                  <div className="nav-user-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="nav-user-item logout-item"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
          <li>
            {user && (
              <div className="notification-bell-container">
                {user && user.notificationsEnabled ? (
                  <img
                    src="/assets/icons/notification-icon-on.svg"
                    alt="Notifications On"
                    className="notification-bell"
                  />
                ) : (
                  <img
                    src="/assets/icons/notification-icon-off.png"
                    alt="Notifications Off"
                    className="notification-bell notification-bell-off"
                  />
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
