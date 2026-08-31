// src/components/Navbar.jsx

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaTasks,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import NotificationBell from "./NotificationBell";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";


/* =========================================================
   NAVIGATION LINKS
========================================================= */

const links = [
  {
    path: "/dashboard",
    label: "Dashboard",
  },
  {
    path: "/projects",
    label: "Projects",
  },
  {
    path: "/tasks",
    label: "Tasks",
  },
  {
    path: "/users",
    label: "Team",
  },
];


/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {

  /* =======================================================
     ROUTER
  ======================================================= */

  const navigate = useNavigate();

  const location = useLocation();


  /* =======================================================
     REFS
  ======================================================= */

  const menuRef = useRef(null);


  /* =======================================================
     AUTH
  ======================================================= */

  const {
    user,
    logout,
  } = useAuth();


  /* =======================================================
     STATE
  ======================================================= */

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);


  /* =======================================================
     CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {

    const closeMenu = (event) => {

      if (
        !menuRef.current?.contains(
          event.target
        )
      ) {

        setProfileOpen(false);

      }

    };


    document.addEventListener(
      "mousedown",
      closeMenu
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        closeMenu
      );

    };

  }, []);


  /* =======================================================
     ROUTE CHANGE
  ======================================================= */

  useEffect(() => {

    setProfileOpen(false);

    setMobileOpen(false);

  }, [location.pathname]);


  /* =======================================================
     USER INFORMATION
  ======================================================= */

  const name =
    user?.name ||
    user?.username ||
    "User";

  const role =
    user?.role ||
    "Member";


  /* =======================================================
     USER INITIALS
  ======================================================= */

  const initials = useMemo(() => {

    if (!name) {
      return "TF";
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);


    if (words.length === 1) {

      return words[0][0]
        .toUpperCase();

    }


    return (
      words[0][0] +
      words[words.length - 1][0]
    )
      .toUpperCase()
      .slice(0, 2);

  }, [name]);


  /* =======================================================
     NAVIGATION ACTION
  ======================================================= */

  const goTo = (path) => {

    navigate(path);

    setProfileOpen(false);

    setMobileOpen(false);

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {

    try {

      if (
        typeof logout === "function"
      ) {

        await logout();

      }

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


    navigate(
      "/",
      {
        replace: true,
      }
    );

  };


  /* =======================================================
     AVATAR
  ======================================================= */

  const Avatar = ({
    large = false,
  }) => {

    if (user?.avatar) {

      return (

        <img
          src={user.avatar}
          alt={name}
          className={
            large
              ? "dropdown-avatar"
              : "avatar"
          }
        />

      );

    }


    return (

      <div
        className={`initials ${
          large
            ? "dropdown-avatar"
            : "avatar"
        }`}
      >

        {initials}

      </div>

    );

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <header className="navbar">


      {/* =================================================
          LEFT NAVIGATION
      ================================================== */}

      <div className="navbar-left">

        <nav className="navbar-links">

          {links.map(
            (link, index) => (

              <React.Fragment
                key={link.path}
              >

                {index > 0 && (

                  <span className="nav-divider">
                    |
                  </span>

                )}


                <NavLink
                  to={link.path}

                  className={({ isActive }) =>
                    isActive
                      ? "active"
                      : ""
                  }
                >

                  {link.label}

                </NavLink>

              </React.Fragment>

            )
          )}

        </nav>

      </div>


      {/* =================================================
          RIGHT ACTIONS
      ================================================== */}

      <div className="navbar-right">


        {/* =================================================
            NOTIFICATIONS
        ================================================== */}

        <NotificationBell />


        {/* =================================================
            SETTINGS
        ================================================== */}

        <motion.button
          type="button"

          className="icon-btn"

          onClick={() =>
            goTo("/settings")
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


        {/* =================================================
            PROFILE
        ================================================== */}

        <div
          className="profile-wrapper"
          ref={menuRef}
        >

          <motion.button
            type="button"

            className="profile-trigger"

            onClick={() =>
              setProfileOpen(
                (value) => !value
              )
            }

            whileHover={{
              scale: 1.04,
            }}

            whileTap={{
              scale: 0.95,
            }}

            aria-label="Open profile menu"
          >

            <Avatar />

            <FaChevronDown
              className={`profile-arrow ${
                profileOpen
                  ? "open"
                  : ""
              }`}
            />

          </motion.button>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================== */}

          <AnimatePresence>

            {profileOpen && (

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
                  y: -10,
                  scale: 0.96,
                }}

                transition={{
                  duration: 0.2,
                }}
              >


                {/* USER HEADER */}

                <div className="dropdown-header">

                  <Avatar large />

                  <div className="dropdown-user-info">

                    <h4>
                      {name}
                    </h4>

                    <small>
                      {role}
                    </small>

                  </div>

                </div>


                {/* PROFILE */}

                <button
                  type="button"
                  onClick={() =>
                    goTo("/profile")
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
                    goTo("/settings")
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
            MOBILE TOGGLE
        ================================================== */}

        <motion.button
          type="button"

          className="mobile-toggle"

          aria-label={
            mobileOpen
              ? "Close Menu"
              : "Open Menu"
          }

          onClick={() =>
            setMobileOpen(
              (value) => !value
            )
          }

          whileTap={{
            scale: 0.9,
          }}
        >

          {mobileOpen ? (

            <FaChevronDown
              style={{
                transform:
                  "rotate(180deg)",
              }}
            />

          ) : (

            <FaTasks />

          )}

        </motion.button>

      </div>


      {/* =================================================
          MOBILE MENU
      ================================================== */}

      <AnimatePresence>

        {mobileOpen && (

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
              className="navbar-mobile-menu"

              initial={{
                opacity: 0,
                y: -15,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: -15,
              }}
            >

              {/* MOBILE NAV LINKS */}

              {links.map(
                (link) => (

                  <NavLink
                    key={link.path}

                    to={link.path}

                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                  >

                    {link.label}

                  </NavLink>

                )
              )}


              {/* MOBILE SETTINGS */}

              <NavLink
                to="/settings"

                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >

                Settings

              </NavLink>


              {/* MOBILE LOGOUT */}

              <button
                type="button"

                className="mobile-logout-btn"

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

          </motion.div>

        )}

      </AnimatePresence>

    </header>

  );

};


export default Navbar;