import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {
    loading,
    user,
    token,
  } = useAuth();

  const location = useLocation();

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

  const authenticated = Boolean(
    token &&
    user &&
    user._id
  );

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