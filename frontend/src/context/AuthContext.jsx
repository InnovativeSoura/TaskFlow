

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

    return parsedUser && typeof parsedUser === "object"
      ? parsedUser
      : null;
  } catch (error) {
    console.error("Invalid stored user:", error);

    localStorage.removeItem("user");

    return null;
  }
};

/* =========================================================
   GET STORED TOKEN
========================================================= */

const getStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Unable to read authentication token:", error);
    return null;
  }
};

/* =========================================================
   AUTH PROVIDER
========================================================= */

export const AuthProvider = ({ children }) => {
  /*
   * IMPORTANT:
   * Initialize token and user from localStorage immediately.
   * This prevents the protected dashboard route from seeing
   * an unauthenticated state during the first render.
   */

  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(getStoredUser);

  /*
   * loading is TRUE while we verify an existing session.
   */
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
  ======================================================= */

  const loadCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem("token");

    /*
     * No token = no authenticated session.
     */
    if (!storedToken) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/auth/me");

      const currentUser = response.data?.user;

      /*
       * Accept the authenticated user when the API gives us
       * a valid user object.
       *
       * Some backend versions may not include `success`,
       * therefore don't make the frontend unnecessarily
       * dependent on that one property.
       */
      if (currentUser) {
        setToken(storedToken);

        setUser(currentUser);

        localStorage.setItem(
          "token",
          storedToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } else {
        console.warn(
          "Authentication token exists but /auth/me returned no user."
        );

        clearAuth();
      }
    } catch (error) {
      console.error(
        "Load Current User Error:",
        error.response?.data || error.message
      );

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

      console.log("LOGIN RESPONSE:", data);

      /*
       * Backend must provide a token.
       */
      if (!data?.token) {
        return {
          success: false,
          message:
            data?.message ||
            "Login failed. No authentication token was returned.",
        };
      }

      /*
       * Backend may return success as true.
       *
       * We primarily require the token because that is what
       * establishes the authenticated session.
       */
      const initialUser = data?.user || null;

      saveAuth(
        data.token,
        initialUser
      );

      /*
       * Try to retrieve the latest user from the backend.
       *
       * The token has already been saved to localStorage,
       * so the axios interceptor can use it immediately.
       */
      try {
        const meResponse = await api.get("/auth/me");

        const latestUser =
          meResponse.data?.user || initialUser;

        if (!latestUser) {
          clearAuth();

          return {
            success: false,
            message:
              "Login succeeded, but the authenticated user could not be loaded.",
          };
        }

        saveAuth(
          data.token,
          latestUser
        );

        /*
         * Explicitly make sure loading is finished.
         */
        setLoading(false);

        return {
          success: true,
          user: latestUser,
          token: data.token,
        };
      } catch (meError) {
        /*
         * If the login endpoint successfully returned a token
         * and user, don't immediately destroy a valid login
         * merely because /auth/me failed.
         *
         * This also makes the authentication flow more robust
         * against temporary /me problems.
         */
        console.warn(
          "Could not refresh user through /auth/me:",
          meError.response?.data || meError.message
        );

        if (initialUser) {
          setToken(data.token);
          setUser(initialUser);

          setLoading(false);

          return {
            success: true,
            user: initialUser,
            token: data.token,
          };
        }

        clearAuth();

        return {
          success: false,
          message:
            "Login succeeded but the user session could not be verified.",
        };
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error.response?.data || error.message
      );

      clearAuth();

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

      console.log("REGISTER RESPONSE:", data);

      if (!data?.token) {
        return {
          success: false,
          message:
            data?.message ||
            "Registration failed. No authentication token was returned.",
        };
      }

      const initialUser = data?.user || null;

      saveAuth(
        data.token,
        initialUser
      );

      try {
        const meResponse = await api.get("/auth/me");

        const latestUser =
          meResponse.data?.user || initialUser;

        if (!latestUser) {
          clearAuth();

          return {
            success: false,
            message:
              "Registration succeeded, but the authenticated user could not be loaded.",
          };
        }

        saveAuth(
          data.token,
          latestUser
        );

        setLoading(false);

        return {
          success: true,
          user: latestUser,
          token: data.token,
        };
      } catch (meError) {
        console.warn(
          "Could not refresh registered user:",
          meError.response?.data || meError.message
        );

        if (initialUser) {
          setToken(data.token);
          setUser(initialUser);

          setLoading(false);

          return {
            success: true,
            user: initialUser,
            token: data.token,
          };
        }

        clearAuth();

        return {
          success: false,
          message:
            "Registration succeeded but the user session could not be verified.",
        };
      }
    } catch (error) {
      console.error(
        "Register Error:",
        error.response?.data || error.message
      );

      clearAuth();

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    /*
     * Keep loading false after logout.
     */
    setLoading(false);
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

  /*
   * IMPORTANT:
   *
   * Don't require `user._id` here.
   *
   * Depending on your backend serialization, the ID can
   * temporarily be represented differently.
   *
   * A valid token + user object is enough for the frontend
   * authentication state.
   */

  const isAuthenticated = Boolean(
    token && user
  );

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