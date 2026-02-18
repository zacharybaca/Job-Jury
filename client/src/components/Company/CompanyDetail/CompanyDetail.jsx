import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../../hooks/useFetcher';
import CompanyHeader from '../CompanyHeader/CompanyHeader';
import './company-detail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const getCompanyData = async () => {
      setIsLoaded(false);
      const response = await fetcher(`/api/companies/${id}`);
      if (response.success) {
        setCompany(response.data.data);
      }
      setIsLoaded(true);
    };

    getCompanyData();
  }, [id]);

  if (!isLoaded) {
    return <div className="detail-loading">Gathering the Jury's findings...</div>;
  }

  if (!company) {
    return <div className="detail-error">Company not found.</div>;
  }

  return (
    <main className="company-detail-page">
      {/* Reusing the Header we built! */}
      <CompanyHeader company={company} />

      <section className="reviews-section">
        <div className="section-container">
          <div className="reviews-header">
            <h2>Employee Reviews</h2>
            <button className="add-review-btn">Submit a Review</button>
          </div>

          {company.reviews && company.reviews.length > 0 ? (
            <div className="reviews-list">
              {company.reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-top">
                    <span className="review-rating">★ {review.rating}</span>
                    <span className="review-job">{review.jobTitle}</span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-reviews">
              <p>No reviews yet for {company.name}. Be the first to give a verdict!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CompanyDetail;
