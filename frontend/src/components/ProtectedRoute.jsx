// src/components/ProtectedRoute.jsx

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";


const ProtectedRoute = ({ children }) => {

  const {
    loading,
    user,
    token,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();


  /* =======================================================
     AUTH LOADING
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

  const authenticated =
    Boolean(token) &&
    Boolean(user) &&
    Boolean(isAuthenticated);


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
     
     IMPORTANT:
     
     Every protected page is now automatically placed
     inside ONE MainLayout.
     
     MainLayout contains:
     
     Sidebar
     Navbar
     Page Content
  ======================================================= */

  return (
    <MainLayout>
      {children}
    </MainLayout>
  );

};


export default ProtectedRoute;