import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../../hooks/useFetcher';
import CompanyHeader from '../CompanyHeader/CompanyHeader';
import ReviewForm from '../ReviewForm/ReviewForm';
import ReviewList from '../ReviewList/ReviewList';
import './company-detail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [company, setCompany] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle for the review form

  const getCompanyData = async () => {
    const response = await fetcher(`/api/companies/${id}`);
    if (response.success) {
      setCompany(response.data.data);
    }
  };

  useEffect(() => {
    setIsLoaded(false);
    getCompanyData().then(() => setIsLoaded(true));
  }, [id]);

  // This function updates the UI instantly when a new review is posted
  const handleReviewAdded = () => {
    getCompanyData(); // Re-fetch data to get the new averageRating and review list
    setShowForm(false); // Hide the form after success
  };

  if (!isLoaded) {
    return <div className="detail-loading">Gathering the Jury's findings...</div>;
  }

  if (!company) {
    return <div className="detail-error">Company not found.</div>;
  }

  return (
    <main className="company-detail-page">
      <CompanyHeader company={company} />

      <section className="reviews-section">
        <div className="section-container">

          <div className="reviews-header">
            <h2>Employee Reviews</h2>
            <button
              className="add-review-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Submit a Review'}
            </button>
          </div>

          {/* VERDICT SECTION START */}
          {showForm && (
            <div className="form-wrapper">
              <ReviewForm
                companyId={id}
                onReviewAdded={handleReviewAdded}
              />
            </div>
          )}

          <div className="verdict-list-container">
            <ReviewList reviews={company.reviews} />
          </div>
          {/* VERDICT SECTION END */}

        </div>
      </section>
    </main>
  );
};

export default CompanyDetail;
