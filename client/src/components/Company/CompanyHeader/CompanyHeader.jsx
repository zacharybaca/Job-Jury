import React from 'react';
import './company-header.css';

const CompanyHeader = ({ company }) => {
  if (!company) return null;

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= roundedRating ? 'header-star filled' : 'header-star'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <header className="company-header-hero">
      <div className="header-content">
        <h1 className="header-name">{company.name}</h1>
        <div className="header-meta">
          <span className="header-industry">{company.industry}</span>
          <span className="header-divider">|</span>
          <span className="header-location">{company.location}</span>
        </div>
        <div className="header-rating-box">
          <div className="header-stars">
            {renderStars(company.averageRating)}
          </div>
          <span className="header-rating-num">
            {company.averageRating || '0.0'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
