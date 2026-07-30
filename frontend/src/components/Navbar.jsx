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
  FaSun,
  FaSignOutAlt,
  FaTasks,
  FaUsers,
  FaProjectDiagram,
  FaHome,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";

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

      const saved =
        localStorage.getItem("theme");

      if (saved === "dark")
        return true;

      if (saved === "light")
        return false;

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
      ?.map(word => word[0])
      ?.join("")
      ?.substring(0,2)
      ?.toUpperCase() || "TF";

  /* ==========================================
      APPLY THEME
  ========================================== */

  useEffect(() => {

    const html = document.documentElement;
    const body = document.body;

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

    localStorage.setItem(
      "theme",
      theme
    );

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

    const storageListener = (
      e
    ) => {

      if (e.key !== "theme")
        return;

      setDarkMode(
        e.newValue === "dark"
      );

    };

    const themeListener = (
      e
    ) => {

      if (!e.detail) return;

      setDarkMode(
        e.detail.theme === "dark"
      );

    };

    window.addEventListener(
      "storage",
      storageListener
    );

    window.addEventListener(
      "taskflow-theme-change",
      themeListener
    );

    return () => {

      window.removeEventListener(
        "storage",
        storageListener
      );

      window.removeEventListener(
        "taskflow-theme-change",
        themeListener
      );

    };

  }, []);

  /* ==========================================
      CLOSE PROFILE
  ========================================== */

  useEffect(() => {

    const outside = (
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
      outside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        outside
      );

  }, []);

  /* ==========================================
      CLOSE MENUS ON ROUTE CHANGE
  ========================================== */

  useEffect(() => {

    setShowProfileMenu(false);
    setMobileMenu(false);

  }, [location.pathname]);

  /* ==========================================
      TOGGLE THEME
  ========================================== */

  const toggleTheme = () =>
    setDarkMode(prev => !prev);

  /* ==========================================
      NAVIGATION
  ========================================== */

  const handleNavigate = (
    path
  ) => {

    navigate(path);

    setMobileMenu(false);
    setShowProfileMenu(false);

  };

  /* ==========================================
      LOGOUT
  ========================================== */

  const handleLogout = async () => {

    try {

      if (logout) {
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

    /* ==========================================
      RENDER
  ========================================== */

  return (
    <header
      className={`navbar ${
        darkMode
          ? "navbar-dark"
          : "navbar-light"
      }`}
    >

      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <div className="navbar-left">

        {/* ======================================
            LOGO
        ====================================== */}

        <motion.div
          className="navbar-brand"
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <div className="brand-logo">
            TF
          </div>

          <div className="brand-text">

            <h2>TaskFlow</h2>

            <span>
              Project Management
            </span>

          </div>
        </motion.div>

        {/* ======================================
            DESKTOP NAVIGATION
        ====================================== */}

        <nav className="navbar-links">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <FaHome />

            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <FaProjectDiagram />

            <span>Projects</span>
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <FaTasks />

            <span>Tasks</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <FaUsers />

            <span>Team</span>
          </NavLink>

        </nav>

      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="navbar-right">

        {/* THEME */}

        <motion.button
          type="button"
          className={`icon-btn theme-toggle ${
            darkMode
              ? "theme-active"
              : ""
          }`}
          onClick={toggleTheme}
          whileHover={{
            scale: 1.08,
            rotate: darkMode ? 8 : -8,
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
                  rotate: -90,
                  opacity: 0,
                  scale: .5,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
                  scale: .5,
                }}
              >
                <FaSun />
              </motion.span>

            ) : (

              <motion.span
                key="moon"
                className="theme-icon"
                initial={{
                  rotate: 90,
                  opacity: 0,
                  scale: .5,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  rotate: -90,
                  opacity: 0,
                  scale: .5,
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
          className="icon-btn"
          onClick={() =>
            handleNavigate("/settings")
          }
          whileHover={{
            scale: 1.05,
            rotate: 5,
          }}
          whileTap={{
            scale: .92,
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
            className="profile-trigger"
            onClick={() =>
              setShowProfileMenu(
                prev => !prev
              )
            }
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: .95,
            }}
          >

            {user?.avatar ? (

              <img
                src={user.avatar}
                alt={user.name}
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
                  scale: .96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: .96,
                }}
              >

                {/* Header */}

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
                      {user?.name || "User"}
                    </h4>

                    <small>
                      {user?.role || "Member"}
                    </small>

                  </div>

                </div>

                                {/* ===========================
                    PROFILE
                ============================ */}

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate("/profile")
                  }
                >
                  <FaUserCircle />
                  <span>Profile</span>
                </button>

                {/* ===========================
                    SETTINGS
                ============================ */}

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate("/settings")
                  }
                >
                  <FaCog />
                  <span>Settings</span>
                </button>

                <hr />

                {/* ===========================
                    LOGOUT
                ============================ */}

                <button
                  type="button"
                  className="logout-menu-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

        {/* ===========================
            MOBILE MENU BUTTON
        ============================ */}

        <motion.button
          type="button"
          className="mobile-toggle"
          aria-label={
            mobileMenu
              ? "Close Navigation"
              : "Open Navigation"
          }
          onClick={() =>
            setMobileMenu(
              (prev) => !prev
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
          MOBILE NAVIGATION
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
              duration: .2,
            }}
          >

            <motion.div
              className={`navbar-mobile-menu ${
                darkMode
                  ? "mobile-dark"
                  : "mobile-light"
              }`}
              initial={{
                opacity: 0,
                y: -25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -25,
              }}
              transition={{
                duration: .25,
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