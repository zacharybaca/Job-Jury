import React, { useState, useEffect } from 'react';
import './search-bar.css';

const SearchBar = ({ setSearchTerm }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Set a timer to update the "real" search term after 500ms of no typing
    const handler = setTimeout(() => {
      setSearchTerm(displayValue);
    }, 500);

    // Cleanup: If the user types again before 500ms, cancel the previous timer
    return () => clearTimeout(handler);
  }, [displayValue, setSearchTerm]);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search for an employer (e.g. Surf Internet)..."
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>
      {displayValue && (
        <button
          className="clear-search"
          onClick={() => setDisplayValue('')}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
