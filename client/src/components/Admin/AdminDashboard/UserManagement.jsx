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

  if (loading) {
    return <div className="admin-loading">Loading user database...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>User Management</h1>
        <p>View registered users and manage administrative privileges.</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Username</th>
              <th>Email</th>
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
                  <td>{user.username}</td>
                  <td>{user.email}</td>
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
                  colSpan="5"
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
