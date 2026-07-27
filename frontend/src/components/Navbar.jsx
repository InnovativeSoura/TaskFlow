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

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import NotificationBell from "./NotificationBell";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";


const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const menuRef = useRef(null);

  /* ==========================================
     SEARCH
  ========================================== */

  const [search, setSearch] = useState("");


  /* ==========================================
     PROFILE MENU
  ========================================== */

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);


  /* ==========================================
     MOBILE MENU
  ========================================== */

  const [mobileMenu, setMobileMenu] =
    useState(false);


  /* ==========================================
     THEME
  ========================================== */

  const getInitialTheme = () => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {
      return true;
    }

    if (savedTheme === "light") {
      return false;
    }

    return window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
  };

  const [darkMode, setDarkMode] = useState(
    getInitialTheme
  );


  /* ==========================================
     APPLY THEME
  ========================================== */

  useEffect(() => {
    const root =
      document.documentElement;

    const body =
      document.body;

    if (darkMode) {
      root.classList.add("dark-theme");
      body.classList.add("dark-theme");

      root.setAttribute(
        "data-theme",
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      root.classList.remove("dark-theme");
      body.classList.remove("dark-theme");

      root.setAttribute(
        "data-theme",
        "light"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }

    /*
      Notify other components that the theme
      has changed.

      Profile page can listen to this event
      if required.
    */

    window.dispatchEvent(
      new CustomEvent(
        "taskflow-theme-change",
        {
          detail: {
            theme: darkMode
              ? "dark"
              : "light",
          },
        }
      )
    );

  }, [darkMode]);


  /* ==========================================
     SYNC THEME BETWEEN COMPONENTS / TABS
  ========================================== */

  useEffect(() => {

    const handleStorage = (event) => {

      if (event.key !== "theme") {
        return;
      }

      setDarkMode(
        event.newValue === "dark"
      );
    };


    const handleThemeChange = (event) => {

      const theme =
        event.detail?.theme;

      if (
        theme === "dark" ||
        theme === "light"
      ) {
        setDarkMode(
          theme === "dark"
        );
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

    const handleOutsideClick = (event) => {

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


  /* ==========================================
     CLOSE MENUS ON ROUTE CHANGE
  ========================================== */

  useEffect(() => {

    setShowProfileMenu(false);
    setMobileMenu(false);

  }, [location.pathname]);


  /* ==========================================
     USER INITIALS
  ========================================== */

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map(
        (name) => name[0]
      )
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";


  /* ==========================================
     TOGGLE THEME
  ========================================== */

  const toggleTheme = () => {

    setDarkMode(
      (previous) => !previous
    );

  };


  /* ==========================================
     LOGOUT
  ========================================== */

  const handleLogout = async () => {

    try {

      await logout();

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    }


    /*
      Extra cleanup to guarantee that
      authentication state is removed.
    */

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    navigate("/", {
      replace: true,
    });

  };


  /* ==========================================
     SEARCH HANDLER
  ========================================== */

  const handleSearch = (event) => {

    const value =
      event.target.value;

    setSearch(value);

  };


  /* ==========================================
     KEYBOARD SEARCH
  ========================================== */

  const handleSearchKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      search.trim()
    ) {

      navigate(
        `/tasks?search=${encodeURIComponent(
          search.trim()
        )}`
      );

      setSearch("");

    }

  };


  /* ==========================================
     NAVIGATION HELPERS
  ========================================== */

  const handleNavigate = (path) => {

    navigate(path);

    setShowProfileMenu(false);
    setMobileMenu(false);

  };


  return (
    <header
      className={`navbar ${
        darkMode
          ? "navbar-dark"
          : "navbar-light"
      }`}
    >

      {/* ======================================
          LEFT SECTION
      ====================================== */}

      <div className="navbar-left">

        {/* SIDEBAR BUTTON */}

        <button
          type="button"
          className="menu-btn"
          aria-label={
            sidebarOpen
              ? "Close sidebar"
              : "Open sidebar"
          }
          title={
            sidebarOpen
              ? "Close sidebar"
              : "Open sidebar"
          }
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
        >
          <FaBars />
        </button>


        {/* DESKTOP NAVIGATION */}

        <nav
          className={`navbar-links ${
            mobileMenu
              ? "active"
              : ""
          }`}
        >

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            <FaHome />

            <span>
              Dashboard
            </span>
          </NavLink>


          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            <FaProjectDiagram />

            <span>
              Projects
            </span>
          </NavLink>


          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            <FaTasks />

            <span>
              Tasks
            </span>
          </NavLink>


          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
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
          SEARCH
      ====================================== */}

      <div className="navbar-search">

        <FaSearch
          className="search-icon"
        />

        <input
          type="text"
          aria-label="Search"
          placeholder="Search projects, tasks..."
          value={search}
          onChange={handleSearch}
          onKeyDown={
            handleSearchKeyDown
          }
        />

        {search && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() =>
              setSearch("")
            }
          >
            <FaTimes />
          </button>
        )}

      </div>


      {/* ======================================
          RIGHT SECTION
      ====================================== */}

      <div className="navbar-right">


        {/* ====================================
            DAY / NIGHT THEME
        ==================================== */}

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
          whileTap={{
            scale: 0.9,
          }}
          whileHover={{
            scale: 1.05,
          }}
        >

          <AnimatePresence
            mode="wait"
            initial={false}
          >

            {darkMode ? (

              <motion.span
                key="sun"
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
                  duration: 0.2,
                }}
              >
                <FaSun />
              </motion.span>

            ) : (

              <motion.span
                key="moon"
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
                  duration: 0.2,
                }}
              >
                <FaMoon />
              </motion.span>

            )}

          </AnimatePresence>

        </motion.button>


        {/* ====================================
            NOTIFICATIONS
        ==================================== */}

        <NotificationBell />


        {/* ====================================
            SETTINGS
        ==================================== */}

        <button
          type="button"
          className="icon-btn"
          aria-label="Settings"
          title="Settings"
          onClick={() =>
            handleNavigate(
              "/settings"
            )
          }
        >
          <FaCog />
        </button>


        {/* ====================================
            PROFILE
        ==================================== */}

        <div
          className="profile-wrapper"
          ref={menuRef}
        >

          <motion.button
            type="button"
            className={`profile-trigger ${
              darkMode
                ? "profile-trigger-dark"
                : ""
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
                className="profile-dropdown"
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
                  duration: 0.18,
                  ease: "easeOut",
                }}
              >

                {/* DROPDOWN HEADER */}

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
                      {
                        user?.name ||
                        "User"
                      }
                    </h4>

                    <small>
                      {
                        user?.role ||
                        "Member"
                      }
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


        {/* ====================================
            MOBILE MENU
        ==================================== */}

        <button
          type="button"
          className="mobile-toggle"
          aria-label={
            mobileMenu
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          onClick={() =>
            setMobileMenu(
              (previous) =>
                !previous
            )
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