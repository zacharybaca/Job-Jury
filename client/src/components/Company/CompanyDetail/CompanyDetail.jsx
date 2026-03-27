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
  const { user, loading: authLoading, isUserAdmin } = useAuth();
  const { savedCompanies, fetchSavedCompanies } = useSavedCompanies();

  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const getCompanyData = useCallback(async () => {
    setCompanyLoading(true);
    const response = await fetcher(`/api/companies/${id}`);

    if (response.success) {
      // Handle both nested and flat response structures
      const companyData = response.data?.data || response.data;
      console.log('Fetched Company Data:', companyData); // Debugging line
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

  // 1. STRICT AUTH GUARD: Wait for AuthProvider to finish background checks
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-jury-navy">
        Verifying credentials with the Jury...
      </div>
    );
  }

  // 2. DATA GUARD: Wait for the specific company data
  if (companyLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-jury-navy">
        Gathering the Jury's findings on this company...
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
            <SaveButton
              onSave={handleToggleSave}
              title={isSaved ? 'Remove From Favorites' : 'Add To Favorites'}
              classTitle="add-fav-btn"
            />
          </div>
        )}

        {/* ADMIN SECTION: This will now update instantly because of the Login.jsx changes */}
        {user && isUserAdmin && (
          <div className="button-container">
            <SaveButton
              onSave={() => alert('Admin remove functionality coming soon!')}
              title="Remove Company From List"
              classTitle="admin-remove-btn"
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default CompanyDetail;
