import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Placeholder for Auth State (later this comes from Context)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo Section */}
        <Link to="/" className="logo">
          <h1>Job-Jury</h1>
        </Link>

        {/* Search Bar Section */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search companies or industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Navigation Section */}
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile</Link>
              <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
