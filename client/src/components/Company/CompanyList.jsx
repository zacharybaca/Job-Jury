import React from 'react';
import CompanyCard from '../CompanyCard/CompanyCard'; // Ensure this path matches your folder structure
import './company-grid.css';

const CompanyList = () => {
  // Mock Data for Design & Layout Testing
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

  return (
    <section className="company-list-wrapper">
      <div className="list-header">
        <h2 className="list-title">Explore the Jury's Verdicts</h2>
        <p className="list-subtitle">Browse companies by their real-world employee ratings.</p>
      </div>

      {/* The responsive grid container */}
      <div className="company-grid">
        {mockCompanies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>
    </section>
  );
};

export default CompanyList;
