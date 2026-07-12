import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
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

  /* ==========================
     LOGIN
  ========================== */

  const login = async ({ email, password }) => {
  console.log("🚀 login() called");

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("✅ Login Response:", res.data);

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);

      setToken(res.data.token);
      setUser(res.data.user);

      return {
        success: true,
        user: res.data.user,
      };
    }

    return {
      success: false,
      message: res.data.message || "Login failed",
    };
  } catch (err) {
    console.error("❌ Login Error");
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
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

    console.log("✅ Register Response:", res.data);

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);

      setToken(res.data.token);
      setUser(res.data.user);

      return {
        success: true,
        user: res.data.user,
      };
    }

    return {
      success: false,
      message: res.data.message || "Registration failed",
    };
  } catch (err) {
    console.error("❌ Register Error");
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Registration failed",
    };
  }
};

  /* ==========================
     LOGOUT
  ========================== */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
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