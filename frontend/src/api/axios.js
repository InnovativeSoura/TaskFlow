import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE_URL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

console.log("====================================");
console.log("🌐 TaskFlow API Base URL:", BASE_URL);
console.log("====================================");

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    /*
     * Always make sure headers exists.
     */
    config.headers = config.headers || {};

    /*
     * Attach JWT token to protected requests.
     */
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    console.log("====================================");

    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    console.log("🔑 Token:", token ? "PRESENT" : "MISSING");

    console.log(
      "🛡 Authorization:",
      config.headers.Authorization ? "Bearer token attached" : "NOT ATTACHED",
    );

    console.log("====================================");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);

    return response;
  },

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    console.error("❌ API ERROR:", {
      status,
      url,
      message: error.response?.data?.message || error.message,
    });

    const isAuthRoute =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthRoute) {
      console.warn("⚠️ Authentication rejected. Clearing session.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  },
);

export default api;
