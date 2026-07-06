import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaCog,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [search, setSearch] = useState("");

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme") === "dark"
    );

  const menuRef = useRef(null);

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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (

    <header className="navbar">

      {/* =======================
          LEFT
      ======================= */}

      <div className="navbar-left">

        <h2>

          Dashboard

        </h2>

      </div>

      {/* =======================
          SEARCH
      ======================= */}

      <div className="navbar-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search projects, tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =======================
          RIGHT
      ======================= */}

      <div className="navbar-right">

        <button
          className="icon-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >

          {darkMode
            ? <FaSun />
            : <FaMoon />}

        </button>

        <button
          className="icon-btn"
          onClick={() =>
            navigate("/notifications")
          }
        >

          <FaBell />

          <span className="notification-badge">

            3

          </span>

        </button>

        <button
          className="icon-btn"
          onClick={() =>
            navigate("/settings")
          }
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

            <div className="profile-info">

              <h4>

                {user?.name || "User"}

              </h4>

              <p>

                {user?.role || "Team Member"}

              </p>

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

                <span>
                  My Profile
                </span>

              </button>

              <button
                onClick={() => {
                  navigate("/settings");
                  setShowProfileMenu(false);
                }}
              >
                <FaCog />

                <span>
                  Settings
                </span>

              </button>

              <hr />

              <button
                className="logout-menu-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt />

                <span>
                  Logout
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );

};

export default Navbar;