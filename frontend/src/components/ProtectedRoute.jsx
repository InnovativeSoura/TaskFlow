import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loading, user, token, isAuthenticated } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  const authenticated =
    Boolean(token) && Boolean(user) && Boolean(isAuthenticated);

  console.log("====================================");

  console.log("🛡️ PROTECTED ROUTE CHECK");

  console.log("Current Path:", location.pathname);

  console.log("Token:", token ? "PRESENT" : "MISSING");

  console.log("User:", user || "NONE");

  console.log("isAuthenticated:", isAuthenticated);

  console.log("Authenticated:", authenticated);

  console.log("====================================");

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

  return children;
};

export default ProtectedRoute;
