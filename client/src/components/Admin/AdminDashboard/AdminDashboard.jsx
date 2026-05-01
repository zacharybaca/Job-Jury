import React, { useState } from 'react';
import PendingCompanies from './PendingCompanies';
import UserManagement from './UserManagement';
import ReviewApprovals from './ReviewApprovals';
import AdminCreateUser from './AdminCreateUser'; // Imported new component
import './admin-dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Control Center</h1>
        <p>Manage platform content and administrative privileges.</p>
      </header>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          Company Registry
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'create-user' ? 'active' : ''}`}
          onClick={() => setActiveTab('create-user')}
        >
          Create User
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Review Approvals
        </button>
      </div>

      <div className="tab-content-area">
        {activeTab === 'companies' && <PendingCompanies />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'create-user' && <AdminCreateUser />}
        {activeTab === 'reviews' && <ReviewApprovals />}
      </div>
    </div>
  );
};

export default AdminDashboard;
