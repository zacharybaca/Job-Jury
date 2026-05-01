import React, { useState } from 'react';
import PendingCompanies from './PendingCompanies';
import UserManagement from './UserManagement';
import ReviewApprovals from './ReviewApprovals';
import AdminCreateUser from './AdminCreateUser';
import PendingClaims from './PendingClaims'; // NEW IMPORT
import './admin-dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

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
          className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`} // NEW TAB
          onClick={() => setActiveTab('claims')}
        >
          Employer Claims
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
        {activeTab === 'companies' && (
          <div className="companies-tab-wrapper">
            <section className="admin-section">
              <h2>Pending Approvals</h2>
              <PendingCompanies onUpdate={triggerRefresh} />
            </section>
          </div>
        )}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'claims' && <PendingClaims />} {/* NEW VIEW */}
        {activeTab === 'create-user' && <AdminCreateUser />}
        {activeTab === 'reviews' && <ReviewApprovals />}
      </div>
    </div>
  );
};

export default AdminDashboard;
