import React, { useState, useEffect } from 'react';
import CompanyCard from '../CompanyCard/CompanyCard';
import SearchBar from '../../Utility/SearchBar/SearchBar';
import { useFetcher } from '../../../hooks/useFetcher.js';
import './company-grid.css';

const CompanyList = () => {
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const industries = [...new Set(companies.map((c) => c.industry))].sort();

  useEffect(() => {
    // 1. Create a promise that resolves after 1.5 seconds
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const loadData = async () => {
      setLocalLoading(true);

      try {
        // 2. Run both the delay and the API call
        // We use Promise.all to ensure the skeleton shows for AT LEAST 1.5s
        const [response] = await Promise.all([
          fetcher('/api/companies'),
          delay(1500),
        ]);

        if (response.success) {
          setCompanies(response.data.data);
          setLocalLoading(false);
        }
      } catch (error) {
        console.error('The Jury encountered an error:', error);
      } finally {
        // 3. This runs after the longest of the two (the API or the 1.5s)
        setLocalLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added fetcher to dependency array for best practice

  // 3. Search Filtering Logic
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesIndustry =
      filterIndustry === '' || company.industry === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <section className="company-list-wrapper">
      <div className="list-header">
        <h1 className="list-title">Explore the Jury's Verdicts</h1>
        <p className="list-subtitle">
          Search for employers and see what it's really like to work there.
        </p>

        {/* Integrated Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterIndustry={filterIndustry}
          setFilterIndustry={setFilterIndustry}
          industries={industries}
        />
      </div>
    <hr className="company-list-divider" />
      <div className="company-grid">
  {localLoading ? (
    /* Skeletons */
    [...Array(6)].map((_, index) => (
      <><div className="skeleton-image shimmer"></div><div className="skeleton-body">
        {/* Matches the company-name */}
        <div className="skeleton-title shimmer"></div>

        {/* Matches the company-meta */}
        <div className="skeleton-text shimmer"></div>

        {/* Matches the rating-container */}
        <div className="skeleton-rating shimmer"></div>

        {/* Matches the view-btn */}
        <div className="skeleton-button shimmer"></div>
      </div></>
    ))
  ) : filteredCompanies.length > 0 ? (
    /* Real Cards with Staggered Delay */
    filteredCompanies.map((company, index) => (
      <div
        key={company._id}
        className="staggered-card"
        style={{ '--index': index }} /* This is the "magic" variable */
      >
        <CompanyCard company={company} />
      </div>
    ))
  ) : (
    <div className="no-results-container">
      <p>No verdicts found.</p>
    </div>
  )}
</div>
    </section>
  );
};

export default CompanyList;
