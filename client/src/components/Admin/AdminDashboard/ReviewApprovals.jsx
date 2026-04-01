import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import './admin-dashboard.css';

const ReviewApprovals = () => {
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  useEffect(() => {
    const loadFlaggedReviews = async () => {
      setLoading(true);
      const response = await fetcher('/api/reviews/flagged');
      if (response.success) {
        console.log('Flagged reviews loaded:', response.data.data);
        setFlaggedReviews(response.data.data);
      }
      setLoading(false);
    };

    loadFlaggedReviews();
  }, [fetcher]);

  const handleApprove = async (id) => {
    if (window.confirm('Clear the flag and approve this review?')) {
      const response = await fetcher(`/api/reviews/${id}/approve`, {
        method: 'PATCH',
      });

      if (response.success) {
        setFlaggedReviews(flaggedReviews.filter((review) => review._id !== id));
      } else {
        alert(response.error || 'Failed to approve review.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm('Are you sure you want to permanently delete this review?')
    ) {
      const response = await fetcher(`/api/reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        console.log(
          'Review deleted:',
          flaggedReviews.filter((review) => review._id !== id)
        );
        setFlaggedReviews(flaggedReviews.filter((review) => review._id !== id));
      } else {
        alert(response.error || 'Failed to delete review.');
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Checking Jury reports...</div>;
  }

  return (
    <div className="admin-container">
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Job Title</th>
              <th>Review Content</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flaggedReviews.length > 0 ? (
              flaggedReviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.rating} ★</td>
                  <td>{review.jobTitle}</td>
                  <td className="review-body-cell">{review.body}</td>
                  <td>{review.author?.username || 'Anonymous'}</td>
                  <td className="admin-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(review._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(review._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  No flagged reviews found. The Jury is satisfied.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewApprovals;
