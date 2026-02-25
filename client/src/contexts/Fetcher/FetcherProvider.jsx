import { useState } from 'react';
import { FetcherContext } from './FetcherContext.jsx';

export const FetcherProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Pull backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

  const fetcher = async (
    url,
    options = {},
    fallbackError = 'An error occurred.'
  ) => {
    // 1. Construct final URL
    const finalUrl = url.startsWith('/') ? `${backendUrl}${url}` : url;

    // 2. SMART HEADERS: Check if we are sending a file (FormData)
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    };

    // 3. Config (Ensuring credentials are sent for JWT cookies)
    const config = {
      credentials: 'include',
      ...options,
      headers,
    };

    try {
      let response = await fetch(finalUrl, config);

      // 🛑 1. Handle Rate Limiting (429)
      if (response.status === 429) {
        const data = await response.json().catch(() => null);
        return {
          success: false,
          error: data?.message || 'Whoa, slow down! Please wait a moment.',
          status: 429,
        };
      }

      // 🛑 2. Handle Unauthorized (401)
      // Note: We return the status so AuthProvider can decide if this is a "hard" error
      // or just a guest user session.
      if (response.status === 401) {
        return {
          success: false,
          error: 'Unauthorized',
          status: 401,
        };
      }

      // 3. Parse JSON safely
      const data = await response.json().catch(() => ({}));

      // 4. Handle other errors (400, 404, 500)
      if (!response.ok || data.success === false) {
        const errorMessage = data?.message || fallbackError;
        return {
          success: false,
          error: errorMessage,
          status: response.status,
          data: data // Keep data in case we need to see why it failed
        };
      }

      // 5. Success
      return { success: true, data };
    } catch (err) {
      console.error('Fetcher error:', err);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        status: null,
      };
    } finally {
      // Move this to finally to ensure isLoaded is always true after a call finishes
      setIsLoaded(true);
    }
  };

  return (
    <FetcherContext.Provider value={{ fetcher, isLoaded, setIsLoaded }}>
      {children}
    </FetcherContext.Provider>
  );
};
