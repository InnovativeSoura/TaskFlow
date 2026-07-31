// src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaColumns,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaChevronLeft,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";

/* =========================================================
   NAVIGATION
========================================================= */

const menuItems = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    path: "/dashboard",
  },
  {
    title: "Projects",
    icon: <FaProjectDiagram />,
    path: "/projects",
  },
  {
    title: "Tasks",
    icon: <FaTasks />,
    path: "/tasks",
  },
  {
    title: "Kanban",
    icon: <FaColumns />,
    path: "/kanban",
  },
  {
    title: "Users",
    icon: <FaUsers />,
    path: "/users",
  },
  {
    title: "Reports",
    icon: <FaChartBar />,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: <FaCog />,
    path: "/settings",
  },
  {
    title: "Notifications",
    icon: <FaBell />,
    path: "/notifications",
  },
];
/* =========================================================
   SIDEBAR COMPONENT
========================================================= */

const Sidebar = ({
  collapsed = false,
  onToggle,
}) => {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  /* =====================================================
     USER INITIALS
  ===================================================== */

  const initials =
    user?.name
      ?.trim()
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";

  /* =====================================================
     TOGGLE SIDEBAR
  ===================================================== */

  const handleToggle = () => {

    if (typeof onToggle === "function") {
      onToggle();
    }

  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {

    try {

      if (logout) {
        await logout();
      }

    } catch (err) {

      console.error(
        "Logout Error:",
        err
      );

    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });

  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <motion.aside
      className={`sidebar ${
        collapsed
          ? "collapsed"
          : "expanded"
      }`}
      initial={false}
      animate={{
        width: collapsed
          ? 64
          : 220,
      }}
      transition={{
        duration: 0.28,
      }}
    >
            {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="sidebar-header">

        <button
          type="button"
          className="sidebar-brand-button"
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >

          {/* Logo */}

          <motion.div
            className="brand-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            TF
          </motion.div>

          {/* Brand */}

          {!collapsed && (

            <div className="brand-content">

              <strong>
                TaskFlow
              </strong>

              <span>
                Workspace
              </span>

            </div>

          )}

          {/* Collapse Icon */}

          {!collapsed && (

            <FaChevronLeft
              className="collapse-arrow"
            />

          )}

        </button>

      </div>

      <div className="sidebar-divider" />

      {/* =====================================================
          USER PROFILE
      ===================================================== */}

      <NavLink
        to="/profile"
        className="sidebar-user-card"
      >

        <div className="sidebar-avatar-wrapper">

          {user?.avatar ? (

            <img
              src={user.avatar}
              alt={user.name}
              className="sidebar-avatar"
            />

          ) : (

            <div className="sidebar-avatar">
              {initials}
            </div>

          )}

          <span className="profile-online-dot" />

        </div>

        {!collapsed && (

          <>

            <div className="sidebar-user-info">

              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role || "Member"}
              </span>

            </div>

          </>

        )}

      </NavLink>

      {/* =====================================================
          SECTION LABEL
      ===================================================== */}

      {!collapsed && (

        <div className="sidebar-section-label">
          WORKSPACE
        </div>

      )}

      {/* =====================================================
          MENU
      ===================================================== */}

      <nav className="sidebar-menu">
                {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >

            {/* ================= Icon ================= */}

            <span className="sidebar-icon">
              {item.icon}
            </span>

            {/* ================= Text ================= */}

            {!collapsed && (

              <span className="sidebar-link-text">
                {item.title}
              </span>

            )}

            {/* ================= Active Indicator ================= */}

            {!collapsed && (

              <span className="sidebar-active-indicator" />

            )}

          </NavLink>

        ))}

      </nav>
            {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >

          <span className="logout-icon">
            <FaSignOutAlt />
          </span>

          {!collapsed && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>

    </motion.aside>

  );

};

export default Sidebar;