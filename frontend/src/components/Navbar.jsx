import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

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

import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const menuRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "TF";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      {/* LOGO */}

      <div className="navbar-logo" onClick={() => navigate("/")}>
        <div className="logo-circle">TF</div>

        <div>
          <h2>TaskFlow</h2>
          <span>Project Management</span>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className={`navbar-links ${mobileMenu ? "active" : ""}`}>
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

        <NavLink to="/about">
          About
        </NavLink>
      </nav>

      {/* SEARCH */}

      <div className="navbar-search">
        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* RIGHT */}

      <div className="navbar-right">
        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <NotificationBell />

        <button
          className="icon-btn"
          onClick={() => navigate("/settings")}
        >
          <FaCog />
        </button>

        <div
          className="profile-wrapper"
          ref={menuRef}
        >
          <div
            className="profile-card"
            onClick={() =>
              setShowProfileMenu(!showProfileMenu)
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

            <div className="profile-info">
              <h4>{user?.name || "User"}</h4>

              <p>{user?.role || "Member"}</p>
            </div>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowProfileMenu(false);
                }}
              >
                <FaUserCircle />

                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  navigate("/settings");
                  setShowProfileMenu(false);
                }}
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
            </div>
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;