import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /* ==========================================
      STATE
  ========================================== */

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");

    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  /* ==========================================
      LOGOUT
  ========================================== */

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

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
          logout();
        }
      } catch (err) {
        console.error("Auth Error:", err);

        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token, logout]);

  /* ==========================================
      LOGIN
  ========================================== */

  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (!data.success) {
        return {
          success: false,
          message: data.message,
        };
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
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

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  /* ==========================================
      UPDATE USER
  ========================================== */

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

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
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;