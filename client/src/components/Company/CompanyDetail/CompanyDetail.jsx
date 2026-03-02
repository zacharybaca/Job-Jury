import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher';
import { useAuth } from '../../../hooks/useAuth.js';
import { useSavedCompanies } from '../../../hooks/useSavedCompanies.js';
import CompanyHeader from '../CompanyHeader/CompanyHeader';
import ReviewForm from '../../Review/ReviewForm/ReviewForm';
import ReviewList from '../../Review/ReviewList/ReviewList';
import SaveButton from '../../Utility/SaveButton/SaveButton';
import './company-detail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { fetcher } = useFetcher();
  const { user, loading: authLoading } = useAuth();
  const { savedCompanies, fetchSavedCompanies } = useSavedCompanies();

  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const getCompanyData = useCallback(async () => {
    setCompanyLoading(true);
    const response = await fetcher(`/api/companies/${id}`);

    if (response.success) {
      // Accessing response.data (from fetcher) -> data (from controller)
      setCompany(response.data.data);
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

    const response = await fetcher(`/api/users/save/${id}`, {
      method: 'POST',
    });

    if (response.success) {
      // CRITICAL: Refresh the global saved companies list so the button updates
      await fetchSavedCompanies();
    } else {
      console.error('Save toggle failed:', response.error);
    }
  };

  // Check if the current company is in the saved list
  // We use .some() in case savedCompanies contains full objects or just IDs
  const isSaved = savedCompanies?.some((saved) => {
    const savedId = typeof saved === 'string' ? saved : saved._id;
    return savedId === company?._id;
  });

  // Wait for both auth and company data to load
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

        {/* CLEANED LOGIC:
          If user is logged in, show the SaveButton.
          The title is determined by the 'isSaved' boolean.
        */}
        {user && (
          <div className="button-container">
            <SaveButton
              onSave={handleToggleSave}
              title={isSaved ? "Remove From Favorites" : "Add To Favorites"}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default CompanyDetail;
