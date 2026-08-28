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

    const parsedUser = JSON.parse(storedUser);

    return parsedUser || null;
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
  /* =======================================================
     AUTH STATE
  ======================================================= */

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    return getStoredUser();
  });

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
     
     This is ONLY used when the application starts
     and an existing token is already stored.
  ======================================================= */

  const loadCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem("token");

    /* ---------------------------------------------
       No token = normal logged-out state
    --------------------------------------------- */

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/auth/me");

      const currentUser =
        response.data?.user ||
        response.data?.data?.user ||
        null;

      if (
        response.data?.success &&
        currentUser
      ) {
        setToken(storedToken);
        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } else {
        console.warn(
          "Auth session could not be restored."
        );

        clearAuth();
      }
    } catch (error) {
      console.error(
        "Load Current User Error:",
        error.response?.data || error.message
      );

      /*
       * Existing token is invalid.
       * Clear the session so protected routes
       * cannot be accessed.
       */
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
     
     IMPORTANT:
     Do NOT immediately call /auth/me here.
     
     The login endpoint already returned the token
     and user. Save them and let the application
     proceed directly to the dashboard.
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

      console.log(
        "🔐 Login Response:",
        data
      );

      /* ---------------------------------------------
         Check backend response
      --------------------------------------------- */

      if (!data?.success) {
        return {
          success: false,
          message:
            data?.message ||
            "Login failed.",
        };
      }

      /* ---------------------------------------------
         Make sure token exists
      --------------------------------------------- */

      if (!data?.token) {
        console.error(
          "Login succeeded but no JWT token was returned.",
          data
        );

        return {
          success: false,
          message:
            "Login succeeded but authentication token was not returned by the server.",
        };
      }

      /* ---------------------------------------------
         Make sure user exists
      --------------------------------------------- */

      if (!data?.user) {
        console.error(
          "Login succeeded but no user was returned.",
          data
        );

        return {
          success: false,
          message:
            "Login succeeded but user information was not returned by the server.",
        };
      }

      /* ---------------------------------------------
         SAVE AUTHENTICATION
      --------------------------------------------- */

      saveAuth(
        data.token,
        data.user
      );

      console.log(
        "✅ Login successful."
      );

      console.log(
        "👤 User:",
        data.user
      );

      console.log(
        "🔑 Token saved."
      );

      /* ---------------------------------------------
         RETURN SUCCESS IMMEDIATELY
         
         AuthCard will navigate to /dashboard.
      --------------------------------------------- */

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error(
        "❌ Login Error:",
        error.response?.data ||
          error.message
      );

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
     
     Same principle as login:
     use the token/user returned by registration directly.
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

      console.log(
        "📝 Register Response:",
        data
      );

      /* ---------------------------------------------
         Check backend response
      --------------------------------------------- */

      if (!data?.success) {
        return {
          success: false,
          message:
            data?.message ||
            "Registration failed.",
        };
      }

      /* ---------------------------------------------
         Token check
      --------------------------------------------- */

      if (!data?.token) {
        console.error(
          "Registration succeeded but no JWT token was returned.",
          data
        );

        return {
          success: false,
          message:
            "Registration succeeded but authentication token was not returned by the server.",
        };
      }

      /* ---------------------------------------------
         User check
      --------------------------------------------- */

      if (!data?.user) {
        console.error(
          "Registration succeeded but no user was returned.",
          data
        );

        return {
          success: false,
          message:
            "Registration succeeded but user information was not returned by the server.",
        };
      }

      /* ---------------------------------------------
         SAVE AUTHENTICATION
      --------------------------------------------- */

      saveAuth(
        data.token,
        data.user
      );

      console.log(
        "✅ Registration successful."
      );

      /* ---------------------------------------------
         RETURN SUCCESS
      --------------------------------------------- */

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error(
        "❌ Register Error:",
        error.response?.data ||
          error.message
      );

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
    console.log(
      "🚪 Logging out..."
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

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

  const isAuthenticated =
    Boolean(token) &&
    Boolean(user);

  /* =======================================================
     DEBUG
  ======================================================= */

  useEffect(() => {
    console.log(
      "===================================="
    );

    console.log(
      "🔐 AUTH STATE"
    );

    console.log(
      "Token:",
      token ? "PRESENT" : "MISSING"
    );

    console.log(
      "User:",
      user || "NONE"
    );

    console.log(
      "Authenticated:",
      isAuthenticated
    );

    console.log(
      "Loading:",
      loading
    );

    console.log(
      "===================================="
    );
  }, [
    token,
    user,
    isAuthenticated,
    loading,
  ]);

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