import React from 'react';
import './company-header.css';

const CompanyHeader = ({ company }) => {
  if (!company) return null;

  // Destructure for cleaner code
  const { name, industry, location, averageRating, reviews } = company;

  const renderStars = (rating) => {
    const stars = [];
    // We iterate 1-5 to represent each star position
    for (let i = 1; i <= 5; i++) {
      let starClass = 'header-star';

      if (rating >= i) {
        // Full Star
        starClass += ' filled';
      } else if (rating > i - 1 && rating < i) {
        // Half Star (for scores like 4.5)
        starClass += ' half-filled';
      }

      stars.push(
        <span key={i} className={starClass}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <header className="company-header-hero">
      <div className="header-content">
        <h1 className="header-name">
          {name || 'Name Missing'}
        </h1>

        <div className="header-meta">
          <span className="header-industry">{industry}</span>
          <span className="header-divider">|</span>
          <span className="header-location">{location}</span>
        </div>

        <div className="header-rating-box">
          <div className="header-stars">
            {renderStars(averageRating)}
          </div>
          <div className="header-rating-info">
            <span className="header-rating-num">
              {averageRating ? averageRating.toFixed(1) : '0.0'}
            </span>
            <span className="header-review-count">
              ({reviews?.length || 0} {reviews?.length === 1 ? 'Verdict' : 'Verdicts'})
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
