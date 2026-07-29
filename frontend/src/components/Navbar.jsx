// src/components/Navbar.jsx

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

/* =========================================================
   TASKFLOW PREMIUM NAVBAR

   SIDEBAR BEHAVIOUR
   ---------------------------------------------------------
   Navbar listens to:

   taskflow-sidebar-change

   emitted by Sidebar.jsx.

   This allows Navbar to automatically adjust when the
   sidebar changes between:

   Expanded  -> 260px
   Collapsed -> 76px
   Mobile    -> 0px / 260px
========================================================= */

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAuth();

  const user = auth?.user;

  const logout =
    typeof auth?.logout === "function"
      ? auth.logout
      : null;

  const menuRef = useRef(null);

  /* =========================================================
     SIDEBAR STATE
  ========================================================= */

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(
    typeof document !== "undefined"
      ? document.body.classList.contains(
          "sidebar-collapsed"
        )
      : false
  );

  const [
    sidebarWidth,
    setSidebarWidth,
  ] = useState(
    typeof window !== "undefined"
      ? getComputedStyle(
          document.documentElement
        ).getPropertyValue(
          "--taskflow-sidebar-width"
        ) || "260px"
      : "260px"
  );

  /* =========================================================
     LISTEN FOR SIDEBAR CHANGES
  ========================================================= */

  useEffect(() => {
    const handleSidebarChange = (
      event
    ) => {
      const detail =
        event.detail || {};

      setSidebarCollapsed(
        Boolean(
          detail.collapsed
        )
      );

      setSidebarWidth(
        `${detail.width ?? 260}px`
      );
    };

    window.addEventListener(
      "taskflow-sidebar-change",
      handleSidebarChange
    );

    return () => {
      window.removeEventListener(
        "taskflow-sidebar-change",
        handleSidebarChange
      );
    };
  }, []);

  /* =========================================================
     PROFILE MENU
  ========================================================= */

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  /* =========================================================
     MOBILE TOP NAVIGATION
  ========================================================= */

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  /* =========================================================
     THEME
  ========================================================= */

  const getInitialTheme = () => {
    try {
      const savedTheme =
        localStorage.getItem(
          "theme"
        );

      if (
        savedTheme ===
        "dark"
      ) {
        return true;
      }

      if (
        savedTheme ===
        "light"
      ) {
        return false;
      }

      if (
        typeof window !==
          "undefined" &&
        window.matchMedia &&
        window
          .matchMedia(
            "(prefers-color-scheme: dark)"
          )
          .matches
      ) {
        return true;
      }
    } catch (error) {
      console.warn(
        "Unable to read saved theme:",
        error
      );
    }

    return false;
  };

  const [
    darkMode,
    setDarkMode,
  ] = useState(
    getInitialTheme
  );

  /* =========================================================
     APPLY THEME
  ========================================================= */

  useEffect(() => {
    const html =
      document.documentElement;

    const body =
      document.body;

    const theme =
      darkMode
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

  /* =========================================================
     SYNC THEME
  ========================================================= */

  useEffect(() => {
    const handleStorage = (
      event
    ) => {
      if (
        event.key !==
        "theme"
      ) {
        return;
      }

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

      if (
        theme === "dark"
      ) {
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

  /* =========================================================
     CLOSE PROFILE MENU OUTSIDE
  ========================================================= */

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

  /* =========================================================
     ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setShowProfileMenu(
      false
    );

    setMobileMenu(false);
  }, [
    location.pathname,
  ]);

  /* =========================================================
     USER INITIALS
  ========================================================= */

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map(
        (name) =>
          name?.[0] || ""
      )
      ?.join("")
      ?.substring(
        0,
        2
      )
      ?.toUpperCase() || "TF";

  /* =========================================================
     THEME TOGGLE
  ========================================================= */

  const toggleTheme = () => {
    setDarkMode(
      (previous) =>
        !previous
    );
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleNavigate = (
    path
  ) => {
    if (!path) {
      return;
    }

    navigate(path);

    setShowProfileMenu(
      false
    );

    setMobileMenu(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout =
    async () => {
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
          "Unable to clear local storage:",
          error
        );
      }

      setShowProfileMenu(
        false
      );

      setMobileMenu(
        false
      );

      navigate("/", {
        replace: true,
      });
    };

  /* =========================================================
     RENDER
  ========================================================= */

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
      style={{
        "--current-sidebar-width":
          sidebarWidth,
      }}
    >
      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="navbar-left">

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
              setMobileMenu(
                false
              )
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
              setMobileMenu(
                false
              )
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
              setMobileMenu(
                false
              )
            }
          >
            <FaTasks />

            <span>
              Tasks
            </span>
          </NavLink>

          {/* TEAM */}

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
            onClick={() =>
              setMobileMenu(
                false
              )
            }
          >
            <FaUsers />

            <span>
              Team
            </span>
          </NavLink>

        </nav>

      </div>

      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="navbar-right">

        {/* THEME */}

        <motion.button
          type="button"
          className={`icon-btn theme-toggle ${
            darkMode
              ? "theme-active"
              : ""
          }`}
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
          onClick={
            toggleTheme
          }
          whileHover={{
            scale: 1.06,
            rotate: darkMode
              ? 5
              : -5,
          }}
          whileTap={{
            scale: 0.9,
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

        {/* NOTIFICATIONS */}

        <NotificationBell />

        {/* SETTINGS */}

        <motion.button
          type="button"
          className="icon-btn"
          aria-label="Settings"
          title="Settings"
          onClick={() =>
            handleNavigate(
              "/settings"
            )
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

        {/* PROFILE */}

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
            aria-expanded={
              showProfileMenu
            }
            onClick={() =>
              setShowProfileMenu(
                (previous) =>
                  !previous
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

          {/* PROFILE DROPDOWN */}

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
                  y: -12,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                {/* HEADER */}

                <div className="dropdown-header">

                  {user?.avatar ? (
                    <img
                      src={
                        user.avatar
                      }
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

        {/* MOBILE NAV */}

        <motion.button
          type="button"
          className="mobile-toggle"
          aria-label={
            mobileMenu
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            mobileMenu
          }
          onClick={() =>
            setMobileMenu(
              (previous) =>
                !previous
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
    </header>
  );
};

export default Navbar;