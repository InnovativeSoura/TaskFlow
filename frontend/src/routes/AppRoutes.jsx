import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import ProtectedRoute from "../components/ProtectedRoute";

/* ===========================
   AUTH
=========================== */

import AuthPage from "../pages/AuthPage";

/* ===========================
   DASHBOARD
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
   USERS
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
   KANBAN
=========================== */

import KanbanBoard from "../pages/KanbanBoard";

/* ===========================
   CALENDAR
=========================== */

import CalendarPage from "../pages/CalendarPage";

/* ===========================
   CHAT
=========================== */

import TeamChat from "../pages/TeamChat";

/* ===========================
   AI
=========================== */

import AIInsights from "../pages/AIInsights";

/* ===========================
   GANTT
=========================== */

import GanttPage from "../pages/GanttPage";

/* ===========================
   SETTINGS
=========================== */

import Settings from "../pages/Settings";

/* ===========================
   NOTIFICATIONS
=========================== */

import Notifications from "../pages/Notifications";

/* ===========================
   OTHERS
=========================== */

import ActivityFeed from "../pages/ActivityFeed";
import Workspaces from "../pages/Workspaces";
import Subscription from "../pages/Subscription";
import Pricing from "../pages/Pricing";
import Upgrade from "../pages/Upgrade";
import Home from "../pages/Home";

function AppRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>

      {/* Public */}

      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

      <Route path="/login" element={<AuthPage />} />

      <Route path="/pricing" element={<Pricing />} />

      {/* Protected */}

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
        path="/kanban"
        element={
          <ProtectedRoute>
            <KanbanBoard />
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
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityFeed />
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

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}

export default AppRoutes;