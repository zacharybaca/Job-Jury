import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetcher } from '../../hooks/useFetcher';
import './employer-dashboard.css';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const { fetcher } = useFetcher();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [responseText, setResponseText] = useState('');

  const fetchCompanyReviews = useCallback(async () => {
    if (!user?.managedCompany) return;

    setLoading(true);
    const response = await fetcher(`/api/companies/${user.managedCompany}`);
    if (response.success) {
      setReviews(response.data.reviews || []);
    }
    setLoading(false);
  }, [user, fetcher]);

  useEffect(() => {
    fetchCompanyReviews();
  }, [fetchCompanyReviews]);

  const handleResponseSubmit = async (reviewId) => {
    if (!responseText.trim()) return;

    const response = await fetcher(`/api/reviews/${reviewId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ responseText }),
    });

    if (response.success) {
      setActiveReviewId(null);
      setResponseText('');
      fetchCompanyReviews();
    } else {
      alert(response.error || 'Failed to post response.');
    }
  };

  if (loading) return <div className="loading-container">Loading Company Data...</div>;

  return (
    <div className="employer-dashboard-container">
      <header className="employer-header">
        <h2>Employer Portal</h2>
        <p>Manage public relations and respond to employee reviews.</p>
      </header>

      <div className="review-management-list">
        {reviews.length === 0 ? (
          <p>No reviews found for your company.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="employer-review-card">
              <div className="review-header">
                <span className="rating-badge">Rating: {review.rating}/5</span>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-body">"{review.comment}"</p>

              {review.employerResponse?.text ? (
                <div className="official-response-block">
                  <h4>Official Company Response:</h4>
                  <p>{review.employerResponse.text}</p>
                  <small>
                    Responded on {new Date(review.employerResponse.respondedAt).toLocaleDateString()}
                  </small>
                </div>
              ) : (
                <div className="response-action-area">
                  {activeReviewId === review._id ? (
                    <div className="response-form">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Draft your official response..."
                        rows="4"
                      />
                      <div className="response-form-actions">
                        <button
                          className="btn-submit"
                          onClick={() => handleResponseSubmit(review._id)}
                        >
                          Publish Response
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            setActiveReviewId(null);
                            setResponseText('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn-respond"
                      onClick={() => setActiveReviewId(review._id)}
                    >
                      Draft Response
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
