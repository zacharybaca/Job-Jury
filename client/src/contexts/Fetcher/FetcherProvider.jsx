import { useState } from 'react';
import { FetcherContext } from './FetcherContext.jsx';

export const FetcherProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Vite automatically sets DEV to true during local development and false in production
  const isLocalDev = import.meta.env.DEV;

  // Use localhost for development, fallback to Render URL or Prod ENV for production
  const backendUrl = isLocalDev
    ? 'http://localhost:5000'
    : import.meta.env.VITE_API_URL || 'https://job-jury.onrender.com';

  const fetcher = async (
    url,
    options = {},
    fallbackError = 'An error occurred.'
  ) => {
    const finalUrl = url.startsWith('/') ? `${backendUrl}${url}` : url;

    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    };

    const config = {
      ...options, // Spread first...
      credentials: 'include', // ...then force credentials so they aren't overridden
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
      if (response.status === 401) {
        return {
          success: false,
          error: 'Unauthorized',
          status: 401,
        };
      }

      // 🛑 3. Parse JSON safely + check Content-Type
      const contentType = response.headers.get('content-type');
      let data = {};

      if (contentType && contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}));
      } else {
        // If it's not JSON (like the "1" or empty response you saw),
        // read as text to debug
        const textData = await response.text();
        data = { message: textData || fallbackError };
      }

      // 🛑 4. Handle other errors (400, 404, 500)
      if (!response.ok || data.success === false) {
        return {
          success: false,
          error: data?.message || fallbackError,
          status: response.status,
          data: data,
        };
      }

      // ✅ 5. Success
      return { success: true, data };
    } catch (err) {
      console.error('Fetcher error:', err);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        status: null,
      };
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <FetcherContext.Provider value={{ fetcher, isLoaded, setIsLoaded }}>
      {children}
    </FetcherContext.Provider>
  );
};
