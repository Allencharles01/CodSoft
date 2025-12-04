// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://jobboard-backend-hiyx.onrender.com/", // your backend
  withCredentials: true,
});

export default api;
