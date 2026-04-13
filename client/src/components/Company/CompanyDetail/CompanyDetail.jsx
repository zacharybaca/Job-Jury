import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher';
import { useAuth } from '../../../hooks/useAuth.js';
import { useSavedCompanies } from '../../../hooks/useSavedCompanies.js';
import CompanyHeader from '../CompanyHeader/CompanyHeader';
import ReviewForm from '../../Review/ReviewForm/ReviewForm';
import ReviewList from '../../Review/ReviewList/ReviewList';
import JudgeAnalyticsSection from '../../Utility/EvidenceLocker/JudgeAnalyticsSection';
import LeakAnalyticsSection from '../../Utility/LeakSubmissionForm/LeakAnalyticsSection';
import LeakSubmissionForm from '../../Utility/LeakSubmissionForm/LeakSubmissionForm';
import './company-detail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { fetcher } = useFetcher();
  const { user, loading: authLoading } = useAuth();
  const { savedCompanies, fetchSavedCompanies } = useSavedCompanies();

  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showLeakForm, setShowLeakForm] = useState(false);

  const getCompanyData = useCallback(async () => {
    setCompanyLoading(true);
    const response = await fetcher(`/api/companies/${id}`);

    if (response.success) {
      const companyData = response.data?.data || response.data;
      setCompany(companyData);
    } else {
      console.error('API Error:', response.error);
    }
    setCompanyLoading(false);
  }, [id, fetcher]);

  useEffect(() => {
    getCompanyData();
  }, [getCompanyData]);

  const handleReviewAdded = () => {
    getCompanyData();
    setShowForm(false);
  };

  const handleToggleSave = async () => {
    if (!user) return alert('Please log in to save companies.');
    const response = await fetcher(`/api/users/save/${id}`, { method: 'POST' });
    if (response.success) {
      await fetchSavedCompanies();
    }
  };

  const isSaved = savedCompanies?.some((saved) => {
    const savedId = typeof saved === 'string' ? saved : saved._id;
    return savedId === company?._id;
  });

  if (authLoading) {
    return (
      <div className="loading-container">
        Verifying credentials with the Jury...
      </div>
    );
  }

  if (companyLoading) {
    return (
      <div className="loading-container">
        Gathering the Jury's findings on this company...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="error-container">
        Company not found in the Jury's records.
      </div>
    );
  }

  return (
    <main className="company-detail-page">
      <CompanyHeader company={company} />
      <section className="header-section text-center mb-5">
        <h2 className="fw-bold mb-3">Company Analytics</h2>
        <p className="text-muted mb-4">
          Dive into the Jury's analysis of this company's interview performance
          and employee feedback.
        </p>
      </section>
      {/* Unified Analytics Dashboard */}
      <div className="analytics-container">
        <section className="section-container analytics-dashboard">
          <div className="analytics-grid">
            <section className="judge-analytics-container">
              <JudgeAnalyticsSection companyId={id} />
            </section>
            <section className="leak-analytics-container">
              <LeakAnalyticsSection companyId={id} />
            </section>
          </div>
        </section>
        {/* Qualitative Reviews Section */}
        <section className="section-container reviews-section">
          <div className="reviews-header">
            <h2>Employee Reviews</h2>
            <div className="action-buttons">
              {user && (
                <>
                  <button
                    className="add-review-btn"
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? 'Cancel Review' : 'Submit a Review'}
                  </button>
                  <button
                    className="add-leak-btn"
                    onClick={() => setShowLeakForm(!showLeakForm)}
                  >
                    {showLeakForm ? 'Cancel Leak' : 'Add Leak'}
                  </button>
                </>
              )}
            </div>
          </div>

          {showForm && (
            <div className="form-wrapper">
              <ReviewForm companyId={id} onReviewAdded={handleReviewAdded} />
            </div>
          )}

          {showLeakForm && (
            <div className="form-wrapper">
              <LeakSubmissionForm companyId={id} companyName={company.name} />
            </div>
          )}

          <div className="verdict-list-container">
            <ReviewList reviews={company.reviews} />
          </div>

          {user && (
            <div className="button-container">
              <button
                className="add-favorite-btn"
                onClick={() => handleToggleSave()}
              >
                {isSaved ? 'Remove From Favorites' : 'Add To Favorites'}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CompanyDetail;
