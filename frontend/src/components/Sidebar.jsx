// src/components/Sidebar.jsx

import { useNavigate, NavLink } from "react-router-dom";

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
    FaChevronRight,
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
    collapsed,
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
            ?.split(/\s+/)
            ?.map((word) => word[0])
            ?.join("")
            ?.substring(0, 2)
            ?.toUpperCase() || "TF";

    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = async () => {

        try {

            if (typeof logout === "function") {
                await logout();
            }

        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/", {
            replace: true,
        });

    };

    /* =====================================================
       TOGGLE SIDEBAR
    ===================================================== */

    const toggleSidebar = () => {

        if (typeof onToggle === "function") {
            onToggle();
        }

    };

    /* =====================================================
       RENDER
    ===================================================== */

      return (
    <>
      {/* ================= Overlay ================= */}

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ================= Sidebar ================= */}

      <motion.aside
        className={`sidebar ${
          sidebarOpen ? "expanded" : "collapsed"
        } ${isMobile ? "mobile" : ""}`}
        animate={{
          width: isMobile
            ? sidebarOpen
              ? 260
              : 0
            : sidebarOpen
            ? 260
            : 76,
        }}
        transition={{
          duration: 0.28,
        }}
      >
        {/* ================= Header ================= */}

        <div className="sidebar-header">

          <button
            type="button"
            className="sidebar-brand-button"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <div className="brand-logo">
              TF
            </div>

            {sidebarOpen && (
              <div className="brand-content">
                <strong>TaskFlow</strong>
                <span>Workspace</span>
              </div>
            )}

            {!isMobile && sidebarOpen && (
              <FaChevronLeft className="collapse-arrow" />
            )}

            {!isMobile && !sidebarOpen && (
              <FaChevronRight className="collapse-arrow" />
            )}
          </button>

          {isMobile && sidebarOpen && (
            <button
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          )}

        </div>

        <div className="sidebar-divider" />

        {/* ================= Profile ================= */}

        <NavLink
          to="/profile"
          className="sidebar-user-card"
          onClick={closeMobile}
        >
          <div className="sidebar-avatar-wrapper">

            <div className="sidebar-avatar initials">
              {initials}
            </div>

            <span className="profile-online-dot" />

          </div>

          {sidebarOpen && (
            <>
              <div className="sidebar-user-info">
                <strong>{user?.name}</strong>
                <span>{user?.role}</span>
              </div>

              <FaChevronRight className="profile-arrow" />
            </>
          )}
        </NavLink>

        {sidebarOpen && (
          <div className="sidebar-section-label">
            WORKSPACE
          </div>
        )}

        {/* ================= Menu ================= */}

        <nav className="sidebar-menu">
                  {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              {sidebarOpen && (
                <>
                  <span className="sidebar-link-text">
                    {item.title}
                  </span>

                  <span className="sidebar-active-indicator" />
                </>
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

            {sidebarOpen && (
              <span>
                Logout
              </span>
            )}
          </button>

        </div>

      </motion.aside>

    </>
  );

};

export default Sidebar;