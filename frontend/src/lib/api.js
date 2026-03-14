import axios from "axios";
import { getToken } from "./auth";

const defaultApiUrl =
  import.meta.env.PROD
    ? "https://victors-events.onrender.com/api"
    : "http://localhost:4000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
