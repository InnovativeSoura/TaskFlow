import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /* ==========================================
      INITIAL STATE
  ========================================== */

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const [loading, setLoading] = useState(true);

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

        // Logout ONLY if token is invalid
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  /* ==========================================
      LOGIN
  ========================================== */

  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        const loggedInUser = res.data.user;
        const jwtToken = res.data.token;

        localStorage.setItem("token", jwtToken);

        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

        setToken(jwtToken);
        setUser(loggedInUser);

        return {
          success: true,
          user: loggedInUser,
        };
      }

      return {
        success: false,
        message:
          res.data.message || "Login failed",
      };
    } catch (err) {
      console.error("Login Error:", err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
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
      const res = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      if (res.data.success) {
        const newUser = res.data.user;
        const jwtToken = res.data.token;

        localStorage.setItem("token", jwtToken);

        localStorage.setItem(
          "user",
          JSON.stringify(newUser)
        );

        setToken(jwtToken);
        setUser(newUser);

        return {
          success: true,
          user: newUser,
        };
      }

      return {
        success: false,
        message:
          res.data.message ||
          "Registration failed",
      };
    } catch (err) {
      console.error("Register Error:", err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
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
      LOGOUT
  ========================================== */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
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
        isAuthenticated:
          !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);

export default AuthContext;