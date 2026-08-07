// src/api/axios.js

import axios from "axios";

/* =========================================================
   API URL
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const BASE_URL = API_URL.endsWith("/api")
  ? API_URL
  : `${API_URL}/api`;

console.log("====================================");
console.log("🌐 TaskFlow API Base URL:", BASE_URL);
console.log("====================================");

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    /*
     * Always make sure headers exists.
     */
    config.headers = config.headers || {};

    /*
     * Attach JWT token to every protected request.
     */
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      /*
       * Make sure we don't accidentally send
       * an old/undefined Authorization header.
       */
      delete config.headers.Authorization;
    }

    console.log("====================================");
    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    console.log(
      "🔑 Token:",
      token ? "PRESENT" : "MISSING"
    );
    console.log(
      "🛡 Authorization:",
      config.headers.Authorization
        ? "Bearer token attached"
        : "NOT ATTACHED"
    );
    console.log("====================================");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.status} ${response.config.url}`
    );

    return response;
  },

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    console.error("❌ API ERROR:", {
      status,
      url,
      message:
        error.response?.data?.message ||
        error.message,
    });

    /*
     * Authentication endpoints should not trigger
     * global logout handling.
     */
    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    /*
     * Only clear authentication when a protected
     * request actually returns 401.
     */
    if (status === 401 && !isAuthRoute) {
      console.warn(
        "⚠️ Authentication rejected. Clearing session."
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;