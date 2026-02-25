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

    // Log this to see exactly where 'user' is hiding
    console.log("Auth Provider RAW Response:", response);

    if (response.success) {
      // If your fetcher wraps the backend JSON in a 'data' property:
      // Access response -> data (from fetcher) -> user (from backend)
      setUser(response.data.user);
    } else {
      setUser(null);
    }
  } catch (err) {
    console.error("Auth check failed:", err);
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
