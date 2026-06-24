import {
BrowserRouter,
Routes,
Route,
Navigate,
} from "react-router-dom";

import AuthPage from "../pages/AuthPage";
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

function AppRoutes() {
const user = JSON.parse(
localStorage.getItem("user")
);

return ( <BrowserRouter> <Routes>
<Route
path="/"
element={<AuthPage />}
/>


    <Route
      path="/dashboard"
      element={
        user ? (
          <Dashboard />
        ) : (
          <Navigate to="/" />
        )
      }
    />

    <Route
      path="/board"
      element={<KanbanBoard />}
    />

    <Route
      path="/analytics"
      element={<Analytics />}
    />

    <Route
      path="/profile"
      element={<Profile />}
    />

    <Route
      path="/activity"
      element={<ActivityFeed />}
    />

    <Route
      path="/chat"
      element={<TeamChat />}
    />

    <Route
      path="/admin"
      element={<AdminDashboard />}
    />

    <Route
      path="/ai-insights"
      element={<AIInsights />}
    />

    <Route
      path="/pricing"
      element={<Pricing />}
    />

    <Route
      path="/subscription"
      element={<Subscription />}
    />

    <Route
      path="/projects"
      element={<Projects />}
    />

    <Route
      path="/tasks"
      element={<Tasks />}
    />
  </Routes>
</BrowserRouter>


);
}

export default AppRoutes;
