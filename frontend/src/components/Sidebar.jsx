// src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

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
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";

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
    title: "Profile",
    icon: <FaUserCircle />,
    path: "/profile",
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

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  /* =========================================================
     RESPONSIVE CHECK
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      /*
        On desktop, keep sidebar state controlled
        by the user.

        On mobile, sidebar is hidden by default.
      */
    };

    handleResize();

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

  /* =========================================================
     INITIALS
  ========================================================= */

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "TF";

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  /* =========================================================
     COLLAPSE / EXPAND
  ========================================================= */

  const toggleSidebar = () => {
    if (isMobile) {
      return;
    }

    setSidebarOpen((previous) => !previous);
  };

  /* =========================================================
     MOBILE CLOSE
  ========================================================= */

  const closeMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={() =>
              setSidebarOpen(false)
            }
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <motion.aside
        className={`sidebar ${
          sidebarOpen
            ? "expanded"
            : "collapsed"
        } ${isMobile ? "mobile" : ""}`}
        animate={{
          width: isMobile
            ? sidebarOpen
              ? 270
              : 0
            : sidebarOpen
            ? 260
            : 84,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* ===================================================
            BRAND / COLLAPSE CONTROL
        =================================================== */}

        <div className="sidebar-header">
          <button
            type="button"
            className="sidebar-brand-button"
            onClick={toggleSidebar}
            title={
              sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
            aria-label={
              sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
          >
            <motion.div
              className="brand-logo"
              whileHover={{
                scale: 1.06,
              }}
              whileTap={{
                scale: 0.94,
              }}
            >
              <span>TF</span>
            </motion.div>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="brand-content"
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
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <strong>
                    TaskFlow
                  </strong>

                  <span>
                    Workspace
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile close button */}

          {isMobile && sidebarOpen && (
            <button
              type="button"
              className="close-sidebar"
              onClick={() =>
                setSidebarOpen(false)
              }
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* ===================================================
            WORKSPACE DIVIDER
        =================================================== */}

        <div className="sidebar-divider" />

        {/* ===================================================
            USER PROFILE
        =================================================== */}

        <div className="sidebar-user-card">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-avatar initials">
              {initials}
            </div>
          )}

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
        </div>

        {/* ===================================================
            NAVIGATION LABEL
        =================================================== */}

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="sidebar-section-label"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              WORKSPACE
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="sidebar-menu">
          {menuItems.map(
            (item, index) => (
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
                  delay:
                    index * 0.035,
                }}
              >
                <NavLink
                  to={item.path}
                  title={
                    !sidebarOpen
                      ? item.title
                      : undefined
                  }
                  onClick={
                    closeMobile
                  }
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? "active"
                      : ""
                  }
                >
                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

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
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {sidebarOpen && (
                    <span className="sidebar-active-indicator" />
                  )}
                </NavLink>
              </motion.div>
            )
          )}
        </nav>

        {/* ===================================================
            BOTTOM AREA
        =================================================== */}

        <div className="sidebar-bottom">
          {/* Collapse hint */}

          {!isMobile && (
            <button
              type="button"
              className="sidebar-collapse-button"
              onClick={toggleSidebar}
              title={
                sidebarOpen
                  ? "Collapse sidebar"
                  : "Expand sidebar"
              }
            >
              <span className="collapse-icon">
                {sidebarOpen ? (
                  <FaChevronLeft />
                ) : (
                  <FaChevronRight />
                )}
              </span>

              {sidebarOpen && (
                <span>
                  Collapse sidebar
                </span>
              )}
            </button>
          )}

          {/* Logout */}

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            title={
              !sidebarOpen
                ? "Logout"
                : undefined
            }
          >
            <span className="logout-icon">
              <FaSignOutAlt />
            </span>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{
                    opacity: 0,
                    x: -5,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -5,
                  }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;