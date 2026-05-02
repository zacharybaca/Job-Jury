import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetcher } from '../../hooks/useFetcher';
import './employer-dashboard.css';

const EmployerDashboard = () => {
  const { user, checkUserAuth } = useAuth();
  const { fetcher } = useFetcher();

  // --- Claiming State ---
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // --- Review Management State ---
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [responseText, setResponseText] = useState('');

  // 1. Fetch companies for the claim form (Unverified Only)
  useEffect(() => {
    const fetchCompaniesForClaim = async () => {
      const res = await fetcher('/api/companies');
      if (res.success) {
        setAllCompanies(res.data.data || res.data || []);
      }
    };

    if (
      user?.verificationStatus === 'unverified' ||
      user?.verificationStatus === 'rejected'
    ) {
      fetchCompaniesForClaim();
    }
  }, [user, fetcher]);

  // 2. Fetch reviews for the active dashboard (Verified Only)
  const fetchCompanyReviews = useCallback(async () => {
    if (!user?.managedCompany || user?.verificationStatus !== 'verified')
      return;

    setLoadingReviews(true);
    const response = await fetcher(`/api/companies/${user.managedCompany}`);
    if (response.success) {
      // Target nested object matching API architecture
      const companyData = response.data?.data || response.data;
      setReviews(companyData?.reviews || []);
    }
    setLoadingReviews(false);
  }, [user, fetcher]);

  useEffect(() => {
    if (user?.verificationStatus === 'verified') {
      fetchCompanyReviews();
    }
  }, [fetchCompanyReviews, user]);

  // --- Handlers ---
  const handleClaimSubmit = async (companyId) => {
    if (!window.confirm('Are you sure you want to claim this company?')) return;

    setSubmittingClaim(true);
    const res = await fetcher('/api/users/claim-company', {
      method: 'POST',
      body: JSON.stringify({ companyId }),
    });

    if (res.success) {
      alert(
        res.data?.message || res.message || 'Claim submitted successfully.'
      );
      await checkUserAuth();
    } else {
      alert(res.error || res.data?.message || 'Failed to submit claim.');
    }
    setSubmittingClaim(false);
  };

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

  const filteredCompanies = Array.isArray(allCompanies)
    ? allCompanies.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // --- VIEW 1: Verified (Review Management Dashboard) ---
  if (user?.verificationStatus === 'verified') {
    if (loadingReviews)
      return <div className="loading-container">Loading Company Data...</div>;

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
                  <span className="rating-badge">
                    Rating: {review.rating}/5
                  </span>
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
                      Responded on{' '}
                      {new Date(
                        review.employerResponse.respondedAt
                      ).toLocaleDateString()}
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
  }

  // --- VIEW 2: Pending Approval ---
  if (user?.verificationStatus === 'pending') {
    return (
      <div className="employer-dashboard-container status-pending">
        <h2>Verification Pending</h2>
        <p>
          Your claim has been submitted and is currently awaiting manual review
          by a Job Jury administrator.
        </p>
        <p>
          Because your email domain did not automatically match the company
          record, this process may take up to 24-48 hours.
        </p>
      </div>
    );
  }

  // --- VIEW 3: Unverified / Rejected (Claim Form) ---
  return (
    <div className="employer-dashboard-container">
      <h2>Claim Your Company</h2>
      {user?.verificationStatus === 'rejected' && (
        <div className="alert-error">
          Your previous claim was rejected by an administrator. Please try
          again.
        </div>
      )}
      <p>Search the registry to link your employer account to your company.</p>

      <div className="claim-search-section">
        <input
          type="text"
          placeholder="Search by company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="employer-search-input"
        />

        <div className="claim-results-list">
          {searchQuery &&
            filteredCompanies.map((company) => (
              <div key={company._id} className="claim-card">
                <div className="claim-info">
                  <h4>{company.name}</h4>
                  <span>{company.website || 'No website listed'}</span>
                </div>
                <button
                  disabled={submittingClaim}
                  onClick={() => handleClaimSubmit(company._id)}
                  className="claim-btn"
                >
                  Claim
                </button>
              </div>
            ))}
          {searchQuery && filteredCompanies.length === 0 && (
            <p>
              No companies found. If your company is not listed, register it
              first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
