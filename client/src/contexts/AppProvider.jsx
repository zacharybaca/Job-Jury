import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { SavedCompaniesProvider } from './SavedCompanies/SavedCompaniesProvider';

export const AppProvider = ({ children }) => {
  return (
    <FetcherProvider>
      <AuthProvider>
        <SavedCompaniesProvider>{children}</SavedCompaniesProvider>
      </AuthProvider>
    </FetcherProvider>
  );
};
