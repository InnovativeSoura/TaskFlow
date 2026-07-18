import axios from "axios";

/* ==========================================
   API URL
========================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const BASE_URL = API_URL.endsWith("/api")
  ? API_URL
  : `${API_URL}/api`;

console.log("====================================");
console.log("🌐 API Base URL:", BASE_URL);
console.log("====================================");

/* ==========================================
   AXIOS INSTANCE
========================================== */

const api = axios.create({
  baseURL: BASE_URL,
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
    } else {
      delete config.headers.Authorization;
    }

    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );

    console.log(
      "🔑 Token:",
      token ? "Present" : "Missing"
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
    const status = error.response?.status;

    console.error(
      "❌ API Error:",
      status,
      error.response?.data || error.message
    );

    // Token expired or invalid
    if (status === 401) {
      console.warn("⚠ Session expired.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;