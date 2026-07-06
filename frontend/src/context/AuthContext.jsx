import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import axios from "axios";

const AuthContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(true);

  /* ==========================================
      SET TOKEN
  ========================================== */

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common[
        "Authorization"
      ];
    }
  }, [token]);

  /* ==========================================
      LOAD USER
  ========================================== */

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const res = await axios.get(`${API_URL}/auth/me`);

        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error(err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  /* ==========================================
      LOGIN
  ========================================== */

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem(
          "token",
          res.data.token
        );

        setToken(res.data.token);

        setUser(res.data.user);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: res.data.message,
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

  const register = async (
    name,
    email,
    password,
    role = "Team Member"
  ) => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
          role,
        }
      );

      if (res.data.success) {
        localStorage.setItem(
          "token",
          res.data.token
        );

        setToken(res.data.token);

        setUser(res.data.user);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: res.data.message,
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
      LOGOUT
  ========================================== */

  const logout = () => {
    localStorage.removeItem("token");

    delete axios.defaults.headers.common[
      "Authorization"
    ];

    setToken(null);

    setUser(null);
  };

  /* ==========================================
      UPDATE USER
  ========================================== */

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  /* ==========================================
      VALUE
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ==========================================
    HOOK
========================================== */

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;