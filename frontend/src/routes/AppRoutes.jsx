import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function AppRoutes() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<AuthPage />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/board" element={<KanbanBoard />} />
<Route path="/analytics" element={<Analytics />} />
<Route path="/profile" element={<Profile />} />
<Route path="/activity" element={<ActivityFeed />} />
<Route path="/chat" element={<TeamChat />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/ai-insights" element={<AIInsights />} />
<Route path="/pricing" element={<Pricing />} /> </Routes> </BrowserRouter>
);
}

export default AppRoutes;
