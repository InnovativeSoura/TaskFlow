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
  ======================================================= */

  const authenticated = Boolean(
    token &&
    user &&
    user._id
  );

  /* =======================================================
     NOT AUTHENTICATED
  ======================================================= */

  if (!authenticated) {

    return (
      <Navigate
        to="/"
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