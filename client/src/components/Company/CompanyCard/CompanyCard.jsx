import React from 'react';
import { Link } from 'react-router-dom';
import './company-card.css';

const CompanyCard = ({ company }) => {
  // 1. Mock Data / Placeholder Logic
  // If no company prop is passed, it uses this "Fake" data for design testing
  const data = company || {
    _id: "preview-id",
    name: "Example Corp",
    industry: "Software Engineering",
    location: "La Porte, IN",
    imageUrl: "https://via.placeholder.com/350x180?text=Job+Jury+Logo+Preview",
    averageRating: 4.5
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="company-card">
      <div className="card-image-container">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={`${data.name} logo`}
            className="company-logo"
          />
        ) : (
          <div className="no-image">No Logo Provided</div>
        )}
      </div>

      <div className="card-body">
        <h3 className="company-name">{data.name}</h3>

        <p className="company-meta">
          {data.industry} <span className="separator">•</span> {data.location}
        </p>

        <div className="rating-container">
          <div className="stars-row">
            {renderStars(data.averageRating)}
          </div>
          <span className="rating-badge">{data.averageRating}</span>
        </div>

        {/* Link is disabled for the placeholder so it doesn't break the app */}
        <Link
            to={data._id === "preview-id" ? "#" : `/companies/${data._id}`}
            className="view-btn"
        >
          View Verdict
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
