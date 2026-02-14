import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
  // Since we set up the proxy in vite.config.js, we don't need the full URL here.
  // "/api" automatically redirects to http://localhost:5000/api
  baseURL: "/api",

  // This allows cookies/sessions to be sent with requests (Vital for Auth)
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
