import React, { useEffect, useState } from 'react';
import CompanyCard from '../CompanyCard/CompanyCard';
import { useFetcher } from '../../../hooks/useFetcher';
import './company-grid.css';

const CompanyList = () => {
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [companies, setCompanies] = useState([]);

  // Mock data for when you want to see the "final" look
  const mockCompanies = [
    { _id: "1", name: "Surf Internet", industry: "Telecom", location: "La Porte, IN", averageRating: 4.8 },
    { _id: "2", name: "Tech Solutions", industry: "Software", location: "Chicago, IL", averageRating: 3.5 },
    { _id: "3", name: "Medi-Care", industry: "Healthcare", location: "Michigan City, IN", averageRating: 4.2 }
  ];

  useEffect(() => {
    // Simulated fetch call (Replace with real API call later)
    const loadData = async () => {
      setIsLoaded(false);
      // Simulate network delay
      setTimeout(() => {
        setCompanies(mockCompanies);
        setIsLoaded(true);
      }, 2000);
    };

    loadData();
  }, []);

  return (
    <section className="company-list-wrapper">
      <div className="list-header">
        <h2 className="list-title">Explore the Jury's Verdicts</h2>
      </div>

      <div className="company-grid">
        {!isLoaded ? (
          // Display 6 skeleton cards while loading
          [...Array(6)].map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-pulse"></div>
            </div>
          ))
        ) : (
          // Display the real (or mock) cards
          companies.map((company) => (
            <CompanyCard key={company._id} company={company} />
          ))
        )}
      </div>
    </section>
  );
};

export default CompanyList;
