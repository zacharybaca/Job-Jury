import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';

export const AppProvider = ({ children }) => {
  return (
    <FetcherProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </FetcherProvider>
  );
};
