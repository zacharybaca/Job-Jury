import React, { useState } from 'react';
import PendingCompanies from './PendingCompanies';
import UserManagement from './UserManagement';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Control Center</h1>
        <p>Manage platform content and administrative privileges.</p>
      </header>

      {/* The Tab Navigation Bar */}
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
      </div>

      {/* The Tab Content */}
      <div className="tab-content-area">
        {activeTab === 'companies' && <PendingCompanies />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
