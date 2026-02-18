import React from 'react';
import { Link } from 'react-router-dom';
import './company-card.css';

const CompanyCard = ({ company }) => {
  // Helper to render stars based on the rating
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="company-card">
      <div className="card-image-container">
        {company.imageUrl ? (
          <img
            src={company.imageUrl}
            alt={`${company.name} logo`}
            className="company-logo"
          />
        ) : (
          <div className="no-image">No Logo Provided</div>
        )}
      </div>

      <div className="card-body">
        <h3 className="company-name">{company.name}</h3>

        <p className="company-meta">
          {company.industry} <span className="separator">•</span>{' '}
          {company.location}
        </p>

        <div className="rating-container">
          <div className="stars-row">{renderStars(company.averageRating)}</div>
          <span className="rating-badge">{company.averageRating || '0'}</span>
        </div>

        <Link to={`/companies/${company._id}`} className="view-btn">
          View Verdict
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
