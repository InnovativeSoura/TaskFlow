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
   GET STORED USER
========================================== */

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Invalid stored user:", error);

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
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(
    getStoredUser()
  );

  const [loading, setLoading] = useState(true);

  /* ==========================================
     SAVE AUTH
  ========================================== */

  const saveAuth = useCallback((jwt, currentUser) => {
    localStorage.setItem("token", jwt);

    localStorage.setItem(
      "user",
      JSON.stringify(currentUser)
    );

    setToken(jwt);
    setUser(currentUser);
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
     LOAD CURRENT USER
  ========================================== */

  const loadCurrentUser = useCallback(async () => {
    const storedToken =
      localStorage.getItem("token");

    if (!storedToken) {
      clearAuth();
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } =
        await api.get("/auth/me");

      if (data.success) {
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setToken(storedToken);
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
  }, [clearAuth]);

  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  /* ==========================================
     LOGIN
  ========================================== */

  const login = async ({
    email,
    password,
  }) => {
    try {
      const { data } =
        await api.post("/auth/login", {
          email,
          password,
        });

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

      /* Verify Token */

      const me =
        await api.get("/auth/me");

      if (!me.data.success) {
        clearAuth();

        return {
          success: false,
          message:
            "Authentication verification failed.",
        };
      }

      saveAuth(
        data.token,
        me.data.user
      );

      return {
        success: true,
        user: me.data.user,
      };
    } catch (error) {
      clearAuth();

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed.",
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
      const { data } =
        await api.post(
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

      const me =
        await api.get("/auth/me");

      if (!me.data.success) {
        clearAuth();

        return {
          success: false,
          message:
            "Authentication verification failed.",
        };
      }

      saveAuth(
        data.token,
        me.data.user
      );

      return {
        success: true,
        user: me.data.user,
      };
    } catch (error) {
      clearAuth();

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed.",
      };
    }
  };

  /* ==========================================
     LOGOUT
  ========================================== */

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  /* ==========================================
     UPDATE USER
  ========================================== */

  const updateUser = useCallback(
    (updatedUser) => {
      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
    },
    []
  );

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

        isAuthenticated: Boolean(
          token &&
          user &&
          user._id
        ),
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
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;