import { useEffect } from "react";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import OAuthSuccess from "../pages/OAuthSuccess";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

import Projects from "../pages/Projects";
import ProjectList from "../pages/ProjectList";

import Tasks from "../pages/Tasks";
import TaskList from "../pages/TaskList";

import Users from "../pages/Users";
import Team from "../pages/Team";

import Profile from "../pages/Profile";

import Reports from "../pages/Reports";
import Analytics from "../pages/Analytics";

import KanbanBoard from "../pages/KanbanBoard";
import CalendarPage from "../pages/CalendarPage";
import TeamChat from "../pages/TeamChat";
import AIInsights from "../pages/AIInsights";
import GanttPage from "../pages/GanttPage";

import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import ActivityFeed from "../pages/ActivityFeed";
import Workspaces from "../pages/Workspaces";
import Subscription from "../pages/Subscription";
import Upgrade from "../pages/Upgrade";

const AuthRedirect = ({ mode = "login" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", {
      replace: true,
    });

    const timer = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("taskflow-auth-mode", {
          detail: {
            mode,
          },
        }),
      );
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [mode, navigate]);

  return null;
};

const AppRoutes = () => {
  const { loading, token, user } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  const authenticated = Boolean(token && user && user._id);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          authenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthRedirect mode="login" />
          )
        }
      />

      <Route
        path="/register"
        element={
          authenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthRedirect mode="register" />
          )
        }
      />

      <Route path="/pricing" element={<Pricing />} />

      <Route path="/home" element={<Navigate to="/" replace />} />

      <Route path="/oauth-success" element={<OAuthSuccess />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
