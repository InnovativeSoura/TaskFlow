// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

/* =========================================================
   GET STORED USER
========================================================= */

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid stored user:", error);

    localStorage.removeItem("user");

    return null;
  }
};

/* =========================================================
   AUTH PROVIDER
========================================================= */

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(getStoredUser);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     SAVE AUTHENTICATION
  ======================================================= */

  const saveAuth = useCallback((jwt, currentUser) => {
    if (jwt) {
      localStorage.setItem("token", jwt);
      setToken(jwt);
    }

    if (currentUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );

      setUser(currentUser);
    }
  }, []);

  /* =======================================================
     CLEAR AUTHENTICATION
  ======================================================= */

  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }, []);

  /* =======================================================
     LOAD CURRENT USER
  ======================================================= */

  const loadCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/auth/me");

      if (
        response.data?.success &&
        response.data?.user
      ) {
        const currentUser = response.data.user;

        setToken(storedToken);
        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error(
        "Load Current User Error:",
        error.response?.data || error.message
      );

      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  /* =======================================================
     INITIAL AUTH CHECK
  ======================================================= */

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  /* =======================================================
     LOGIN
  ======================================================= */

  const login = async ({ email, password }) => {
    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (!data?.success) {
        return {
          success: false,
          message:
            data?.message || "Login failed.",
        };
      }

      /*
       * Save token and initial user.
       */
      saveAuth(
        data.token,
        data.user
      );

      /*
       * Verify with database.
       */
      const meResponse = await api.get(
        "/auth/me"
      );

      if (
        !meResponse.data?.success ||
        !meResponse.data?.user
      ) {
        clearAuth();

        return {
          success: false,
          message:
            "Authentication verification failed.",
        };
      }

      /*
       * Save latest database user.
       */
      saveAuth(
        data.token,
        meResponse.data.user
      );

      return {
        success: true,
        user: meResponse.data.user,
      };
    } catch (error) {
      console.error(
        "Login Error:",
        error.response?.data || error.message
      );

      clearAuth();

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  /* =======================================================
     REGISTER
  ======================================================= */

  const register = async ({
    name,
    email,
    password,
    role = "Team Member",
  }) => {
    try {
      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      const data = response.data;

      if (!data?.success) {
        return {
          success: false,
          message:
            data?.message ||
            "Registration failed.",
        };
      }

      /*
       * Save authentication.
       */
      saveAuth(
        data.token,
        data.user
      );

      /*
       * Verify authenticated user.
       */
      const meResponse = await api.get(
        "/auth/me"
      );

      if (
        !meResponse.data?.success ||
        !meResponse.data?.user
      ) {
        clearAuth();

        return {
          success: false,
          message:
            "Authentication verification failed.",
        };
      }

      saveAuth(
        data.token,
        meResponse.data.user
      );

      return {
        success: true,
        user: meResponse.data.user,
      };
    } catch (error) {
      console.error(
        "Register Error:",
        error.response?.data || error.message
      );

      clearAuth();

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed.",
      };
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = useCallback(() => {
    /*
     * Completely remove authentication.
     */
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    /*
     * Immediately update React state.
     */
    setToken(null);
    setUser(null);
  }, []);

  /* =======================================================
     UPDATE USER
  ======================================================= */

  const updateUser = useCallback(
    (updatedUser) => {
      if (!updatedUser) {
        return;
      }

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
    },
    []
  );

  /* =======================================================
     AUTHENTICATED STATUS
  ======================================================= */

  const isAuthenticated = Boolean(
    token &&
    user &&
    user._id
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,
        register,
        logout,

        updateUser,

        setUser,
        setToken,

        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   CUSTOM HOOK
========================================================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;