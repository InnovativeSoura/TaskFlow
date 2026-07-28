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
   SIDEBAR
========================================================= */

const Sidebar = ({
  sidebarOpen = true,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const auth = useAuth();

  const user = auth?.user;

  const logout =
    typeof auth?.logout === "function"
      ? auth.logout
      : null;

  /* =========================================================
     MOBILE
  ========================================================= */

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= 768
      : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth <= 768;

      setIsMobile(mobile);

      /*
       * When moving from desktop to mobile,
       * don't leave the desktop collapsed state
       * controlling the mobile sidebar.
       */
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

  /* =========================================================
     INITIALS
  ========================================================= */

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

  /* =========================================================
     DESKTOP SIDEBAR TOGGLE
     
     ONLY THE TASKFLOW LOGO CONTROLS THIS.
  ========================================================= */

  const handleLogoClick = () => {
    if (isMobile) {
      return;
    }

    if (
      typeof setSidebarOpen !==
      "function"
    ) {
      console.error(
        "Sidebar: setSidebarOpen is not a function."
      );

      return;
    }

    setSidebarOpen(
      (previous) => !previous
    );
  };

  /* =========================================================
     MOBILE CLOSE
  ========================================================= */

  const closeMobile = () => {
    if (
      isMobile &&
      typeof setSidebarOpen ===
        "function"
    ) {
      setSidebarOpen(false);
    }
  };

  /* =========================================================
     PROFILE
  ========================================================= */

  const handleProfileClick = () => {
    navigate("/profile");

    closeMobile();
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      if (
        typeof logout ===
        "function"
      ) {
        await logout();
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    try {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );
    } catch (error) {
      console.warn(
        "Unable to clear localStorage:",
        error
      );
    }

    navigate("/", {
      replace: true,
    });
  };

  /* =========================================================
     SIDEBAR WIDTH
     
     IMPORTANT:
     Desktop:
       Expanded = 260px
       Collapsed = 84px

     Mobile:
       Open = 270px
       Closed = 0px
  ========================================================= */

  const sidebarWidth = isMobile
    ? sidebarOpen
      ? 270
      : 0
    : sidebarOpen
    ? 260
    : 84;

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
              onClick={() => {
                if (
                  typeof setSidebarOpen ===
                  "function"
                ) {
                  setSidebarOpen(false);
                }
              }}
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
        } ${
          isMobile
            ? "mobile"
            : ""
        }`}
        initial={false}
        animate={{
          width: sidebarWidth,
          x:
            isMobile &&
            !sidebarOpen
              ? -5
              : 0,
        }}
        transition={{
          width: {
            duration: 0.3,
            ease: [
              0.4,
              0,
              0.2,
              1,
            ],
          },
          x: {
            duration: 0.3,
            ease: [
              0.4,
              0,
              0.2,
              1,
            ],
          },
        }}
        style={{
          minWidth: 0,
        }}
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="sidebar-header">

          <button
            type="button"
            className="sidebar-brand-button"
            onClick={
              handleLogoClick
            }
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

            {/* TASKFLOW LOGO */}

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

            {/* TASKFLOW TEXT */}

            <AnimatePresence>
              {sidebarOpen &&
                !isMobile && (
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

          {/* MOBILE CLOSE */}

          {isMobile &&
            sidebarOpen && (
              <button
                type="button"
                className="close-sidebar"
                onClick={() => {
                  if (
                    typeof setSidebarOpen ===
                    "function"
                  ) {
                    setSidebarOpen(false);
                  }
                }}
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

          {/* AVATAR */}

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

          {/* USER INFO */}

          <AnimatePresence>
            {sidebarOpen &&
              !isMobile && (
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

          {/* PROFILE ARROW */}

          {sidebarOpen &&
            !isMobile && (
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
            SECTION LABEL
        =================================================== */}

        <AnimatePresence>
          {sidebarOpen &&
            !isMobile && (
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
                    sidebarOpen
                      ? index *
                        0.035
                      : 0,
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

                  {/* ICON */}

                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

                  {/* TEXT */}

                  <AnimatePresence>
                    {sidebarOpen &&
                      !isMobile && (
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
                          {
                            item.title
                          }
                        </motion.span>
                      )}
                  </AnimatePresence>

                  {/* ACTIVE INDICATOR */}

                  {sidebarOpen &&
                    !isMobile && (
                      <span className="sidebar-active-indicator" />
                    )}

                </NavLink>

              </motion.div>
            )
          )}

        </nav>

        {/* ===================================================
            BOTTOM
        =================================================== */}

        <div className="sidebar-bottom">

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
              {sidebarOpen &&
                !isMobile && (
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