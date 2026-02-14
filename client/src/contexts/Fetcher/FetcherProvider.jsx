import { useState } from 'react';
import { FetcherContext } from './FetcherContext.jsx';
// import { useAuth } from '../../hooks/useAuth.js';

export const FetcherProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { accessToken, refreshToken, logout } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

  const fetcher = async (
    url,
    options = {},
    fallbackError = 'An error occurred.'
  ) => {
    const finalUrl = url.startsWith('/') ? `${backendUrl}${url}` : url;

    const headers = {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const config = { credentials: 'include', ...options, headers };

    try {
      let response = await fetch(finalUrl, config);

      // 🔄 1. Handle Token Expiry (401)
      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(finalUrl, config);
        } else {
          logout();
          return { success: false, error: 'Session expired', status: 401 };
        }
      }

      // 🛑 2. NEW: Handle Rate Limiting (429) Explicitly
      if (response.status === 429) {
        setIsLoaded(true);
        // Try to parse the backend message, but have a hard fallback just in case
        const data = await response.json().catch(() => null);
        return {
          success: false,
          error:
            data?.message ||
            "Whoa, slow down! You're doing that too fast. Please wait 15 minutes.",
          status: 429,
        };
      }

      // 3. Parse JSON safely
      const data = await response.json().catch(() => ({}));

      // 4. Handle other errors (400, 404, 500)
      if (!response.ok || data.success === false) {
        const errorMessage = data?.message || fallbackError;
        setIsLoaded(true);
        return { success: false, error: errorMessage, status: response.status };
      }

      setIsLoaded(true);
      return { success: true, data };
    } catch (err) {
      console.error('Fetcher error:', err);
      setIsLoaded(true);
      return { success: false, error: 'Network error', status: null };
    }
  };

  return (
    <FetcherContext.Provider value={{ fetcher, isLoaded, setIsLoaded }}>
      {children}
    </FetcherContext.Provider>
  );
};
