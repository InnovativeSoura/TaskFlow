import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const {
    loading,
    user,
    token,
    isAuthenticated,
  } = useAuth();

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  /* ==========================================
     AUTH CHECK
  ========================================== */

  const authenticated =
    isAuthenticated || (token && user);

  if (authenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /* ==========================================
     ALLOW PUBLIC ACCESS
  ========================================== */

  return children;
};

export default PublicRoute;

