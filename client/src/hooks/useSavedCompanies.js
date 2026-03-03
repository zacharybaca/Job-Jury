import { useContext } from 'react';
import { SavedCompaniesContext } from '../contexts/SavedCompanies/SavedCompaniesContext.jsx';

export const useSavedCompanies = () => {
  const context = useContext(SavedCompaniesContext);
  if (!context) {
    throw new Error(
      'useSavedCompanies must be used within a SavedCompaniesProvider'
    );
  }
  return context;
};
