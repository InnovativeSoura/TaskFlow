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

import "./Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <aside className="sidebar">

      <div className="sidebar-logo">

        <h2>TaskFlow</h2>

      </div>

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

      {/* ==========================
          LOGOUT
      ========================== */}

      <div className="sidebar-footer">

        <button
          className="logout-btn"
          onClick={logout}
        >

          <FaSignOutAlt />

          <span>Logout</span>

        </button>

      </div>

    </aside>

  );

}

export default Sidebar;