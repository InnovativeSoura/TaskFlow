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
  FaUserCircle,
  FaBell,
  FaTasks,
  FaUsers,
  FaProjectDiagram,
  FaHome,
  FaChevronDown,
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
      MOBILE MENU
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
      darkMode ? "dark" : "light";

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

    } catch (err) {

      console.warn(err);

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

    const handleStorage = (event) => {

      if (event.key !== "theme")
        return;

      if (event.newValue === "dark")
        setDarkMode(true);

      if (event.newValue === "light")
        setDarkMode(false);

    };

    const handleThemeChange = (event) => {

      const theme =
        event.detail?.theme;

      if (theme === "dark")
        setDarkMode(true);

      if (theme === "light")
        setDarkMode(false);

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
      CLOSE PROFILE
  ========================================== */

  useEffect(() => {

    const handleClick = (event) => {

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
      handleClick
    );

    return () =>

      document.removeEventListener(
        "mousedown",
        handleClick
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
      THEME TOGGLE
  ========================================== */

  const toggleTheme = () => {

    setDarkMode(prev => !prev);

  };

  /* ==========================================
      NAVIGATION
  ========================================== */

  const handleNavigate = (path) => {

    navigate(path);

    setShowProfileMenu(false);

    setMobileMenu(false);

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

      {/* ==========================
            LEFT
      ========================== */}

      <div className="navbar-left">

        <nav className="navbar-links">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            Dashboard
          </NavLink>

          <span className="nav-divider">|</span>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            Projects
          </NavLink>

          <span className="nav-divider">|</span>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            Tasks
          </NavLink>

          <span className="nav-divider">|</span>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            Team
          </NavLink>

        </nav>

      </div>

      {/* ==========================
            RIGHT
      ========================== */}

      <div className="navbar-right">
                {/* ==========================
            THEME
        ========================== */}

        <motion.button
          type="button"
          className={`icon-btn theme-toggle ${
            darkMode
              ? "theme-active"
              : ""
          }`}
          onClick={toggleTheme}
          whileHover={{
            scale: 1.05,
            rotate: darkMode ? 8 : -8,
          }}
          whileTap={{
            scale: 0.92,
          }}
          title={
            darkMode
              ? "Light Mode"
              : "Dark Mode"
          }
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
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
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
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: -90,
                  opacity: 0,
                }}
              >
                <FaMoon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* ==========================
            NOTIFICATIONS
        ========================== */}

        <NotificationBell />

        {/* ==========================
            SETTINGS
        ========================== */}

        <motion.button
          type="button"
          className="icon-btn"
          onClick={() =>
            handleNavigate("/settings")
          }
          whileHover={{
            scale: 1.05,
            rotate: 8,
          }}
          whileTap={{
            scale: 0.92,
          }}
          title="Settings"
        >
          <FaCog />
        </motion.button>

        {/* ==========================
            PROFILE
        ========================== */}

        <div
          className="profile-wrapper"
          ref={menuRef}
        >
          <motion.button
            type="button"
            className="profile-trigger"
            onClick={() =>
              setShowProfileMenu(
                (prev) => !prev
              )
            }
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name}
                className="avatar"
              />
            ) : (
              <div className="avatar initials">
                {initials}
              </div>
            )}

            <FaChevronDown className="profile-arrow" />
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
                  y: -12,
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
                transition={{
                  duration: .22,
                }}
              >

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

                <button
                  onClick={() =>
                    handleNavigate("/profile")
                  }
                >
                  <FaUserCircle />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() =>
                    handleNavigate("/settings")
                  }
                >
                  <FaCog />
                  <span>Settings</span>
                </button>

                <hr />

                <button
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
                {/* =====================================
            MOBILE MENU TOGGLE
        ===================================== */}

        <motion.button
          type="button"
          className="mobile-toggle"
          aria-label={
            mobileMenu
              ? "Close Menu"
              : "Open Menu"
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
            <FaChevronDown
              style={{
                transform: "rotate(180deg)",
              }}
            />
          ) : (
            <FaTasks />
          )}
        </motion.button>

      </div>

      {/* =====================================
          MOBILE NAVIGATION
      ===================================== */}

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
          >

            <motion.div
              className={`navbar-mobile-menu ${
                darkMode
                  ? "mobile-dark"
                  : "mobile-light"
              }`}
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
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
                Dashboard
              </NavLink>

              <NavLink
                to="/projects"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                Projects
              </NavLink>

              <NavLink
                to="/tasks"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                Tasks
              </NavLink>

              <NavLink
                to="/users"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                Team
              </NavLink>

              <NavLink
                to="/settings"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                Settings
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