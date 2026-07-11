import axios from "axios";

/* ==========================================
   AXIOS INSTANCE
========================================== */

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================
   REQUEST INTERCEPTOR
========================================== */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================================
   RESPONSE INTERCEPTOR
========================================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;