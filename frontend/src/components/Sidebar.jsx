// src/components/Sidebar.jsx

import { useState, useEffect } from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaColumns,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";

/* =========================================================
   CONSTANTS
========================================================= */

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 64;
const MOBILE_BREAKPOINT = 768;

/* =========================================================
   MENU ITEMS
========================================================= */

const menuItems = [
  {
    title: "Dashboard",
    icon: <FaHome />,
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

  /* ======================================================
     MOBILE
  ====================================================== */

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT
  );

  useEffect(() => {

    const handleResize = () => {

      const mobile =
        window.innerWidth <= MOBILE_BREAKPOINT;

      setIsMobile(mobile);

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  /* ======================================================
     USER INITIALS
  ====================================================== */

  const initials =
    user?.name
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";

  /* ======================================================
     SIDEBAR TOGGLE
  ====================================================== */

  const toggleSidebar = () => {

    if (typeof onToggle === "function") {
      onToggle();
    }

  };

  /* ======================================================
     MOBILE CLOSE
  ====================================================== */

  const closeMobile = () => {

    if (isMobile && !collapsed) {
      toggleSidebar();
    }

  };

  /* ======================================================
     PROFILE
  ====================================================== */

  const handleProfileClick = () => {

    navigate("/profile");

    closeMobile();

  };

  /* ======================================================
     LOGOUT
  ====================================================== */

  const handleLogout = async () => {

    try {

      if (typeof logout === "function") {
        await logout();
      }

    } catch (err) {

      console.error(err);

    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });

  };
    /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      {/* ==============================================
          MOBILE OVERLAY
      ============================================== */}

      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* ==============================================
          SIDEBAR
      ============================================== */}

      <motion.aside
        className={`sidebar ${
          collapsed ? "collapsed" : "expanded"
        } ${isMobile ? "mobile" : ""}`}
        animate={{
          width: isMobile
            ? collapsed
              ? 0
              : EXPANDED_WIDTH
            : collapsed
            ? COLLAPSED_WIDTH
            : EXPANDED_WIDTH,
        }}
        transition={{
          duration: 0.28,
          ease: [0.4, 0, 0.2, 1],
        }}
      >

        {/* ==========================================
            TOP
        ========================================== */}

        <div className="sidebar-top">

          {/* Logo */}

          <button
            className="sidebar-logo-button"
            onClick={toggleSidebar}
            type="button"
            aria-label="Toggle Sidebar"
          >

            <motion.div
              className="sidebar-logo"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              TF
            </motion.div>

            {!collapsed && (
              <motion.div
                className="sidebar-brand"
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                }}
              >
                <h3>TaskFlow</h3>
                <span>Workspace</span>
              </motion.div>
            )}

            {!isMobile && !collapsed && (
              <div className="sidebar-collapse-btn">
                <FaChevronLeft />
              </div>
            )}

          </button>

          {/* Avatar */}

          <button
            className="sidebar-profile"
            onClick={handleProfileClick}
            type="button"
          >

            <div className="sidebar-avatar">

              {user?.avatar ? (

                <img
                  src={user.avatar}
                  alt={user.name}
                />

              ) : (

                <span>{initials}</span>

              )}

            </div>

            {!collapsed && (

              <div className="sidebar-user">

                <strong>
                  {user?.name || "User"}
                </strong>

                <small>
                  {user?.role || "Member"}
                </small>

              </div>

            )}

          </button>

        </div>

        {/* ==========================================
            MENU
        ========================================== */}

        <nav className="sidebar-menu">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={closeMobile}
              title={collapsed ? item.title : ""}
              className={({ isActive }) =>
                isActive
                  ? "active"
                  : ""
              }
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              {!collapsed && (
                <span className="sidebar-text">
                  {item.title}
                </span>
              )}

              {!collapsed && (
                <span className="sidebar-arrow">
                  <FaChevronRight />
                </span>
              )}

            </NavLink>

          ))}

        </nav>
                {/* ==========================================
            BOTTOM
        ========================================== */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >

            <span className="logout-icon">
              <FaSignOutAlt />
            </span>

            {!collapsed && (
              <span className="logout-text">
                Logout
              </span>
            )}

          </button>

        </div>

        {/* ==========================================
            MOBILE CLOSE
        ========================================== */}

        {isMobile && !collapsed && (

          <button
            className="mobile-close-btn"
            onClick={toggleSidebar}
            type="button"
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>

        )}

      </motion.aside>
    </>
  );

};

export default Sidebar;