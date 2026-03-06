import React, { useState, useEffect } from 'react';
import './search-bar.css';

const SearchBar = ({ setSearchTerm, setFilterIndustry, industries }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(displayValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [displayValue, setSearchTerm]);

  return (
    <div className="search-filter-wrapper">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search employer..."
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="filter-container">
        <select
          className="industry-select"
          onChange={(e) => setFilterIndustry(e.target.value)}
        >
          <option value="">All Industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
