// src/components/ProtectedRoute.jsx

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {
    loading,
    user,
    token,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  /* =======================================================
     AUTHENTICATION CHECK
     
     IMPORTANT:
     Do NOT require user._id here.
     
     AuthContext already determines whether the session
     is authenticated using token + user.
  ======================================================= */

  const authenticated =
    Boolean(token) &&
    Boolean(user) &&
    Boolean(isAuthenticated);

  /* =======================================================
     DEBUG
  ======================================================= */

  console.log(
    "===================================="
  );

  console.log(
    "🛡️ PROTECTED ROUTE CHECK"
  );

  console.log(
    "Current Path:",
    location.pathname
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
    "isAuthenticated:",
    isAuthenticated
  );

  console.log(
    "Authenticated:",
    authenticated
  );

  console.log(
    "===================================="
  );

  /* =======================================================
     NOT AUTHENTICATED
  ======================================================= */

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /* =======================================================
     AUTHENTICATED
  ======================================================= */

  return children;
};

export default ProtectedRoute;