import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher';
import CompanyHeader from '../CompanyHeader/CompanyHeader';
import ReviewForm from '../../Review/ReviewForm/ReviewForm';
import ReviewList from '../../Review/ReviewList/ReviewList';
import SaveButton from '../../Utility/SaveButton/SaveButton';
import './company-detail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [company, setCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const getCompanyData = async () => {
    // Ensure the loader shows while fetching
    setIsLoaded(false);
    const response = await fetcher(`/api/companies/${id}`);

    if (response.success) {
      setCompany(response.data.data);
    } else {
      console.error('API Error:', response.message);
      setCompany(null);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    getCompanyData();
  }, [id]);

  const handleReviewAdded = () => {
    getCompanyData();
    setShowForm(false);
  };

  const handleToggleSave = async () => {
    // This calls your backend route rather than the raw function
    const response = await fetcher(`/api/users/save/${id}`, {
      method: 'POST'
    });

    if (response.success) {
      alert('Company save status updated!');
      // Optional: Update local state to show the button as "Saved"
    } else {
      console.error('Failed to save company:', response.message);
    }
  };

  if (!isLoaded) {
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
          <button
            className="add-review-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Submit a Review'}
          </button>
        </div>

        {showForm && (
          <div className="form-wrapper">
            <ReviewForm companyId={id} onReviewAdded={handleReviewAdded} />
          </div>
        )}

        <div className="verdict-list-container">
          <ReviewList reviews={company.reviews} />
        </div>

        <div className="button-container">
          <SaveButton onSave={handleToggleSave}/>
        </div>
      </section>
    </main>
  );
};

export default CompanyDetail;
