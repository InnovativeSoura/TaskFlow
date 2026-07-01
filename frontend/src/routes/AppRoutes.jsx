import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "../pages/AuthPage";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import KanbanBoard from "../pages/KanbanBoard";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import ActivityFeed from "../pages/ActivityFeed";
import TeamChat from "../pages/TeamChat";
import AdminDashboard from "../pages/AdminDashboard";
import AIInsights from "../pages/AIInsights";
import Pricing from "../pages/Pricing";
import Subscription from "../pages/Subscription";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";


// Protected Route Component
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Projects */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      {/* Tasks */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      {/* Kanban */}
      <Route
        path="/board"
        element={
          <ProtectedRoute>
            <KanbanBoard />
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Activity */}
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityFeed />
          </ProtectedRoute>
        }
      />

      {/* Chat */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <TeamChat />
          </ProtectedRoute>
        }
      />

      {/* AI */}
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <AIInsights />
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Pricing */}
      <Route
        path="/pricing"
        element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        }
      />

      {/* Subscription */}
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;