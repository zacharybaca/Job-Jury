import React, { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import './admin-dashboard.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  const loadUsers = async () => {
    setLoading(true);
    const response = await fetcher('/api/users');
    if (response.success) {
      setUsers(response.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePromote = async (id, username) => {
    if (
      window.confirm(
        `Are you sure you want to grant Admin privileges to ${username}?`
      )
    ) {
      const response = await fetcher(`/api/users/${id}/admin`, {
        method: 'PATCH',
      });

      if (response.success) {
        // Optimistic UI update: Flip the isAdmin status without reloading
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, isAdmin: true } : user
          )
        );
      } else {
        alert(response.error || 'Failed to promote user.');
      }
    }
  };

  const handleDemote = async (id, username) => {
    if (
      window.confirm(
        `Are you sure you want to revoke Admin privileges from ${username}?`
      )
    ) {
      const response = await fetcher(`/api/users/${id}/demote`, {
        method: 'PATCH',
      });

      if (response.success) {
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, isAdmin: false } : user
          )
        );
      } else {
        alert(response.error || 'Failed to demote user.');
      }
    }
  };

  const handleUpdateSubscription = async (id, currentTier) => {

    if (newTier && newTier !== currentTier) {
      const response = await fetcher('/api/users/subscription', {
        method: 'PATCH',
        body: JSON.stringify({ subscriptionTier: newTier }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.success) {
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, subscriptionTier: newTier } : user
          )
        );
      } else {
        alert(response.error || 'Failed to update subscription tier.');
      }
    }
  };

  const formatName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  };

  if (loading) {
    return <div className="admin-loading">Loading user database...</div>;
  }

  return (
    <div className="admin-container">
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Subscription Tier</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0f172a',
                          fontWeight: 'bold',
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>{formatName(user.name)}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.subscriptionTier[0].toUpperCase() + user.subscriptionTier.slice(1)}
                      onChange={() => handleUpdateSubscription(user._id, user.subscriptionTier)}
                    >
                      <option value={user.subscriptionTier}>{user.subscriptionTier[0].toUpperCase() + user.subscriptionTier.slice(1)}</option>
                      <option value="free">Free</option>
                      <option value="juror">Juror</option>
                      <option value="judge">Judge</option>
                      <option value="firm">Firm</option>
                    </select>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${user.isAdmin ? 'approved' : 'pending'}`}
                    >
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    {!user.isAdmin ? (
                      <button
                        className="approve-btn"
                        onClick={() => handlePromote(user._id, user.username)}
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        className="delete-btn"
                        onClick={() => handleDemote(user._id, user.username)}
                      >
                        Demote
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
