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
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";


/* =========================================================
   NAVIGATION
========================================================= */

const mainMenuItems = [
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
];

const accountMenuItems = [
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
     USER INITIALS
  ======================================================= */

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "TF";


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

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };


  /* =======================================================
     NAVIGATION CLICK
  ======================================================= */

  const handleNavigation = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };


  /* =======================================================
     COLLAPSE
  ======================================================= */

  const toggleSidebar = () => {
    setSidebarOpen(
      (previous) => !previous
    );
  };


  /* =======================================================
     RENDER MENU
  ======================================================= */

  const renderMenu = (
    items,
    sectionTitle
  ) => {
    return (
      <div className="sidebar-nav-section">

        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              className="sidebar-section-title"
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
              {sectionTitle}
            </motion.div>
          )}
        </AnimatePresence>


        <div className="sidebar-nav-list">

          {items.map(
            (
              item,
              index
            ) => (
              <motion.div
                key={item.path}
                className="sidebar-nav-item-wrapper"
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay:
                    index * 0.035,
                  duration: 0.25,
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
                    handleNavigation
                  }
                  className={({
                    isActive,
                  }) =>
                    `sidebar-nav-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >

                  <span className="sidebar-nav-icon">
                    {item.icon}
                  </span>


                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        className="sidebar-nav-text"
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
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>


                  {sidebarOpen && (
                    <span className="sidebar-active-dot" />
                  )}

                </NavLink>

              </motion.div>
            )
          )}

        </div>

      </div>
    );
  };


  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      <AnimatePresence>
        {sidebarOpen && (
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
            ? "sidebar-expanded"
            : "sidebar-collapsed"
        }`}
        animate={{
          width:
            sidebarOpen
              ? 285
              : 88,
        }}
        transition={{
          duration: 0.3,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >

        {/* ===================================================
            TOP BRAND
        =================================================== */}

        <div className="sidebar-top">

          <div className="sidebar-brand">

            <div className="sidebar-brand-logo">
              <span>TF</span>

              <div className="sidebar-logo-glow" />
            </div>


            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="sidebar-brand-content"
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
                    duration: 0.2,
                  }}
                >
                  <h2>
                    TaskFlow
                  </h2>

                  <span>
                    Workspace
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>


          {/* DESKTOP COLLAPSE BUTTON */}

          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={
              toggleSidebar
            }
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
          </button>


          {/* MOBILE CLOSE */}

          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <FaTimes />
          </button>

        </div>


        {/* ===================================================
            PROFILE
        =================================================== */}

        <div className="sidebar-profile">

          <div className="sidebar-profile-avatar">

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
              />
            ) : (
              <span>
                {initials}
              </span>
            )}

            <span className="sidebar-online-dot" />

          </div>


          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="sidebar-profile-info"
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
                <strong>
                  {user?.name ||
                    "Souradipta Patra"}
                </strong>

                <span>
                  {user?.role ||
                    "Admin"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <div className="sidebar-scroll">

          {renderMenu(
            mainMenuItems,
            "Workspace"
          )}

          {renderMenu(
            accountMenuItems,
            "Account"
          )}


          {/* =================================================
              ADMIN CARD
          ================================================= */}

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="sidebar-admin-card"
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

                <div className="sidebar-admin-icon">
                  <FaShieldAlt />
                </div>

                <div className="sidebar-admin-content">
                  <strong>
                    Admin Workspace
                  </strong>

                  <span>
                    Full access enabled
                  </span>
                </div>

                <span className="sidebar-admin-status" />

              </motion.div>
            )}
          </AnimatePresence>

        </div>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="sidebar-footer">

          <button
            type="button"
            className="sidebar-logout"
            onClick={
              handleLogout
            }
            title={
              !sidebarOpen
                ? "Logout"
                : undefined
            }
          >

            <span className="sidebar-logout-icon">
              <FaSignOutAlt />
            </span>


            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
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