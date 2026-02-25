import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher';
import { useAuth } from '../../../hooks/useAuth.js';
import CompanyHeader from '../CompanyHeader/CompanyHeader';
import ReviewForm from '../../Review/ReviewForm/ReviewForm';
import ReviewList from '../../Review/ReviewList/ReviewList';
import SaveButton from '../../Utility/SaveButton/SaveButton';
import './company-detail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { fetcher } = useFetcher();
  const { user, loading: authLoading } = useAuth();

  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const getCompanyData = async () => {
    setCompanyLoading(true);
    const response = await fetcher(`/api/companies/${id}`);

    if (response.success) {
      // Handles the double-nesting: fetcher.data -> controller.data
      setCompany(response.data.data);
    } else {
      console.error('API Error:', response.message);
    }
    setCompanyLoading(false);
  };

  useEffect(() => {
    getCompanyData();
  }, [id]);

  const handleReviewAdded = () => {
    getCompanyData();
    setShowForm(false);
  };

  const handleToggleSave = async () => {
    if (!user) return alert('Please log in to save companies.');

    const response = await fetcher(`/api/users/save/${id}`, {
      method: 'POST',
    });

    if (response.success) {
      alert('Company save status updated!');
    }
  };

  // Wait for both the initial auth check and company data fetch
  if (authLoading || companyLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-jury-navy">
        Gathering the Jury's findings...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-20 text-red-600 font-bold">
        Company not found in the Jury's records.
      </div>
    );
  }

  return (
    <main className="company-detail-page">
      <CompanyHeader company={company} />

      <section className="section-container">
        <div className="reviews-header">
          <h2>Employee Reviews</h2>
          {user && (
            <button
              className="add-review-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Submit a Review'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-wrapper">
            <ReviewForm companyId={id} onReviewAdded={handleReviewAdded} />
          </div>
        )}

        <div className="verdict-list-container">
          <ReviewList reviews={company.reviews} />
        </div>

        {user && (
          <div className="button-container">
            <SaveButton onSave={handleToggleSave} />
          </div>
        )}
      </section>
    </main>
  );
};

export default CompanyDetail;
