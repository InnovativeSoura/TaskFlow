import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

/* ==========================================
   SAFE PARSE USER
========================================== */

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Invalid user in localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

/* ==========================================
   PROVIDER
========================================== */

export const AuthProvider = ({ children }) => {
  /* ==========================================
     STATE
  ========================================== */

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const [user, setUser] = useState(getStoredUser);

  const [loading, setLoading] = useState(true);

  /* ==========================================
     SAVE AUTH DATA
  ========================================== */

  const saveAuth = useCallback((token, user) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  }, []);

  /* ==========================================
     CLEAR AUTH
  ========================================== */

  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }, []);

  /* ==========================================
     LOGOUT
  ========================================== */

  const logout = useCallback(() => {
    clearAuth();
    setLoading(false);
  }, [clearAuth]);

  /* ==========================================
     LOAD CURRENT USER
  ========================================== */

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } = await api.get("/auth/me");

        if (data.success) {
          setUser(data.user);

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error(
          "Load User Error:",
          error.response?.data || error.message
        );

        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token, clearAuth]);

  /* ==========================================
     LOGIN
  ========================================== */

  const login = async ({
    email,
    password,
  }) => {
    try {
      const { data } = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      if (!data.success) {
        return {
          success: false,
          message: data.message,
        };
      }

      saveAuth(
        data.token,
        data.user
      );

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  /* ==========================================
     REGISTER
  ========================================== */
    const register = async ({
    name,
    email,
    password,
    role = "Team Member",
  }) => {
    try {
      const { data } = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      if (!data.success) {
        return {
          success: false,
          message: data.message,
        };
      }

      saveAuth(
        data.token,
        data.user
      );

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  /* ==========================================
     UPDATE USER
  ========================================== */

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  }, []);

  /* ==========================================
     PROVIDER
  ========================================== */

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

        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ==========================================
   CUSTOM HOOK
========================================== */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;