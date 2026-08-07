import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaUserCircle,
  FaTasks,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth() || {};
  const menuRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const getTheme = () => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";

      return window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches;
    } catch {
      return false;
    }
  };

  const [darkMode, setDarkMode] = useState(getTheme);

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map((word) => word[0])
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";

  /* Theme */
  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark-theme", darkMode);
    document.documentElement.classList.toggle("light-theme", !darkMode);

    document.body.classList.toggle("dark-theme", darkMode);
    document.body.classList.toggle("light-theme", !darkMode);

    try {
      localStorage.setItem("theme", theme);
    } catch {}

    window.dispatchEvent(
      new CustomEvent("taskflow-theme-change", {
        detail: { theme, darkMode },
      })
    );
  }, [darkMode]);

  /* Sync theme */
  useEffect(() => {
    const handleTheme = (event) => {
      const theme =
        event.key === "theme"
          ? event.newValue
          : event.detail?.theme;

      if (theme === "dark") setDarkMode(true);
      if (theme === "light") setDarkMode(false);
    };

    window.addEventListener("storage", handleTheme);
    window.addEventListener("taskflow-theme-change", handleTheme);

    return () => {
      window.removeEventListener("storage", handleTheme);
      window.removeEventListener("taskflow-theme-change", handleTheme);
    };
  }, []);

  /* Close profile menu outside click */
  useEffect(() => {
    const handleClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Close menus after route change */
  useEffect(() => {
    setShowProfileMenu(false);
    setMobileMenu(false);
  }, [location.pathname]);

  const navigateTo = (path) => {
    navigate(path);
    setShowProfileMenu(false);
    setMobileMenu(false);
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const navItems = [
    ["Dashboard", "/dashboard"],
    ["Projects", "/projects"],
    ["Tasks", "/tasks"],
    ["Team", "/users"],
  ];

  return (
    <header className={`navbar ${darkMode ? "navbar-dark" : "navbar-light"}`}>

      {/* LEFT NAVIGATION */}
      <div className="navbar-left">
        <nav className="navbar-links">
          {navItems.map(([label, path], index) => (
            <span key={path} className="nav-item-group">
              {index > 0 && <span className="nav-divider">|</span>}

              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                {label}
              </NavLink>
            </span>
          ))}
        </nav>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="navbar-right">

        {/* THEME */}
        <motion.button
          type="button"
          className={`icon-btn theme-toggle ${
            darkMode ? "theme-active" : ""
          }`}
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? "Light Mode" : "Dark Mode"}
          whileHover={{
            scale: 1.05,
            rotate: darkMode ? 8 : -8,
          }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={darkMode ? "sun" : "moon"}
              className="theme-icon"
              initial={{
                rotate: darkMode ? -90 : 90,
                opacity: 0,
              }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{
                rotate: darkMode ? 90 : -90,
                opacity: 0,
              }}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* NOTIFICATIONS */}
        <NotificationBell />

        {/* SETTINGS */}
        <motion.button
          type="button"
          className="icon-btn"
          onClick={() => navigateTo("/settings")}
          title="Settings"
          whileHover={{ scale: 1.05, rotate: 8 }}
          whileTap={{ scale: 0.92 }}
        >
          <FaCog />
        </motion.button>

        {/* PROFILE */}
        <div className="profile-wrapper" ref={menuRef}>
          <motion.button
            type="button"
            className="profile-trigger"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || "User"}
                className="avatar"
              />
            ) : (
              <div className="avatar initials">{initials}</div>
            )}

            <FaChevronDown className="profile-arrow" />
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className={`profile-dropdown ${
                  darkMode ? "dropdown-dark" : "dropdown-light"
                }`}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.22 }}
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
                    <h4>{user?.name || "User"}</h4>
                    <small>{user?.role || "Member"}</small>
                  </div>
                </div>

                <button onClick={() => navigateTo("/profile")}>
                  <FaUserCircle />
                  <span>Profile</span>
                </button>

                <button onClick={() => navigateTo("/settings")}>
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

        {/* MOBILE TOGGLE */}
        <motion.button
          type="button"
          className="mobile-toggle"
          aria-label={mobileMenu ? "Close Menu" : "Open Menu"}
          onClick={() => setMobileMenu((prev) => !prev)}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenu ? (
            <FaChevronDown
              style={{ transform: "rotate(180deg)" }}
            />
          ) : (
            <FaTasks />
          )}
        </motion.button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="navbar-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`navbar-mobile-menu ${
                darkMode ? "mobile-dark" : "mobile-light"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {navItems.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileMenu(false)}
                >
                  {label}
                </NavLink>
              ))}

              <NavLink
                to="/settings"
                onClick={() => setMobileMenu(false)}
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