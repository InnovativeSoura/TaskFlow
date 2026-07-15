import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {
    loading,
    user,
    token,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  /* ==========================================
     LOADING STATE
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

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* ==========================================
     ALLOW ACCESS
  ========================================== */

  return children;
};

export default ProtectedRoute;

