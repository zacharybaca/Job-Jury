import React, { useState, useEffect } from 'react';
import CompanyCard from '../CompanyCard/CompanyCard';
import SearchBar from '../SearchBar/SearchBar';
import { useFetcher } from '../../hooks/useFetcher';
import './company-list.css';

const CompanyList = () => {
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Mock Data for Design Testing
  const mockCompanies = [
    {
      _id: "1",
      name: "Surf Internet",
      industry: "Telecommunications",
      location: "La Porte, IN",
      imageUrl: "https://via.placeholder.com/350x180?text=Surf+Internet",
      averageRating: 4.8
    },
    {
      _id: "2",
      name: "Tech Solutions",
      industry: "Software Engineering",
      location: "Chicago, IL",
      imageUrl: "https://via.placeholder.com/350x180?text=Tech+Solutions",
      averageRating: 3.5
    },
    {
      _id: "3",
      name: "Medi-Care Group",
      industry: "Healthcare",
      location: "Michigan City, IN",
      imageUrl: "https://via.placeholder.com/350x180?text=Medi-Care",
      averageRating: 4.2
    },
    {
      _id: "4",
      name: "Global Logistics",
      industry: "Supply Chain",
      location: "Indianapolis, IN",
      imageUrl: "https://via.placeholder.com/350x180?text=Global+Logistics",
      averageRating: 2.9
    }
  ];

  // 2. Data Loading Logic
  useEffect(() => {
    const loadData = async () => {
      setIsLoaded(false);
      // Simulating a network delay so you can see the Skeleton Loader in action
      setTimeout(() => {
        setCompanies(mockCompanies);
        setIsLoaded(true);
      }, 1500);

      /* // UNCOMMENT THIS for real API connection later:
      const response = await fetcher('/api/companies');
      if (response.success) {
        setCompanies(response.data.data);
      }
      setIsLoaded(true);
      */
    };

    loadData();
  }, []);

  // 3. Search Filtering Logic
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="company-list-wrapper">
      <div className="list-header">
        <h1 className="list-title">Explore the Jury's Verdicts</h1>
        <p className="list-subtitle">Search for employers and see what it's really like to work there.</p>

        {/* Integrated Search Bar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="company-grid">
        {!isLoaded ? (
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
            <p className="no-results-text">No verdicts found for "<strong>{searchTerm}</strong>"</p>
            <button onClick={() => setSearchTerm('')} className="clear-search-btn">
              Clear Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyList;
