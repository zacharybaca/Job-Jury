import React, { useState, useEffect, useMemo } from 'react';
import { useFetcher } from '../../hooks/useFetcher.js';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  /**
   * DERIVED STATE: isUserAdmin
   */
  const isUserAdmin = useMemo(() => {
    return user?.isAdmin || user?.role === 'admin';
  }, [user]);

  /**
   * DERIVED STATE: isUserEmployer
   */
  const isUserEmployer = useMemo(() => {
    return user?.isEmployer || user?.role === 'employer';
  }, [user]);

  /**
   * Validates the session with the backend on mount.
   */
  const checkUserAuth = async () => {
    setLoading(true);
    try {
      const response = await fetcher('/api/users/me');

      if (response.success && response.data?.user) {
        if (response.data.user.isSuspended) {
          setUser(null);
          alert('Your account has been suspended. Please contact support for more information.');
          return;
        }
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
      await fetcher('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      // Execute clearance regardless of API success/failure
      setUser(null);
    }
  };

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
        isUserAdmin,
        isUserEmployer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
