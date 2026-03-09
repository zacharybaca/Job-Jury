import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import CompanyCard from '../../Company/CompanyCard/CompanyCard';
import './featured-companies.css';

const FeaturedCompanies = () => {
  const [featured, setFeatured] = useState([]);
  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetchTop = async () => {
      const response = await fetcher('/api/companies/top');
      if (response.success) {
        setFeatured(response.data.data);
      }
    };
    fetchTop();
  }, [fetcher]);

  if (featured.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-badge">Top Picks</div>
      <h2 className="featured-title">Highest Rated by the Jury</h2>
      <div className="featured-grid">
        {featured.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCompanies;
