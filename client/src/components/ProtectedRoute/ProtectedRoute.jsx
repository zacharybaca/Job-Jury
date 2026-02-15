import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Wrapper
 * @param {Object} props
 * @param {boolean} props.isAuthenticated - Passed from your Auth Context/State
 * @param {React.ReactNode} props.children - The component to render if auth'd
 */
const ProtectedRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the current location so we can
    // send them back after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
