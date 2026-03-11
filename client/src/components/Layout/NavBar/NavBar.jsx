import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import JobJuryLogo from '../JobJuryLogo/JobJuryLogo.jsx';
import './nav-bar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // NEW: State and Ref for the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // NEW: Click-outside listener
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
              <li><Link to="/register" className="nav-item">Sign Up</Link></li>
              <li><Link to="/login" className="nav-item">Login</Link></li>
            </>
          )}

          {user && (
            // NEW: The Dropdown Container
            <li className="user-menu-container" ref={dropdownRef}>
              <button
                className="dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.name || user.username}
                <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

              {/* NEW: The Dropdown Menu */}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    Signed in as <strong>{user.username}</strong>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link to="/register-company" className="dropdown-item" onClick={closeMenu}>
                    Register Company
                  </Link>
                  <Link to="/my-submissions" className="dropdown-item" onClick={closeMenu}>
                    My Submissions
                  </Link>

                  {/* Optional: Only show Admin Dashboard link if user is an admin */}
                  {user.isAdmin && (
                    <Link to="/admin/dashboard" className="dropdown-item" onClick={closeMenu}>
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="dropdown-divider"></div>

                  <button onClick={handleLogout} className="dropdown-item logout-item">
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
