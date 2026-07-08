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

  const login = async (email, password) => {
     console.log("🚀 login() called");

    try {
      console.log("🚀 Sending request");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log(res.data);


      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        setToken(res.data.token);
        setUser(res.data.user);

        return { success: true };
      }

      return {
        success: false,
        message: res.data.message,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message || "Login failed",
      };
    }
  };

  /* ==========================
     REGISTER
  ========================== */

  const register = async (
    name,
    email,
    password,
    role = "Team Member"
  ) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        setToken(res.data.token);
        setUser(res.data.user);

        return { success: true };
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;