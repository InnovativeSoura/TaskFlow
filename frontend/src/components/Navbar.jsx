import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaBars,
  FaCog,
  FaMoon,
  FaSearch,
  FaSignOutAlt,
  FaSun,
  FaTasks,
  FaTimes,
  FaUserCircle,
  FaUsers,
  FaProjectDiagram,
  FaHome,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const menuRef = useRef(null);

  /* ==========================================
      THEME
  ========================================== */

  useEffect(() => {
    document.body.classList.toggle(
      "dark-theme",
      darkMode
    );

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* ==========================================
      CLOSE PROFILE MENU
  ========================================== */

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  /* ==========================================
      USER INITIALS
  ========================================== */

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "TF";

  /* ==========================================
      LOGOUT
  ========================================== */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }

    // Extra safety
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  return (
    <header className="navbar">

      {/* LEFT */}

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        >
          <FaBars />
        </button>

        <nav
          className={`navbar-links ${
            mobileMenu ? "active" : ""
          }`}
        >
          <NavLink to="/dashboard">
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink to="/projects">
            <FaProjectDiagram />
            Projects
          </NavLink>

          <NavLink to="/tasks">
            <FaTasks />
            Tasks
          </NavLink>

          <NavLink to="/users">
            <FaUsers />
            Team
          </NavLink>
        </nav>

      </div>

      {/* SEARCH */}

      <div className="navbar-search">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search projects, tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* RIGHT */}

      <div className="navbar-right">

        <button
          className="icon-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          {darkMode ? (
            <FaSun />
          ) : (
            <FaMoon />
          )}
        </button>

        <NotificationBell />

        <button
          className="icon-btn"
          onClick={() =>
            navigate("/settings")
          }
        >
          <FaCog />
        </button>

        {/* PROFILE */}

        <div
          className="profile-wrapper"
          ref={menuRef}
        >
          <button
            className="profile-trigger"
            onClick={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="avatar"
              />
            ) : (
              <div className="avatar initials">
                {initials}
              </div>
            )}
          </button>

          <AnimatePresence>

            {showProfileMenu && (

              <motion.div
                className="profile-dropdown"
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.2,
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

                  <div>

                    <h4>
                      {user?.name || "User"}
                    </h4>

                    <small>
                      {user?.role || "Member"}
                    </small>

                  </div>

                </div>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(
                      false
                    );
                  }}
                >
                  <FaUserCircle />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowProfileMenu(
                      false
                    );
                  }}
                >
                  <FaCog />
                  Settings
                </button>

                <hr />

                <button
                  className="logout-menu-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </button>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

        {/* MOBILE */}

        <button
          className="mobile-toggle"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
        >
          {mobileMenu ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </div>

    </header>
  );
};

export default Navbar;