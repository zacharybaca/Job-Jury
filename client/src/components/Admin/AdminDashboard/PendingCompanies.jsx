import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
// No need to import CSS here if it's imported in the parent AdminDashboard

const PendingCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

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

  // Notice we stripped the <header> out, returning just the table!
  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Company Name</th>
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
  );
};

export default PendingCompanies;
