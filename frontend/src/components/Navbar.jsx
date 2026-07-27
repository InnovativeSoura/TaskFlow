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


/* =========================================================
   TASKFLOW PREMIUM NAVBAR
========================================================= */

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const menuRef = useRef(null);


  /* =========================================================
     SEARCH
  ========================================================= */

  const [search, setSearch] = useState("");


  /* =========================================================
     PROFILE MENU
  ========================================================= */

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);


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


  const [darkMode, setDarkMode] = useState(
    getInitialTheme
  );


  /* =========================================================
     APPLY GLOBAL THEME
     
     IMPORTANT:
     We intentionally DO NOT use ThemeProvider.
     TaskFlow uses CSS variables + data-theme.
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


    /* SAVE */

    localStorage.setItem(
      "theme",
      theme
    );


    /* =====================================================
       CUSTOM TASKFLOW THEME EVENT

       Other TaskFlow components can listen to this.
    ===================================================== */

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

      } else if (
        event.newValue === "light"
      ) {

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


    /* Extra cleanup */

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    /* Reset theme event listeners */

    setShowProfileMenu(false);
    setMobileMenu(false);


    navigate("/", {
      replace: true,
    });

  };


  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (event) => {

    setSearch(
      event.target.value
    );

  };


  /* =========================================================
     SEARCH KEYBOARD
  ========================================================= */

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


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <header
      className={`navbar ${
        darkMode
          ? "navbar-dark"
          : "navbar-light"
      }`}
    >

      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <div className="navbar-left">


        {/* SIDEBAR BUTTON */}

        <motion.button
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
              (previous) =>
                !previous
            )
          }
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.92,
          }}
        >

          <FaBars />

        </motion.button>


        {/* =================================================
            NAVIGATION
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
          >

            <FaUsers />

            <span>
              Team
            </span>

          </NavLink>

        </nav>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="navbar-search">

        <FaSearch
          className="search-icon"
        />


        <input
          type="text"
          aria-label="Search TaskFlow"
          placeholder="Search projects, tasks..."
          value={search}
          onChange={handleSearch}
          onKeyDown={
            handleSearchKeyDown
          }
        />


        {/* CLEAR SEARCH */}

        <AnimatePresence>

          {search && (

            <motion.button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.7,
              }}
              onClick={() =>
                setSearch("")
              }
            >

              <FaTimes />

            </motion.button>

          )}

        </AnimatePresence>

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
            rotate: darkMode ? 5 : -5,
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


        {/* =================================================
            MOBILE MENU
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
            <FaBars />
          )}

        </motion.button>

      </div>

    </header>
  );
};


export default Navbar;