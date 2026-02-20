import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher';
import CompanyHeader from '../CompanyHeader/CompanyHeader';
import ReviewForm from '../../Review/ReviewForm/ReviewForm';
import ReviewList from '../../Review/ReviewList/ReviewList';
import './company-detail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [company, setCompany] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle for the review form

  // 1. Mock Data for Design Testing
  const mockCompanies = [
    {
      _id: '1',
      name: 'Surf Internet',
      industry: 'Telecommunications',
      location: 'La Porte, IN',
      imageUrl:
        'https://surfinternet.com/wp-content/uploads/sites/10/2022/06/surf-internet-logo-lt.png',
      averageRating: 4.8,
    },
    {
      _id: '2',
      name: 'Tech Solutions',
      industry: 'Software Engineering',
      location: 'Chicago, IL',
      imageUrl: 'https://chicagotechsolution.com/assets/images/logo.png',
      averageRating: 3.5,
    },
    {
      _id: '3',
      name: 'Medi-Care Group',
      industry: 'Healthcare',
      location: 'Michigan City, IN',
      imageUrl:
        'https://medicareagentshub.com/images/the-medicare-agent-directory-logo.png',
      averageRating: 4.2,
    },
    {
      _id: '4',
      name: 'Global Logistics',
      industry: 'Supply Chain',
      location: 'Indianapolis, IN',
      imageUrl:
        'https://www.echo.com/wp-content/themes/ws/assets/logos/Echo_Logo_RGB.svg',
      averageRating: 2.9,
    },
  ];

  const getCompanyData = async () => {
    const response = await fetcher(`/api/companies/${id}`);
    if (response.success) {
      setCompany(response.data);
    } else {
      // 2. FALLBACK: If API fails, find the company in your hardcoded list
      const localMatch = mockCompanies.find(c => c._id === id);
      setCompany(localMatch);
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
    return (
      <div className="detail-loading">Gathering the Jury's findings...</div>
    );
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
              <ReviewForm companyId={id} onReviewAdded={handleReviewAdded} />
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
