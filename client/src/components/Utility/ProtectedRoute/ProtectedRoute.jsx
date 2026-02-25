import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';

/**
 * ProtectedRoute Wrapper
 * Uses global AuthContext to determine access.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for the AuthProvider to finish its check-auth API call
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-jury-navy">
        Gathering the Jury's findings...
      </div>
    );
  }

  // 2. If no user is found after loading, redirect to login
  if (!user) {
    // Save the current location so we can redirect them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
