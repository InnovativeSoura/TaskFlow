import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  /* ==========================
     LOAD USER
  ========================== */

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");

        if (res.data.success) {
          setUser(res.data.user);

          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
          );
        }
      } catch (err) {
        console.error("Load User Error:", err);

        // Logout ONLY if token is actually invalid
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  /* ==========================
     LOGIN
  ========================== */

  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        setToken(res.data.token);
        setUser(res.data.user);

        return {
          success: true,
          user: res.data.user,
        };
      }

      return {
        success: false,
        message: res.data.message,
      };
    } catch (err) {
      console.error("Login Error:", err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Login failed",
      };
    }
  };

  /* ==========================
     REGISTER
  ========================== */

  const register = async ({
    name,
    email,
    password,
    role = "member",
  }) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        setToken(res.data.token);
        setUser(res.data.user);

        return {
          success: true,
          user: res.data.user,
        };
      }

      return {
        success: false,
        message: res.data.message,
      };
    } catch (err) {
      console.error("Register Error:", err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  /* ==========================
     UPDATE USER
  ========================== */

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  /* ==========================
     LOGOUT
  ========================== */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

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