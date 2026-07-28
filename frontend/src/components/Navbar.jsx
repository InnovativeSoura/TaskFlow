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

   IMPORTANT:
   ---------------------------------------------------------
   1. Sidebar collapse / expand is controlled ONLY
      by the TaskFlow logo inside Sidebar.jsx.

   2. Navbar does NOT contain a sidebar hamburger.

   3. Navbar does NOT contain a global search bar.

   4. Dashboard search is handled inside Dashboard.jsx.

   5. Navbar automatically detects the Sidebar width
      so it NEVER overlaps the TaskFlow logo.

   DESKTOP SIDEBAR:
      Expanded  = 260px
      Collapsed = 84px

   MOBILE SIDEBAR:
      Drawer = 270px
========================================================= */

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const menuRef = useRef(null);
  const navbarRef = useRef(null);

  /* =========================================================
     PROFILE MENU
  ========================================================= */

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  /* =========================================================
     MOBILE TOP NAVIGATION
     
     IMPORTANT:
     This controls ONLY:
       Dashboard
       Projects
       Tasks
       Team

     It does NOT control the Sidebar.
  ========================================================= */

  const [mobileMenu, setMobileMenu] =
    useState(false);

  /* =========================================================
     SIDEBAR OFFSET
     
     This is the important fix for the overlap.

     Default desktop collapsed width:
        84px

     When Sidebar expands:
        ResizeObserver detects 260px

     Navbar then moves automatically:
        left: 260px
  ========================================================= */

  const [sidebarWidth, setSidebarWidth] =
    useState(84);

  const [isMobile, setIsMobile] =
    useState(
      typeof window !== "undefined" &&
        window.innerWidth <= 768
    );

  /* =========================================================
     THEME INITIALIZATION
  ========================================================= */

  const getInitialTheme = () => {
    try {
      const savedTheme =
        localStorage.getItem("theme");

      if (savedTheme === "dark") {
        return true;
      }

      if (savedTheme === "light") {
        return false;
      }

      if (
        window.matchMedia &&
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
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

  const [darkMode, setDarkMode] =
    useState(getInitialTheme);

  /* =========================================================
     RESPONSIVE CHECK
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth <= 768;

      setIsMobile(mobile);

      /*
        On mobile the navbar must occupy
        the full viewport width because the
        sidebar becomes a drawer.
      */
      if (mobile) {
        setSidebarWidth(0);
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

  /* =========================================================
     DETECT SIDEBAR WIDTH
     
     ResizeObserver allows Navbar to follow
     Sidebar's Framer Motion width animation.

     Sidebar.jsx:
       expanded  -> 260px
       collapsed -> 84px

     Navbar:
       left      -> sidebar width
  ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (window.innerWidth <= 768) {
      setSidebarWidth(0);
      return undefined;
    }

    const sidebar =
      document.querySelector(
        ".sidebar"
      );

    if (!sidebar) {
      setSidebarWidth(84);
      return undefined;
    }

    const updateSidebarWidth = () => {
      const width =
        sidebar.getBoundingClientRect()
          .width;

      /*
        Prevent tiny fractional values
        during the Framer Motion animation.
      */
      if (width > 0) {
        setSidebarWidth(
          Math.round(width)
        );
      }
    };

    updateSidebarWidth();

    const observer =
      new ResizeObserver(() => {
        updateSidebarWidth();
      });

    observer.observe(sidebar);

    /*
      Extra fallback for environments where
      ResizeObserver does not immediately fire.
    */
    const interval = setInterval(
      updateSidebarWidth,
      100
    );

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [location.pathname, isMobile]);

  /* =========================================================
     APPLY GLOBAL THEME
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

    /* HTML DATA ATTRIBUTE */

    html.setAttribute(
      "data-theme",
      theme
    );

    /* HTML CLASS */

    html.classList.toggle(
      "dark-theme",
      darkMode
    );

    html.classList.toggle(
      "light-theme",
      !darkMode
    );

    /* BODY CLASS */

    body.classList.toggle(
      "dark-theme",
      darkMode
    );

    body.classList.toggle(
      "light-theme",
      !darkMode
    );

    /* SAVE THEME */

    localStorage.setItem(
      "theme",
      theme
    );

    /* TASKFLOW THEME EVENT */

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
     SYNC THEME FROM OTHER COMPONENTS / TABS
  ========================================================= */

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== "theme") {
        return;
      }

      if (event.newValue === "dark") {
        setDarkMode(true);
      }

      if (event.newValue === "light") {
        setDarkMode(false);
      }
    };

    const handleThemeChange = (event) => {
      const theme =
        event.detail?.theme;

      if (theme === "dark") {
        setDarkMode(true);
      }

      if (theme === "light") {
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
     CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
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
        setShowProfileMenu(false);
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
     CLOSE MENUS WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setShowProfileMenu(false);
    setMobileMenu(false);
  }, [location.pathname]);

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
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";

  /* =========================================================
     THEME TOGGLE
  ========================================================= */

  const toggleTheme = () => {
    setDarkMode(
      (previous) => !previous
    );
  };

  /* =========================================================
     NAVIGATION HELPER
  ========================================================= */

  const handleNavigate = (path) => {
    navigate(path);

    setShowProfileMenu(false);
    setMobileMenu(false);
  };

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

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setShowProfileMenu(false);
    setMobileMenu(false);

    navigate("/", {
      replace: true,
    });
  };

  /* =========================================================
     NAVBAR POSITION
     
     Desktop:
       left = actual Sidebar width

     Mobile:
       left = 0

     This prevents Navbar from covering
     the TaskFlow logo.
  ========================================================= */

  const navbarStyle = {
    "--navbar-sidebar-offset": isMobile
      ? "0px"
      : `${sidebarWidth}px`,
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <header
      ref={navbarRef}
      className={`navbar ${
        darkMode
          ? "navbar-dark"
          : "navbar-light"
      } ${
        isMobile
          ? "navbar-mobile"
          : "navbar-desktop"
      }`}
      style={navbarStyle}
    >

      {/* =====================================================
          LEFT SECTION
          
          NO SIDEBAR HAMBURGER.
          NO GLOBAL SEARCH.
      ===================================================== */}

      <div className="navbar-left">

        {/* =================================================
            TOP NAVIGATION
        ================================================= */}

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

          {/* TEAM */}

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

      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <div className="navbar-right">

        {/* =================================================
            DAY / NIGHT TOGGLE
        ================================================= */}

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
          onClick={toggleTheme}
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
                transition={{
                  duration: 0.22,
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
                transition={{
                  duration: 0.22,
                }}
              >
                <FaMoon />
              </motion.span>
            )}

          </AnimatePresence>

        </motion.button>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <NotificationBell />

        {/* =================================================
            SETTINGS
        ================================================= */}

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

        {/* =================================================
            PROFILE
        ================================================= */}

        <div
          className="profile-wrapper"
          ref={menuRef}
        >

          {/* PROFILE TRIGGER */}

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

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

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

                {/* DROPDOWN HEADER */}

                <div className="dropdown-header">

                  {/* AVATAR */}

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

                  {/* USER INFO */}

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

                {/* DIVIDER */}

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

        {/* =================================================
            MOBILE TOP NAVIGATION TOGGLE

            IMPORTANT:
            This does NOT control the Sidebar.
        ================================================= */}

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