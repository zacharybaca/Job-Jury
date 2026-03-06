import React from 'react';
import FeaturedCompanies from '../../Company/FeaturedCompanies/FeaturedCompanies';
import CompanyList from '../../Company/CompanyList/CompanyList';

const Home = () => {
  return (
    <div className="home-page">
      {/* The special "Top Rated" section */}
      <FeaturedCompanies />

      {/* The main searchable/filterable list */}
      <div className="all-companies-section">
        <h2 className="section-title">All Jury Records</h2>
        <CompanyList />
      </div>
    </div>
  );
};

export default Home;
