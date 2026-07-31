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
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";

/* ==========================================================
   CONSTANTS
========================================================== */

const MOBILE_BREAKPOINT = 768;

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

/* ==========================================================
   COMPONENT
========================================================== */

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= MOBILE_BREAKPOINT
      : false
  );

  /* ======================================================
     RESPONSIVE
  ====================================================== */

  useEffect(() => {

    const handleResize = () => {

      const mobile =
        window.innerWidth <= MOBILE_BREAKPOINT;

      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      }

    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, [setSidebarOpen]);

  /* ======================================================
     USER INITIALS
  ====================================================== */

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map((part) => part[0])
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";

  /* ======================================================
     SIDEBAR TOGGLE
  ====================================================== */

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /* ======================================================
     MOBILE CLOSE
  ====================================================== */

  const closeMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
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

    } catch (error) {

      console.error(error);

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
            {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <motion.aside
        className={`sidebar ${
          sidebarOpen ? "expanded" : "collapsed"
        } ${isMobile ? "mobile" : ""}`}
        initial={false}
        animate={{
          width: isMobile
            ? sidebarOpen
              ? 260
              : 0
            : sidebarOpen
            ? 260
            : 84,
        }}
        transition={{
          duration: 0.28,
          ease: [0.4, 0, 0.2, 1],
        }}
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="sidebar-header">

          <button
            type="button"
            className="sidebar-brand-button"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen
                ? "Collapse Sidebar"
                : "Expand Sidebar"
            }
          >

            {/* ==========================================
                TF LOGO
            ========================================== */}

            <motion.div
              className="brand-logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>TF</span>
            </motion.div>

            {/* ==========================================
                BRAND TEXT
            ========================================== */}

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="brand-content"
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -8,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                >
                  <strong>TaskFlow</strong>

                  <span>
                    Workspace
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ==========================================
                DESKTOP COLLAPSE ICON
            ========================================== */}

            {!isMobile && sidebarOpen && (
              <motion.div
                className="sidebar-collapse-icon"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
              >
                <FaChevronLeft />
              </motion.div>
            )}

          </button>

          {/* ==========================================
              MOBILE CLOSE
          ========================================== */}

          {isMobile && sidebarOpen && (
            <button
              type="button"
              className="close-sidebar"
              onClick={closeMobile}
            >
              <FaTimes />
            </button>
          )}

        </div>

        <div className="sidebar-divider" />

        {/* ==================================================
            PROFILE CARD
        ================================================== */}

        <NavLink
          to="/profile"
          onClick={handleProfileClick}
          className={({ isActive }) =>
            `sidebar-user-card ${
              isActive
                ? "profile-active"
                : ""
            }`
          }
        >

          <div className="sidebar-avatar-wrapper">

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="sidebar-avatar"
              />
            ) : (
              <div className="sidebar-avatar initials">
                {initials}
              </div>
            )}

            <span className="profile-online-dot" />

          </div>

          <AnimatePresence>

            {sidebarOpen && (

              <motion.div
                className="sidebar-user-info"
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -8,
                }}
              >

                <strong>
                  {user?.name || "User"}
                </strong>

                <span>
                  {user?.role || "Member"}
                </span>

              </motion.div>

            )}

          </AnimatePresence>

          {sidebarOpen && (
            <span className="profile-arrow">
              <FaChevronRight />
            </span>
          )}

        </NavLink>

        {/* ==================================================
            SECTION LABEL
        ================================================== */}

        <AnimatePresence>

          {sidebarOpen && (

            <motion.div
              className="sidebar-section-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              WORKSPACE
            </motion.div>

          )}

        </AnimatePresence>
                {/* ======================================================
            NAVIGATION
        ====================================================== */}

        <nav className="sidebar-menu">

          {menuItems.map((item, index) => (

            <motion.div
              key={item.path}
              initial={{
                opacity: 0,
                x: -12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.04,
                duration: 0.25,
              }}
            >

              <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={closeMobile}
                title={
                  !sidebarOpen
                    ? item.title
                    : undefined
                }
                className={({ isActive }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >

                {/* ==============================
                    ICON
                ============================== */}

                <span className="sidebar-icon">
                  {item.icon}
                </span>

                {/* ==============================
                    LINK TEXT
                ============================== */}

                <AnimatePresence>

                  {sidebarOpen && (

                    <motion.span
                      className="sidebar-link-text"
                      initial={{
                        opacity: 0,
                        x: -6,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -6,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                    >
                      {item.title}
                    </motion.span>

                  )}

                </AnimatePresence>

                {/* ==============================
                    ACTIVE INDICATOR
                ============================== */}

                {sidebarOpen && (
                  <span className="sidebar-active-indicator" />
                )}

              </NavLink>

            </motion.div>

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
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <span className="logout-icon">
            <FaSignOutAlt />
          </span>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>

    {/* ==========================================
        MOBILE OVERLAY
    ========================================== */}

    <AnimatePresence>
      {isMobile && sidebarOpen && (
        <motion.div
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </AnimatePresence>
  </>
);

};

export default Sidebar;