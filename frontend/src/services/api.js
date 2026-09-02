import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

console.log("====================================");
console.log("🌐 API Base URL:", BASE_URL);
console.log("====================================");

const api = axios.create({
  baseURL: BASE_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    // Support both old and new token keys
    const token =
      localStorage.getItem("token") || localStorage.getItem("taskflow_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    console.log("🔑 Token:", token ? "Present" : "Missing");

    if (config.data) {
      console.log("📤 Request Body:", config.data);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status}`, response.config.url);

    return response;
  },

  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data,
    );

    if (error.response?.status === 401) {
      console.warn("Unauthorized request");
    }

    return Promise.reject(error);
  },
);

export default api;
