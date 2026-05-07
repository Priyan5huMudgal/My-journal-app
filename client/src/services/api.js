import axios from "axios";

const defaultBase = import.meta.env.PROD ? "" : "http://localhost:5000";
const API_BASE = import.meta.env.VITE_API_BASE || defaultBase;

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("journal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export default api;
