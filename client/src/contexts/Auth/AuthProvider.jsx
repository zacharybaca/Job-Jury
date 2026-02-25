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
      if (response.success) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
