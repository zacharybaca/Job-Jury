import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../hooks/useFetcher';
import CompanyCard from '../Company/CompanyCard/CompanyCard';
import './dashboard.css';

const Dashboard = () => {
  const { fetcher, isLoaded, setIsLoaded } = useFetcher();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      setIsLoaded(false);
      const response = await fetcher('/api/users/profile');
      if (response.success) {
        setUser(response.data);
      }
      setIsLoaded(true);
    };
    getProfile();
  }, []);

  if (!isLoaded)
    return <div className="loading">Loading your jury profile...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <h1>Welcome, {user?.username}</h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <div className="user-stats">
          <div className="stat-box">
            <span className="stat-number">
              {user?.savedCompanies?.length || 0}
            </span>
            <span className="stat-label">Saved Companies</span>
          </div>
        </div>
      </header>

      <section className="saved-companies-section">
        <h2>Your Saved Verdicts</h2>
        {user?.savedCompanies?.length > 0 ? (
          <div className="company-grid">
            {user.savedCompanies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        ) : (
          <div className="empty-dashboard">
            <p>You haven't saved any companies yet.</p>
            <button
              className="browse-btn"
              onClick={() => (window.location.href = '/')}
            >
              Browse Companies
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
