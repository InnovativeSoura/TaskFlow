import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  BrainCircuit,
  Users,
  CreditCard,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);

    document.body.classList.toggle("dark");
  };

  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>TaskFlow</h2>
      </div>

      <nav>

        <NavLink to="/dashboard" className="nav-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/projects" className="nav-item">
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>

        <NavLink to="/tasks" className="nav-item">
          <CheckSquare size={20} />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/analytics" className="nav-item">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/ai-insights" className="nav-item">
          <BrainCircuit size={20} />
          <span>AI Insights</span>
        </NavLink>

        <NavLink to="/chat" className="nav-item">
          <Users size={20} />
          <span>Team Chat</span>
        </NavLink>

        <NavLink to="/subscription" className="nav-item">
          <CreditCard size={20} />
          <span>Subscription</span>
        </NavLink>

        <NavLink to="/profile" className="nav-item">
          <User size={20} />
          <span>Profile</span>
        </NavLink>

      </nav>

      <div className="sidebar-footer">

        <button
          className="theme-btn"
          onClick={toggleTheme}
        >
          {darkMode ? (
            <>
              <Sun size={18} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={18} />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <button
          className="logout-btn"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;