import axios from "axios";

// In dev: uses localhost:5000
// In production: set VITE_API_URL in Netlify to your Render backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default api;
