import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';

const PendingClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  const loadClaims = async () => {
    setLoading(true);
    const response = await fetcher('/api/users/pending-claims');
    if (response.success) {
      // Target the nested array to match your fetcher architecture
      setClaims(response.data.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (userId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this claim?`)) return;

    const status = action === 'approve' ? 'verified' : 'rejected';
    const response = await fetcher(`/api/users/${userId}/claim-status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    if (response.success) {
      setClaims(claims.filter(claim => claim._id !== userId));
    } else {
      alert(response.error || `Failed to ${action} claim.`);
    }
  };

  if (loading) return <div className="admin-loading">Loading claims queue...</div>;

  // Fallback check to guarantee map executes on an array
  if (!Array.isArray(claims) || claims.length === 0) {
    return <div className="empty-state">No pending claims.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>User Email</th>
            <th>Target Company</th>
            <th>Company Domain</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim._id}>
              <td>{claim.email}</td>
              <td>{claim.managedCompany?.name || 'Unknown'}</td>
              <td>{claim.managedCompany?.website || 'N/A'}</td>
              <td className="admin-actions">
                <button className="approve-btn" onClick={() => handleAction(claim._id, 'approve')}>Verify</button>
                <button className="delete-btn" onClick={() => handleAction(claim._id, 'reject')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingClaims;
