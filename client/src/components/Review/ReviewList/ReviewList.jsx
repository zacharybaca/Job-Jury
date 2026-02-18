import React from 'react';
import './review-list.css';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="empty-reviews">
        <p>No verdicts have been reached yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <div className="review-header">
            <div className="review-badge">
              <span className="star-icon">★</span>
              {review.rating.toFixed(1)}
            </div>
            <div className="review-info">
              <h4 className="review-job-title">{review.jobTitle}</h4>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="review-text">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
