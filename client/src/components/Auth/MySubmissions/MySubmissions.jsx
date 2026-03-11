import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import { Link } from 'react-router-dom';
import './my-submissions.css';

const MySubmissions = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetchMyCompanies = async () => {
      const response = await fetcher('/api/companies/my-submissions');
      if (response.success) {
        setCompanies(response.data.data);
      }
      setLoading(false);
    };

    fetchMyCompanies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="submissions-loading">Retrieving your submissions...</div>;
  }

  return (
    <div className="submissions-container">
      <header className="submissions-header">
        <h2>My Submitted Companies</h2>
        <p>Track the approval status of the employers you've brought to the Jury.</p>
      </header>

      {companies.length === 0 ? (
        <div className="no-submissions">
          <p>You haven't submitted any companies yet.</p>
          <Link to="/register-company" className="btn-primary">Submit a Company</Link>
        </div>
      ) : (
        <div className="submissions-grid">
          {companies.map((company) => (
            <div key={company._id} className="submission-card">
              <div className="card-header">
                <h3>{company.name}</h3>
                <span className={`status-badge ${company.isApproved ? 'approved' : 'pending'}`}>
                  {company.isApproved ? 'Approved' : 'Pending Review'}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Industry:</strong> {company.industry}</p>
                <p><strong>Location:</strong> {company.location}</p>
              </div>
              <div className="card-footer">
                {company.isApproved ? (
                  <Link to={`/companies/${company._id}`} className="view-link">View Public Page</Link>
                ) : (
                  <span className="pending-note">Awaiting Admin Approval</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
