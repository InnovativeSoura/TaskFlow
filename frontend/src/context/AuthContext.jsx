// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "../api/axios";

const AuthContext =
  createContext(null);

/* ==========================================
   GET STORED USER
========================================== */

const getStoredUser = () => {
  try {
    const stored =
      localStorage.getItem(
        "user"
      );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error(
      "Invalid stored user:",
      error
    );

    localStorage.removeItem(
      "user"
    );

    return null;
  }
};

/* ==========================================
   PROVIDER
========================================== */

export const AuthProvider = ({
  children,
}) => {
  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        "token"
      )
    );

  const [user, setUser] =
    useState(getStoredUser);

  const [loading, setLoading] =
    useState(true);

  /* ==========================================
     SAVE AUTH
  ========================================== */

  const saveAuth = useCallback(
    (jwt, currentUser) => {
      if (jwt) {
        localStorage.setItem(
          "token",
          jwt
        );
      }

      if (currentUser) {
        localStorage.setItem(
          "user",
          JSON.stringify(
            currentUser
          )
        );
      }

      setToken(jwt || null);
      setUser(
        currentUser || null
      );
    },
    []
  );

  /* ==========================================
     CLEAR AUTH
  ========================================== */

  const clearAuth = useCallback(() => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);
    setUser(null);
  }, []);

  /* ==========================================
     LOAD CURRENT USER
  ========================================== */

  const loadCurrentUser =
    useCallback(async () => {
      const storedToken =
        localStorage.getItem(
          "token"
        );

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          await api.get(
            "/auth/me"
          );

        if (
          response.data?.success &&
          response.data?.user
        ) {
          const currentUser =
            response.data.user;

          setToken(storedToken);

          setUser(currentUser);

          localStorage.setItem(
            "user",
            JSON.stringify(
              currentUser
            )
          );
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error(
          "Load User Error:",
          error.response
            ?.data ||
            error.message
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
      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const data =
        response.data;

      if (!data?.success) {
        return {
          success: false,
          message:
            data?.message ||
            "Login failed.",
        };
      }

      saveAuth(
        data.token,
        data.user
      );

      /*
        Fetch the latest database
        version of the user.
      */

      const me =
        await api.get(
          "/auth/me"
        );

      if (
        !me.data?.success ||
        !me.data?.user
      ) {
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
          error.response?.data
            ?.message ||
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
      const response =
        await api.post(
          "/auth/register",
          {
            name,
            email,
            password,
            role,
          }
        );

      const data =
        response.data;

      if (!data?.success) {
        return {
          success: false,
          message:
            data?.message ||
            "Registration failed.",
        };
      }

      saveAuth(
        data.token,
        data.user
      );

      const me =
        await api.get(
          "/auth/me"
        );

      if (
        !me.data?.success ||
        !me.data?.user
      ) {
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
          error.response?.data
            ?.message ||
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
      if (!updatedUser) {
        return;
      }

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );
    },
    []
  );

  /* ==========================================
     AUTHENTICATED STATUS
  ========================================== */

  const isAuthenticated =
    Boolean(
      token &&
        user &&
        user._id
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

        isAuthenticated,
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