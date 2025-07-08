import axios from "axios";

// This is CRITICAL for our cookie-based authentication to work
axios.defaults.withCredentials = true;

const api = axios.create({
  // Use your actual Laravel Herd URL
  baseURL: "/",
  withCredentials: true, // This line is CRITICAL
});

export default api;
