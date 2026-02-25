import React, { useState, useEffect } from 'react';
import { useFetcher } from '../../hooks/useFetcher.js';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  const checkUserAuth = async () => {
    try {
      const response = await fetcher('/api/users/me');

      console.log('Auth Provider RAW Response:', response);

      if (response.success) {
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
      // Hits your authController.logoutUser route
      const response = await fetcher('/api/auth/logout', { method: 'POST' });

      if (response.success) {
        setUser(null); // Wipe the user from global state
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    // Make sure 'logout' is added to the value object here
    <AuthContext.Provider value={{ user, setUser, loading, checkUserAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
