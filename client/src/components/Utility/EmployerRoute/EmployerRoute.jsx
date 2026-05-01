import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const EmployerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Verifying credentials...</div>;
  }

  return user && user.isEmployer ? <Outlet /> : <Navigate to="/" replace />;
};

export default EmployerRoute;
