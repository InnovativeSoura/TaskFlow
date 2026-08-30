// src/routes/AppRoutes.jsx

import {
  useEffect,
} from "react";

import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import ProtectedRoute from "../components/ProtectedRoute";

/* ===========================
   PUBLIC PAGES
=========================== */

import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import OAuthSuccess from "../pages/OAuthSuccess";

/* ===========================
   DASHBOARDS
=========================== */

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

/* ===========================
   PROJECTS
=========================== */

import Projects from "../pages/Projects";
import ProjectList from "../pages/ProjectList";

/* ===========================
   TASKS
=========================== */

import Tasks from "../pages/Tasks";
import TaskList from "../pages/TaskList";

/* ===========================
   TEAM
=========================== */

import Users from "../pages/Users";
import Team from "../pages/Team";

/* ===========================
   PROFILE
=========================== */

import Profile from "../pages/Profile";

/* ===========================
   REPORTS
=========================== */

import Reports from "../pages/Reports";
import Analytics from "../pages/Analytics";

/* ===========================
   PRODUCTIVITY
=========================== */

import KanbanBoard from "../pages/KanbanBoard";
import CalendarPage from "../pages/CalendarPage";
import TeamChat from "../pages/TeamChat";
import AIInsights from "../pages/AIInsights";
import GanttPage from "../pages/GanttPage";

/* ===========================
   SETTINGS
=========================== */

import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import ActivityFeed from "../pages/ActivityFeed";
import Workspaces from "../pages/Workspaces";
import Subscription from "../pages/Subscription";
import Upgrade from "../pages/Upgrade";


/* =========================================================
   AUTH REDIRECT

   /login and /register no longer render AuthPage.

   They return the user to the HOME PAGE and tell the
   landing AuthCard which mode should be displayed.
========================================================= */

const AuthRedirect = ({ mode = "login" }) => {

  const navigate = useNavigate();

  useEffect(() => {

    /*
     * First return to the public Home page.
     */
    navigate("/", {
      replace: true,
    });

    /*
     * Tell the compact AuthCard to switch mode.
     */
    const timer = window.setTimeout(() => {

      window.dispatchEvent(
        new CustomEvent("taskflow-auth-mode", {
          detail: {
            mode,
          },
        })
      );

    }, 0);

    return () => {
      window.clearTimeout(timer);
    };

  }, [mode, navigate]);

  return null;
};


/* =========================================================
   APP ROUTES
========================================================= */

const AppRoutes = () => {

  const {
    loading,
    token,
    user,
  } = useAuth();


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
     AUTHENTICATED
  ======================================================= */

  const authenticated = Boolean(
    token &&
    user &&
    user._id
  );


  return (
    <Routes>

      {/* ===================================================
          PUBLIC HOME
      =================================================== */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* ===================================================
          LOGIN

          IMPORTANT:
          No standalone AuthPage anymore.

          Visiting /login returns to Home and opens
          the Login mode inside the landing AuthCard.
      =================================================== */}

      <Route
        path="/login"
        element={
          authenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <AuthRedirect mode="login" />
          )
        }
      />


      {/* ===================================================
          REGISTER

          Visiting /register returns to Home and opens
          Register mode inside the landing AuthCard.
      =================================================== */}

      <Route
        path="/register"
        element={
          authenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <AuthRedirect mode="register" />
          )
        }
      />


      {/* ===================================================
          PRICING
      =================================================== */}

      <Route
        path="/pricing"
        element={<Pricing />}
      />


      {/* ===================================================
          HOME ALIAS
      =================================================== */}

      <Route
        path="/home"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />


      {/* ===================================================
          OAUTH CALLBACK
      =================================================== */}

      <Route
        path="/oauth-success"
        element={<OAuthSuccess />}
      />


      {/* ===================================================
          DASHBOARD
      =================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ADMIN DASHBOARD
      =================================================== */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          PROJECTS
      =================================================== */}

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/project-list"
        element={
          <ProtectedRoute>
            <ProjectList />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TASKS
      =================================================== */}

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/task-list"
        element={
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TEAM
      =================================================== */}

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          PROFILE
      =================================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          REPORTS
      =================================================== */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          PRODUCTIVITY
      =================================================== */}

      <Route
        path="/kanban"
        element={
          <ProtectedRoute>
            <KanbanBoard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <TeamChat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AIInsights />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gantt"
        element={
          <ProtectedRoute>
            <GanttPage />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          SETTINGS / ACTIVITY
      =================================================== */}

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityFeed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <Workspaces />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upgrade"
        element={
          <ProtectedRoute>
            <Upgrade />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          404
      =================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;