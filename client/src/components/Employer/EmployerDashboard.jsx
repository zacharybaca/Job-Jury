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

  // --- Hybrid Verification Form State ---
  const [selectedCompanyToClaim, setSelectedCompanyToClaim] = useState(null);
  const [companyRole, setCompanyRole] = useState('');
  const [verificationDocument, setVerificationDocument] = useState('');

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
  const initiateClaimProcess = (company) => {
    setSelectedCompanyToClaim(company);
    setCompanyRole('');
    setVerificationDocument('');
  };

  const cancelClaimProcess = () => {
    setSelectedCompanyToClaim(null);
    setCompanyRole('');
    setVerificationDocument('');
  };

  const handleFinalClaimSubmit = async () => {
    if (!companyRole.trim()) {
      alert('Please enter your specific job title or role.');
      return;
    }

    setSubmittingClaim(true);
    const res = await fetcher('/api/users/claim-company', {
      method: 'POST',
      body: JSON.stringify({
        companyId: selectedCompanyToClaim._id,
        companyRole,
        verificationDocument,
      }),
    });

    if (res.success) {
      alert(
        res.data?.message || res.message || 'Claim submitted successfully.'
      );
      setSelectedCompanyToClaim(null);
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
          This administrative review is required to verify your authorization
          status to act on behalf of the company.
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
          Your previous claim was rejected by an administrator. Please provide
          accurate verification details.
        </div>
      )}

      {!selectedCompanyToClaim ? (
        <>
          <p>
            Search the registry to link your employer account to your company.
          </p>
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
                      onClick={() => initiateClaimProcess(company)}
                      className="claim-btn"
                    >
                      Select
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
        </>
      ) : (
        <div className="verification-form-container">
          <h3>Verify Employment Details</h3>
          <p>
            You are requesting access to manage:{' '}
            <strong>{selectedCompanyToClaim.name}</strong>
          </p>

          <div className="form-group">
            <label>Your Job Title / Role</label>
            <input
              type="text"
              value={companyRole}
              onChange={(e) => setCompanyRole(e.target.value)}
              placeholder="e.g., HR Director, Operations Manager"
              className="employer-form-input"
            />
            <small>Must match your official title.</small>
          </div>

          <div className="form-group">
            <label>Verification Link (Optional, but highly recommended)</label>
            <input
              type="text"
              value={verificationDocument}
              onChange={(e) => setVerificationDocument(e.target.value)}
              placeholder="e.g., LinkedIn Profile URL or company directory link"
              className="employer-form-input"
            />
            <small>
              If your email does not utilize an HR or Admin prefix, a link
              verifying your employment is required for approval.
            </small>
          </div>

          <div className="verification-form-actions">
            <button
              className="btn-submit"
              onClick={handleFinalClaimSubmit}
              disabled={submittingClaim}
            >
              {submittingClaim ? 'Submitting...' : 'Submit Claim Request'}
            </button>
            <button
              className="btn-cancel"
              onClick={cancelClaimProcess}
              disabled={submittingClaim}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
