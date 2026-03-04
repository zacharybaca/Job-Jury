import React, { useState, useEffect, useMemo } from 'react';
import { useFetcher } from '../../hooks/useFetcher.js';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  /**
   * DERIVED STATE: isUserAdmin
   * Using useMemo ensures this value is re-calculated immediately
   * whenever the 'user' object changes (e.g., after login or checkUserAuth).
   */
  const isUserAdmin = useMemo(() => {
    return user?.isAdmin || user?.role === 'admin';
  }, [user]);

  /**
   * Validates the session with the backend on mount.
   */
  const checkUserAuth = async () => {
    setLoading(true); // Ensure loading is true while checking
    try {
      const response = await fetcher('/api/users/me');

      // Based on your controller structure: response.data.user
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Triggers the backend logout and resets local user state.
   */
  const logout = async () => {
    try {
      const response = await fetcher('/api/auth/logout', { method: 'POST' });

      if (response.success) {
        setUser(null); // This will automatically set isUserAdmin to false
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Run the auth check once when the provider mounts
  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkUserAuth,
        logout,
        isUserAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
