import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaColumns,
  FaUsers,
  FaChartBar,
  FaUserCircle,
  FaCog,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

  };

  return (
    <aside className="sidebar">
      {/* Logo */}

      <div className="sidebar-logo">
        <h2>TaskFlow</h2>

        {user && (
          <div className="sidebar-user">
            <p className="sidebar-name">{user.name}</p>
            <span className="sidebar-role">{user.role}</span>
          </div>
        )}
      </div>

      {/* Navigation */}

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaProjectDiagram />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaTasks />
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/kanban"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaColumns />
          <span>Kanban Board</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaUsers />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaBell />
          <span>Notifications</span>
        </NavLink>
      </nav>

      {/* Footer */}

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;