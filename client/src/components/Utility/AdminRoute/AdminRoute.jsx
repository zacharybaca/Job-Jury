import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';

const AdminRoute = () => {
  const { user, isUserAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Verifying Admin Credentials...
      </div>
    );
  }

  // Check both: logged in AND isUserAdmin
  if (!user || !isUserAdmin) {
    // Redirect unauthorized users to home, but save their location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If they pass the test, render the child routes (Outlet)
  return <Outlet />;
};

export default AdminRoute;
