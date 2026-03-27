import React, { useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher.js';
import './review-list.css';

const ReviewList = ({ reviews }) => {
  const { fetcher } = useFetcher();
  // Track IDs of reviews currently being processed to prevent duplicate clicks
  const [loadingIds, setLoadingIds] = useState(new Set());
  // Track locally flagged IDs to update UI immediately after success
  const [localFlaggedIds, setLocalFlaggedIds] = useState(new Set());

  const handleToggleInappropriate = async (reviewId, isChecked) => {
    if (!isChecked) return; // Logic for un-flagging would require a separate endpoint

    setLoadingIds((prev) => new Set(prev).add(reviewId));

    const response = await fetcher(`/api/reviews/${reviewId}/inappropriate`, {
      method: 'PATCH',
    });

    if (response.success) {
      setLocalFlaggedIds((prev) => new Set(prev).add(reviewId));
    } else {
      alert(response.error || 'Failed to mark review as inappropriate.');
    }

    setLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(reviewId);
      return next;
    });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="empty-reviews">
        <p>No verdicts have been reached yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const isFlagged = review.isFlagged || localFlaggedIds.has(review._id);
        const isLoading = loadingIds.has(review._id);

        return (
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
                Contributed by:{' '}
                <strong>{review.author?.username || 'Member of the Jury'}</strong>
              </span>
              {review.isAnonymous && (
                <span className="anonymous-tag" title="Identity protected by the Jury">
                  (Anonymous)
                </span>
              )}
            </div>

            <div className="form-group-checkbox report-section">
              <input
                type="checkbox"
                id={`flag-${review._id}`}
                checked={isFlagged}
                disabled={isFlagged || isLoading}
                onChange={(e) => handleToggleInappropriate(review._id, e.target.checked)}
              />
              <label htmlFor={`flag-${review._id}`}>
                {isFlagged ? 'Reported for Review' : 'Mark as inappropriate?'}
                <span className="checkbox-hint">
                  {isLoading ? ' (Processing...)' : ''}
                  {isFlagged && !isLoading ? ' (The Jury is reviewing this content)' : ''}
                </span>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
