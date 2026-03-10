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

      <div className="company-grid">
        {localLoading ? (
          // Display 6 skeletons while loading
          [...Array(6)].map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-pulse"></div>
            </div>
          ))
        ) : filteredCompanies.length > 0 ? (
          // Display the filtered results
          filteredCompanies.map((company) => (
            <CompanyCard key={company._id} company={company} />
          ))
        ) : (
          // Display empty state if search finds nothing
          <div className="no-results-container">
            <p className="no-results-text">
              No verdicts found for "<strong>{searchTerm}</strong>"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyList;
