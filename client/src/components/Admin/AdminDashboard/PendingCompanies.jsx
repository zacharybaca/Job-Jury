import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetcher } from '../../../hooks/useFetcher';

const PendingCompanies = ({ onUpdate }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();
  const navigate = useNavigate();

  const loadCompanies = async () => {
    setLoading(true);
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
        setCompanies(
          companies.map((company) =>
            company._id === id ? { ...company, isApproved: true } : company
          )
        );
        if (onUpdate) onUpdate(); // Trigger sibling refresh
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
        if (onUpdate) onUpdate(); // Trigger sibling refresh
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
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Company Name</th>
            <th>Industry</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td className="logo-cell">
                {company.imageUrl ? (
                  <img
                    src={company.imageUrl}
                    alt={`${company.name} logo`}
                    className="admin-company-thumbnail"
                  />
                ) : (
                  <div className="admin-no-image">N/A</div>
                )}
              </td>
              <td>{company.name}</td>
              <td>{company.industry}</td>
              <td>{company.location}</td>
              <td>
                <span
                  className={`status-badge ${company.isApproved ? 'approved' : 'pending'}`}
                >
                  {company.isApproved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td className="admin-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/companies/${company._id}`)}
                >
                  View
                </button>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(company._id, company.name)}
                >
                  Approve
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
  );
};

export default PendingCompanies;
