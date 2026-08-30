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
import MainLayout from "../layouts/MainLayout";

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
            <MainLayout>
              <Dashboard />
            </MainLayout>
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
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
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
            <MainLayout>
              <Projects />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          PROJECT LIST
      =================================================== */}

      <Route
        path="/project-list"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProjectList />
            </MainLayout>
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
            <MainLayout>
              <Tasks />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TASK LIST
      =================================================== */}

      <Route
        path="/task-list"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TaskList />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          USERS
      =================================================== */}

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TEAM
      =================================================== */}

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Team />
            </MainLayout>
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
            <MainLayout>
              <Profile />
            </MainLayout>
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
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ANALYTICS
      =================================================== */}

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          KANBAN
      =================================================== */}

      <Route
        path="/kanban"
        element={
          <ProtectedRoute>
            <MainLayout>
              <KanbanBoard />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          CALENDAR
      =================================================== */}

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CalendarPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          TEAM CHAT
      =================================================== */}

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TeamChat />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          AI INSIGHTS
      =================================================== */}

      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AIInsights />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          GANTT
      =================================================== */}

      <Route
        path="/gantt"
        element={
          <ProtectedRoute>
            <MainLayout>
              <GanttPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          ACTIVITY
      =================================================== */}

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ActivityFeed />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          WORKSPACES
      =================================================== */}

      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Workspaces />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          SUBSCRIPTION
      =================================================== */}

      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Subscription />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          UPGRADE
      =================================================== */}

      <Route
        path="/upgrade"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Upgrade />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          SETTINGS
      =================================================== */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          NOTIFICATIONS
      =================================================== */}

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Notifications />
            </MainLayout>
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