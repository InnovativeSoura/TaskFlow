// src/components/Sidebar.jsx

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

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
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";

/* =========================================================
   SIDEBAR NAVIGATION
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
   SIDEBAR
========================================================= */

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  /* =======================================================
     MOBILE STATE
  ======================================================= */

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  /* =======================================================
     RESPONSIVE CHECK
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth <= 768;

      setIsMobile(mobile);

      /*
       * On desktop we keep the current
       * sidebar state.
       *
       * On mobile the sidebar is closed
       * automatically when moving from
       * desktop-sized viewport.
       */
      if (!mobile) {
        return;
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
  }, []);

  /* =======================================================
     USER INITIALS
  ======================================================= */

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.filter(Boolean)
      ?.map(
        (name) =>
          name?.[0] || ""
      )
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";

  /* =======================================================
     DESKTOP SIDEBAR TOGGLE

     IMPORTANT:
     The TaskFlow logo is the ONLY desktop
     collapse / expand control.
  ======================================================= */

  const handleLogoClick = () => {
    if (isMobile) {
      return;
    }

    setSidebarOpen(
      (previous) => !previous
    );
  };

  /* =======================================================
     MOBILE CLOSE
  ======================================================= */

  const closeMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  /* =======================================================
     PROFILE CLICK
  ======================================================= */

  const handleProfileClick = () => {
    navigate("/profile");

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/", {
      replace: true,
    });
  };

  /* =======================================================
     SIDEBAR WIDTH
     
     These values must match the layout CSS.
     
     Desktop:
       Expanded = 260px
       Collapsed = 84px

     Mobile:
       Open = 270px
       Closed = 0px
  ======================================================= */

  const sidebarWidth = isMobile
    ? sidebarOpen
      ? 270
      : 0
    : sidebarOpen
    ? 260
    : 84;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

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

          IMPORTANT FIX:
          z-index is intentionally higher than the navbar
          so the TaskFlow logo cannot be visually covered
          by the navbar layer.

          The matching Sidebar.css below also makes the
          sidebar occupy its own fixed column.
      ===================================================== */}

      <motion.aside
        className={`sidebar ${
          sidebarOpen
            ? "expanded"
            : "collapsed"
        } ${
          isMobile
            ? "mobile"
            : ""
        }`}
        animate={{
          width: sidebarWidth,
        }}
        initial={false}
        transition={{
          duration: 0.3,
          ease: [
            0.4,
            0,
            0.2,
            1,
          ],
        }}
        style={{
          zIndex: isMobile
            ? 1200
            : 1100,
        }}
      >

        {/* ===================================================
            HEADER / TASKFLOW LOGO
        =================================================== */}

        <div className="sidebar-header">

          {/* =================================================
              TASKFLOW BRAND BUTTON
              
              Desktop:
              Click = collapse / expand

              Mobile:
              Does nothing because mobile has a
              dedicated close button.
          ================================================= */}

          <button
            type="button"
            className="sidebar-brand-button"
            onClick={handleLogoClick}
            title={
              isMobile
                ? "TaskFlow"
                : sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
            aria-label={
              isMobile
                ? "TaskFlow"
                : sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
          >

            {/* =================================================
                TASKFLOW LOGO
            ================================================= */}

            <motion.div
              className="brand-logo"
              whileHover={{
                scale: 1.06,
              }}
              whileTap={{
                scale: 0.94,
              }}
            >
              <span>
                TF
              </span>
            </motion.div>

            {/* =================================================
                TASKFLOW TEXT
            ================================================= */}

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

          {/* =================================================
              MOBILE CLOSE BUTTON

              This is ONLY for mobile.
          ================================================= */}

          {isMobile &&
            sidebarOpen && (
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
            DIVIDER
        =================================================== */}

        <div className="sidebar-divider" />

        {/* ===================================================
            USER PROFILE
        =================================================== */}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-user-card ${
              isActive
                ? "profile-active"
                : ""
            }`
          }
          onClick={
            handleProfileClick
          }
          title={
            !sidebarOpen
              ? `Open ${
                  user?.name ||
                  "profile"
                }`
              : undefined
          }
        >

          {/* =================================================
              AVATAR
          ================================================= */}

          <div className="sidebar-avatar-wrapper">

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

            <span className="profile-online-dot" />

          </div>

          {/* =================================================
              USER INFORMATION
          ================================================= */}

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
                transition={{
                  duration: 0.18,
                }}
              >

                <strong>
                  {user?.name ||
                    "User"}
                </strong>

                <span>
                  {user?.role ||
                    "Member"}
                </span>

              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              PROFILE ARROW
          ================================================= */}

          {sidebarOpen && (
            <motion.span
              className="profile-arrow"
              initial={{
                opacity: 0,
                x: -4,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -4,
              }}
            >
              <FaChevronRight />
            </motion.span>
          )}

        </NavLink>

        {/* ===================================================
            WORKSPACE LABEL
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
                    index *
                    0.035,
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
                  className={({ isActive }) =>
                    isActive
                      ? "active"
                      : ""
                  }
                >

                  {/* =================================================
                      ICON
                  ================================================= */}

                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

                  {/* =================================================
                      TEXT
                  ================================================= */}

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

                  {/* =================================================
                      ACTIVE INDICATOR
                  ================================================= */}

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

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            className="logout-btn"
            onClick={
              handleLogout
            }
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