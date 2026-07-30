import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaCog,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaTasks,
  FaUserCircle,
  FaUsers,
  FaProjectDiagram,
  FaHome,
  FaTimes,
} from "react-icons/fa";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import NotificationBell from "./NotificationBell";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";

const Navbar = ({
  sidebarCollapsed = false,
  onSidebarToggle,
}) => {
  const navigate = useNavigate();

  const location = useLocation();

  const auth = useAuth();

  const user = auth?.user;

  const logout =
    typeof auth?.logout === "function"
      ? auth.logout
      : null;

  const menuRef = useRef(null);

  /* ==========================================
      PROFILE MENU
  ========================================== */

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  /* ==========================================
      MOBILE NAVIGATION
  ========================================== */

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  /* ==========================================
      THEME
  ========================================== */

  const getInitialTheme = () => {
    try {
      const savedTheme =
        localStorage.getItem("theme");

      if (savedTheme === "dark") return true;

      if (savedTheme === "light") return false;

      return (
        window.matchMedia &&
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
      );
    } catch {
      return false;
    }
  };

  const [
    darkMode,
    setDarkMode,
  ] = useState(getInitialTheme);

  /* ==========================================
      USER INITIALS
  ========================================== */

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map(
        (part) => part[0]
      )
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";
        /* ==========================================
      APPLY THEME
  ========================================== */

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const theme = darkMode
      ? "dark"
      : "light";

    html.setAttribute(
      "data-theme",
      theme
    );

    html.classList.toggle(
      "dark-theme",
      darkMode
    );

    html.classList.toggle(
      "light-theme",
      !darkMode
    );

    body.classList.toggle(
      "dark-theme",
      darkMode
    );

    body.classList.toggle(
      "light-theme",
      !darkMode
    );

    try {
      localStorage.setItem(
        "theme",
        theme
      );
    } catch (error) {
      console.warn(
        "Unable to save theme:",
        error
      );
    }

    window.dispatchEvent(
      new CustomEvent(
        "taskflow-theme-change",
        {
          detail: {
            theme,
            darkMode,
          },
        }
      )
    );
  }, [darkMode]);

  /* ==========================================
      SYNC THEME
  ========================================== */

  useEffect(() => {
    const handleStorage = (
      event
    ) => {
      if (
        event.key !== "theme"
      )
        return;

      if (
        event.newValue ===
        "dark"
      ) {
        setDarkMode(true);
      }

      if (
        event.newValue ===
        "light"
      ) {
        setDarkMode(false);
      }
    };

    const handleThemeChange = (
      event
    ) => {
      const theme =
        event.detail?.theme;

      if (theme === "dark") {
        setDarkMode(true);
      }

      if (
        theme === "light"
      ) {
        setDarkMode(false);
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "taskflow-theme-change",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "taskflow-theme-change",
        handleThemeChange
      );
    };
  }, []);

  /* ==========================================
      CLOSE PROFILE MENU
  ========================================== */

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setShowProfileMenu(
          false
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* ==========================================
      CLOSE MENUS ON ROUTE CHANGE
  ========================================== */

  useEffect(() => {
    setShowProfileMenu(
      false
    );

    setMobileMenu(false);
  }, [location.pathname]);

  /* ==========================================
      TOGGLE THEME
  ========================================== */

  const toggleTheme = () => {
    setDarkMode(
      (previous) =>
        !previous
    );
  };

  /* ==========================================
      NAVIGATION
  ========================================== */

  const handleNavigate = (
    path
  ) => {
    if (!path) return;

    navigate(path);

    setShowProfileMenu(
      false
    );

    setMobileMenu(false);
  };

  /* ==========================================
      LOGOUT
  ========================================== */

  const handleLogout =
    async () => {
      try {
        if (logout) {
          await logout();
        }
      } catch (error) {
        console.error(
          "Logout Error:",
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

      setShowProfileMenu(
        false
      );

      setMobileMenu(false);

      navigate("/", {
        replace: true,
      });
    };
      /* ==========================================
      RENDER
  ========================================== */

  return (
    <header
      className={`navbar ${
        darkMode
          ? "navbar-dark"
          : "navbar-light"
      } ${
        sidebarCollapsed
          ? "navbar-sidebar-collapsed"
          : "navbar-sidebar-expanded"
      }`}
    >
      {/* ======================================
          LEFT
      ====================================== */}

      <div className="navbar-left">

        {/* SIDEBAR TOGGLE */}

        <motion.button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onSidebarToggle}
          aria-label="Toggle Sidebar"
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.92,
          }}
        >
          <FaBars />
        </motion.button>

        {/* DESKTOP NAVIGATION */}

        <nav
          className={`navbar-links ${
            mobileMenu
              ? "active"
              : ""
          }`}
        >
          {/* DASHBOARD */}

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <FaHome />

            <span>
              Dashboard
            </span>
          </NavLink>

          {/* PROJECTS */}

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <FaProjectDiagram />

            <span>
              Projects
            </span>
          </NavLink>

          {/* TASKS */}

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <FaTasks />

            <span>
              Tasks
            </span>
          </NavLink>

          {/* USERS */}

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <FaUsers />

            <span>
              Team
            </span>
          </NavLink>

        </nav>

      </div>

      {/* ======================================
          RIGHT
      ====================================== */}

      <div className="navbar-right">
                {/* ======================================
            THEME TOGGLE
        ====================================== */}

        <motion.button
          type="button"
          className={`icon-btn theme-toggle ${
            darkMode
              ? "theme-active"
              : ""
          }`}
          onClick={toggleTheme}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          whileHover={{
            scale: 1.06,
            rotate: darkMode ? 5 : -5,
          }}
          whileTap={{
            scale: 0.92,
          }}
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            {darkMode ? (
              <motion.span
                key="sun"
                className="theme-icon"
                initial={{
                  opacity: 0,
                  rotate: -90,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: 90,
                  scale: 0.5,
                }}
              >
                <FaSun />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                className="theme-icon"
                initial={{
                  opacity: 0,
                  rotate: 90,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: -90,
                  scale: 0.5,
                }}
              >
                <FaMoon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* ======================================
            NOTIFICATIONS
        ====================================== */}

        <NotificationBell />

        {/* ======================================
            SETTINGS
        ====================================== */}

        <motion.button
          type="button"
          className="icon-btn"
          aria-label="Settings"
          title="Settings"
          onClick={() =>
            handleNavigate("/settings")
          }
          whileHover={{
            scale: 1.05,
            rotate: 5,
          }}
          whileTap={{
            scale: 0.92,
          }}
        >
          <FaCog />
        </motion.button>

        {/* ======================================
            PROFILE
        ====================================== */}

        <div
          className="profile-wrapper"
          ref={menuRef}
        >
          <motion.button
            type="button"
            className={`profile-trigger ${
              darkMode
                ? "profile-trigger-dark"
                : "profile-trigger-light"
            }`}
            aria-label="Open profile menu"
            aria-expanded={showProfileMenu}
            onClick={() =>
              setShowProfileMenu(
                (prev) => !prev
              )
            }
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.94,
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={
                  user?.name ||
                  "User avatar"
                }
                className="avatar"
              />
            ) : (
              <div className="avatar initials">
                {initials}
              </div>
            )}
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className={`profile-dropdown ${
                  darkMode
                    ? "dropdown-dark"
                    : "dropdown-light"
                }`}
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {/* HEADER */}

                <div className="dropdown-header">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="dropdown-avatar"
                    />
                  ) : (
                    <div className="dropdown-avatar initials">
                      {initials}
                    </div>
                  )}

                  <div className="dropdown-user-info">
                    <h4>
                      {user?.name ||
                        "User"}
                    </h4>

                    <small>
                      {user?.role ||
                        "Member"}
                    </small>
                  </div>
                </div>

                {/* PROFILE */}

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      "/profile"
                    )
                  }
                >
                  <FaUserCircle />

                  <span>
                    Profile
                  </span>
                </button>

                {/* SETTINGS */}

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      "/settings"
                    )
                  }
                >
                  <FaCog />

                  <span>
                    Settings
                  </span>
                </button>

                <hr />

                {/* LOGOUT */}

                <button
                  type="button"
                  className="logout-menu-btn"
                  onClick={
                    handleLogout
                  }
                >
                  <FaSignOutAlt />

                  <span>
                    Logout
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* ======================================
            MOBILE NAVIGATION TOGGLE
        ====================================== */}

        <motion.button
          type="button"
          className="mobile-toggle"
          aria-label={
            mobileMenu
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenu}
          onClick={() =>
            setMobileMenu(
              (previous) => !previous
            )
          }
          whileTap={{
            scale: 0.9,
          }}
        >
          {mobileMenu ? (
            <FaTimes />
          ) : (
            <FaTasks />
          )}
        </motion.button>

      </div>

      {/* ==========================================
          MOBILE NAVIGATION OVERLAY
      ========================================== */}

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="navbar-mobile-overlay"
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
          >
            <motion.div
              className={`navbar-mobile-menu ${
                darkMode
                  ? "mobile-dark"
                  : "mobile-light"
              }`}
              initial={{
                y: -20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <NavLink
                to="/dashboard"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                <FaHome />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/projects"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                <FaProjectDiagram />
                <span>Projects</span>
              </NavLink>

              <NavLink
                to="/tasks"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                <FaTasks />
                <span>Tasks</span>
              </NavLink>

              <NavLink
                to="/users"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                <FaUsers />
                <span>Team</span>
              </NavLink>

              <NavLink
                to="/settings"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                <FaCog />
                <span>Settings</span>
              </NavLink>

              <button
                type="button"
                className="mobile-logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;