import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  const loadCompanies = async () => {
    setLoading(true);
    const response = await fetcher('/api/companies');
    if (response.success) {
      // Accessing response.data (fetcher) -> data (controller array)
      setCompanies(response.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) {
      const response = await fetcher(`/api/companies/${id}`, { method: 'DELETE' });
      if (response.success) {
        // Optimistic UI update: remove from state without a full reload
        setCompanies(companies.filter(company => company._id !== id));
      } else {
        alert(response.error || "Failed to delete company.");
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Consulting the Jury's records...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage the companies currently listed in Job Jury.</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td>{company.name}</td>
                <td>{company.industry}</td>
                <td>{company.location}</td>
                <td className="admin-actions">
                  <button
                    className="view-btn"
                    onClick={() => window.open(`/companies/${company._id}`, '_blank')}
                  >
                    View
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(company._id, company.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
