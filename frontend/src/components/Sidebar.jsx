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
  FaShieldAlt,
  FaCircle,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";


// ============================================================
// NAVIGATION
// ============================================================

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


// ============================================================
// SIDEBAR
// ============================================================

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= 768
      : false
  );


  // ==========================================================
  // RESPONSIVE STATE
  // ==========================================================

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth <= 768;

      setIsMobile(mobile);

      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
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
  }, [
    sidebarOpen,
    setSidebarOpen,
  ]);


  // ==========================================================
  // USER INITIALS
  // ==========================================================

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "SP";


  // ==========================================================
  // USER ROLE
  // ==========================================================

  const userRole =
    user?.role ||
    user?.userRole ||
    "Admin";


  // ==========================================================
  // LOGOUT
  // ==========================================================

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


  // ==========================================================
  // MOBILE CLOSE
  // ==========================================================

  const closeMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };


  // ==========================================================
  // COLLAPSE / EXPAND
  // ==========================================================

  const toggleSidebar = () => {
    setSidebarOpen(
      !sidebarOpen
    );
  };


  // ==========================================================
  // WIDTH
  // ==========================================================

  const sidebarWidth = isMobile
    ? sidebarOpen
      ? 285
      : 0
    : sidebarOpen
    ? 285
    : 88;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      <AnimatePresence>
        {isMobile &&
          sidebarOpen && (
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
                duration: 0.25,
              }}
              onClick={() =>
                setSidebarOpen(false)
              }
            />
          )}
      </AnimatePresence>


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <motion.aside
        className={`sidebar ${
          sidebarOpen
            ? "expanded"
            : "collapsed"
        }`}
        animate={{
          width: sidebarWidth,
        }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
        }}
      >

        {/* ====================================================
            TOP BRAND AREA
        ==================================================== */}

        <div className="sidebar-header">

          <NavLink
            to="/dashboard"
            className="sidebar-brand"
            onClick={closeMobile}
          >

            {/* TF LOGO */}

            <motion.div
              className="brand-logo"
              whileHover={{
                scale: 1.06,
                rotate: -2,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <span>TF</span>

              <div className="brand-logo-glow" />
            </motion.div>


            {/* BRAND TEXT */}

            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  className="brand-content"
                  initial={{
                    opacity: 0,
                    x: -12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -12,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <div className="brand-title">
                    TaskFlow
                  </div>

                  <div className="brand-subtitle">
                    Workspace
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </NavLink>


          {/* MOBILE CLOSE */}

          {isMobile &&
            sidebarOpen && (
              <motion.button
                type="button"
                className="close-sidebar"
                onClick={() =>
                  setSidebarOpen(false)
                }
                whileTap={{
                  scale: 0.9,
                }}
              >
                <FaTimes />
              </motion.button>
            )}

        </div>


        {/* ====================================================
            DESKTOP COLLAPSE BUTTON
        ==================================================== */}

        {!isMobile && (
          <motion.button
            type="button"
            className="sidebar-collapse-btn"
            onClick={toggleSidebar}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.92,
            }}
            title={
              sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
          >
            {sidebarOpen ? (
              <FaChevronLeft />
            ) : (
              <FaChevronRight />
            )}
          </motion.button>
        )}


        {/* ====================================================
            USER PROFILE
        ==================================================== */}

        <div
          className={`sidebar-user-card ${
            sidebarOpen
              ? "user-expanded"
              : "user-collapsed"
          }`}
        >

          {/* AVATAR */}

          <div className="sidebar-avatar-wrapper">

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={
                  user?.name ||
                  "User avatar"
                }
                className="sidebar-avatar"
              />
            ) : (
              <div className="sidebar-avatar initials">
                {initials}
              </div>
            )}

            {/* ONLINE STATUS */}

            <span className="user-online-dot">
              <FaCircle />
            </span>

          </div>


          {/* USER DETAILS */}

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="sidebar-user-info"
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
                  duration: 0.25,
                }}
              >

                <div className="user-name-row">

                  <h4>
                    {user?.name ||
                      "Souradipta Patra"}
                  </h4>

                  <span className="user-status-dot" />

                </div>

                <div className="user-role-row">

                  <FaShieldAlt />

                  <span>
                    {userRole}
                  </span>

                  <span className="admin-badge">
                    ADMIN
                  </span>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>


        {/* ====================================================
            NAVIGATION LABEL
        ==================================================== */}

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
              <span>WORKSPACE</span>

              <div />
            </motion.div>
          )}
        </AnimatePresence>


        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <nav className="sidebar-menu">

          {menuItems.map(
            (item, index) => (
              <motion.div
                key={item.path}
                className="sidebar-menu-item"
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay:
                    index * 0.035,
                  duration: 0.3,
                }}
              >

                <NavLink
                  to={item.path}
                  title={item.title}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    isActive
                      ? "active"
                      : ""
                  }
                >

                  {/* ACTIVE INDICATOR */}

                  <span className="nav-active-line" />


                  {/* ICON */}

                  <div className="sidebar-icon">
                    {item.icon}
                  </div>


                  {/* LABEL */}

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


                  {/* NOTIFICATION DOT */}

                  {item.title ===
                    "Notifications" && (
                    <span className="notification-dot" />
                  )}

                </NavLink>

              </motion.div>
            )
          )}

        </nav>


        {/* ====================================================
            ADMIN SECTION
        ==================================================== */}

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="sidebar-admin-section"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 10,
              }}
            >

              <div className="admin-section-icon">
                <FaShieldAlt />
              </div>

              <div className="admin-section-content">

                <strong>
                  Admin Workspace
                </strong>

                <span>
                  Manage your team
                </span>

              </div>

              <span className="admin-live-dot" />

            </motion.div>
          )}
        </AnimatePresence>


        {/* ====================================================
            SIDEBAR FOOTER
        ==================================================== */}

        <div className="sidebar-footer">

          <motion.button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            title="Logout"
          >

            <span className="logout-icon">
              <FaSignOutAlt />
            </span>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="logout-content"
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
                  <span>
                    Sign out
                  </span>

                  <small>
                    End current session
                  </small>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.button>

        </div>

      </motion.aside>
    </>
  );
};

export default Sidebar;