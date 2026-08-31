import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaCog,
  FaTasks,
  FaSearch,
  FaBell,
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

// your other imports...
import { motion, AnimatePresence } from "framer-motion";

import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const links = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/projects", label: "Projects" },
  { path: "/tasks", label: "Tasks" },
  { path: "/users", label: "Team" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getTheme = () => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") return true;
    if (saved === "light") return false;

    return window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches || false;
  };

  const [darkMode, setDarkMode] = useState(getTheme);

  // /* ---------------- THEME ---------------- */

  // useEffect(() => {
  //   const theme = darkMode ? "dark" : "light";
  //   const html = document.documentElement;
  //   const body = document.body;

  //   html.dataset.theme = theme;
  //   html.classList.toggle("dark-theme", darkMode);
  //   html.classList.toggle("light-theme", !darkMode);

  //   body.classList.toggle("dark-theme", darkMode);
  //   body.classList.toggle("light-theme", !darkMode);

  //   localStorage.setItem("theme", theme);

  //   window.dispatchEvent(
  //     new CustomEvent("taskflow-theme-change", {
  //       detail: { theme, darkMode },
  //     })
  //   );
  // }, [darkMode]);

  /* ---------------- THEME SYNC ---------------- */

  useEffect(() => {
    const syncTheme = (e) => {
      if (e.key === "theme") {
        setDarkMode(e.newValue === "dark");
      }
    };

    const syncCustomTheme = (e) => {
      if (e.detail?.theme) {
        setDarkMode(e.detail.theme === "dark");
      }
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener(
      "taskflow-theme-change",
      syncCustomTheme
    );

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener(
        "taskflow-theme-change",
        syncCustomTheme
      );
    };
  }, []);

  /* ---------------- CLOSE PROFILE ---------------- */

  useEffect(() => {
    const closeMenu = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () =>
      document.removeEventListener("mousedown", closeMenu);
  }, []);

  /* ---------------- ROUTE CHANGE ---------------- */

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  /* ---------------- USER ---------------- */

  const name = user?.name || user?.username || "User";
  const role = user?.role || "Member";

  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TF";

  /* ---------------- ACTIONS ---------------- */

  const goTo = (path) => {
    navigate(path);
    setProfileOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  /* ---------------- AVATAR ---------------- */

  const Avatar = ({ large = false }) =>
    user?.avatar ? (
      <img
        src={user.avatar}
        alt={name}
        className={large ? "dropdown-avatar" : "avatar"}
      />
    ) : (
      <div
        className={`initials ${
          large ? "dropdown-avatar" : "avatar"
        }`}
      >
        {initials}
      </div>
    );

  return (
    <header
      className={`navbar ${
        darkMode ? "navbar-dark" : "navbar-light"
      }`}
    >
      {/* LEFT NAVIGATION */}

      <div className="navbar-left">
        <nav className="navbar-links">
          {links.map((link, index) => (
            <React.Fragment key={link.path}>
              {index > 0 && (
                <span className="nav-divider">|</span>
              )}

              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                {link.label}
              </NavLink>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* RIGHT ACTIONS */}

      <div className="navbar-right">

        {/* THEME */}

        <motion.button
          type="button"
          className={`icon-btn theme-toggle ${
            darkMode ? "theme-active" : ""
          }`}
          onClick={() => setDarkMode((v) => !v)}
          whileHover={{
            scale: 1.05,
            rotate: darkMode ? 8 : -8,
          }}
          whileTap={{ scale: 0.92 }}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={darkMode ? "sun" : "moon"}
              className="theme-icon"
              initial={{
                rotate: darkMode ? -90 : 90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
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
          onClick={() => goTo("/settings")}
          whileHover={{ scale: 1.05, rotate: 8 }}
          whileTap={{ scale: 0.92 }}
          title="Settings"
        >
          <FaCog />
        </motion.button>

        {/* PROFILE */}

        <div className="profile-wrapper" ref={menuRef}>
          <motion.button
            type="button"
            className="profile-trigger"
            onClick={() => setProfileOpen((v) => !v)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar />
            <FaChevronDown className="profile-arrow" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
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
                  y: -10,
                  scale: 0.96,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header">
                  <Avatar large />

                  <div className="dropdown-user-info">
                    <h4>{name}</h4>
                    <small>{role}</small>
                  </div>
                </div>

                <button onClick={() => goTo("/profile")}>
                  <FaUserCircle />
                  <span>Profile</span>
                </button>

                <button onClick={() => goTo("/settings")}>
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

        {/* MOBILE */}

        <motion.button
          type="button"
          className="mobile-toggle"
          aria-label={
            mobileOpen ? "Close Menu" : "Open Menu"
          }
          onClick={() => setMobileOpen((v) => !v)}
          whileTap={{ scale: 0.9 }}
        >
          {mobileOpen ? (
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
        {mobileOpen && (
          <motion.div
            className="navbar-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`navbar-mobile-menu ${
                darkMode
                  ? "mobile-dark"
                  : "mobile-light"
              }`}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              <NavLink
                to="/settings"
                onClick={() => setMobileOpen(false)}
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