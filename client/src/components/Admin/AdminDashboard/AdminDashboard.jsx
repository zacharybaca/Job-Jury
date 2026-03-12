import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  const loadCompanies = async () => {
    setLoading(true);
    // 1. UPDATE: Fetch from the admin-only route to see pending companies
    const response = await fetcher('/api/companies/all-admin');
    if (response.success) {
      setCompanies(response.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. NEW: Function to handle approvals
  const handleApprove = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to approve ${name} for public listing?`
      )
    ) {
      const response = await fetcher(`/api/companies/${id}/approve`, {
        method: 'PATCH',
      });

      if (response.success) {
        // Optimistic UI update: Flip the isApproved status without reloading the page
        setCompanies(
          companies.map((company) =>
            company._id === id ? { ...company, isApproved: true } : company
          )
        );
      } else {
        alert(response.error || 'Failed to approve company.');
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${name}? This action cannot be undone.`
      )
    ) {
      const response = await fetcher(`/api/companies/${id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        setCompanies(companies.filter((company) => company._id !== id));
      } else {
        alert(response.error || 'Failed to delete company.');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">Consulting the Jury's records...</div>
    );
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
              {/* 3. NEW: Status Header */}
              <th>Status</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td>{company.name}</td>

                {/* 4. NEW: Status Badge */}
                <td>
                  <span
                    className={`status-badge ${company.isApproved ? 'approved' : 'pending'}`}
                  >
                    {company.isApproved ? 'Active' : 'Pending'}
                  </span>
                </td>

                <td>{company.industry}</td>
                <td>{company.location}</td>
                <td className="admin-actions">
                  {/* 5. NEW: Conditionally render the Approve button */}
                  {!company.isApproved && (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(company._id, company.name)}
                    >
                      Approve
                    </button>
                  )}

                  <button
                    className="view-btn"
                    onClick={() =>
                      window.open(`/companies/${company._id}`, '_blank')
                    }
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
