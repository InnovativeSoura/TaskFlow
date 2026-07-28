// src/routes/AppRoutes.jsx

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import KanbanBoard from "../pages/KanbanBoard";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";

/*
  Import your existing authentication page.
  Change this import only if your actual filename is different.
*/
import AuthPage from "../pages/AuthPage";

import { useAuth } from "../context/AuthContext";



/* =========================================================
   AUTHENTICATED LAYOUT
========================================================= */

const AppLayout = () => {
  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();

  /*
    Desktop:
      true  = expanded
      false = collapsed

    Mobile:
      true  = open
      false = closed
  */
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth <= 768
    );

  /* =======================================================
     RESPONSIVE CHECK
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth <= 768;

      setIsMobile(mobile);

      /*
        On desktop the sidebar is open by default.
        On mobile it should be closed.
      */
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [
    location.pathname,
    isMobile,
  ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
      </div>
    );
  }

  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* =======================================================
     APPLICATION
  ======================================================= */

  return (
    <div
      className={`app-shell ${
        sidebarOpen
          ? "sidebar-is-open"
          : "sidebar-is-collapsed"
      } ${
        isMobile
          ? "app-mobile"
          : ""
      }`}
    >

      {/* =================================================
          FIXED TOP NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          SIDEBAR

          Sidebar begins BELOW navbar.
      ================================================= */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="app-main">
        <div className="app-page">
          <Routes>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/kanban"
              element={<KanbanBoard />}
            />

            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>
        </div>
      </main>
    </div>
  );
};

/* =========================================================
   ROUTES
========================================================= */

const AppRoutes = () => {
  return (
    <Routes>

      {/* =================================================
          PUBLIC
      ================================================= */}

      <Route
        path="/"
        element={<AuthPage />}
      />

      {/* =================================================
          APPLICATION
      ================================================= */}

      <Route
        path="/*"
        element={<AppLayout />}
      />

    </Routes>
  );
};

export default AppRoutes;