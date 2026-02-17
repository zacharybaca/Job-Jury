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
    // If it's FormData, we let the browser set the Content-Type automatically
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    };

    // 3. Config (Including credentials for future cookie-based auth)
    const config = {
      credentials: 'include',
      ...options,
      headers
    };

    try {
      let response = await fetch(finalUrl, config);

      // 🛑 1. Handle Rate Limiting (429)
      if (response.status === 429) {
        setIsLoaded(true);
        const data = await response.json().catch(() => null);
        return {
          success: false,
          error: data?.message || "Whoa, slow down! Please wait a moment.",
          status: 429,
        };
      }

      // 🛑 2. Handle Unauthorized (401)
      if (response.status === 401) {
        setIsLoaded(true);
        return {
          success: false,
          error: 'Unauthorized. Please log in to continue.',
          status: 401
        };
      }

      // 3. Parse JSON safely
      const data = await response.json().catch(() => ({}));

      // 4. Handle other errors (400, 404, 500)
      if (!response.ok || data.success === false) {
        const errorMessage = data?.message || fallbackError;
        setIsLoaded(true);
        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }

      // 5. Success
      setIsLoaded(true);
      return { success: true, data };

    } catch (err) {
      console.error('Fetcher error:', err);
      setIsLoaded(true);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        status: null
      };
    }
  };

  return (
    <FetcherContext.Provider value={{ fetcher, isLoaded, setIsLoaded }}>
      {children}
    </FetcherContext.Provider>
  );
};
