import React, { useState, useEffect } from 'react';
import { useFetcher } from '../../hooks/useFetcher.js';
import { SavedCompaniesContext } from './SavedCompaniesContext.jsx';

export const SavedCompaniesProvider = ({ children }) => {
  const [savedCompanies, setSavedCompanies] = useState([]);
  const { fetcher } = useFetcher();

  const fetchSavedCompanies = async () => {
    try {
      const response = await fetcher('/api/users/profile');

      if (response.status === 401) {
        setSavedCompanies([]); // User is not logged in, clear saved companies
        return;
      } else if (response.success) {
        // Set saved companies from the nested data property
        setSavedCompanies(response.data.savedCompanies);
      }
    } catch (error) {
      console.error('Error fetching saved companies:', error);
    }
  };

  useEffect(() => {
    fetchSavedCompanies();
  }, []);

  return (
    <SavedCompaniesContext.Provider
      value={{ savedCompanies, setSavedCompanies, fetchSavedCompanies }}
    >
      {children}
    </SavedCompaniesContext.Provider>
  );
};
