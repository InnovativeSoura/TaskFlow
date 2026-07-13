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
      const { data } = await api.get("/auth/me");

      if (data.success) {
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }
    } catch (err) {
      console.error(err);

      // Keep existing user if already available
      if (!user) {
        logout();
      }
    }

    setLoading(false);
  };

  loadUser();

// eslint-disable-next-line
}, []);

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