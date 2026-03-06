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

          <p className="review-text">{review.body}</p>

          <div className="review-footer">
            <span className="review-author">
              {/* If isAnonymous is true, backend sends 'Anonymous User' here */}
              Contributed by: <strong>{review.author?.username || 'Member of the Jury'}</strong>
            </span>
            {review.isAnonymous && (
              <span className="anonymous-tag" title="Identity protected by the Jury">
                (Anonymous)
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
