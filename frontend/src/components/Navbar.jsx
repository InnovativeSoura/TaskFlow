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
  FaBars,
  FaTimes,
  FaCog,
  FaTasks,
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import NotificationBell from "./NotificationBell";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";




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




const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const menuRef = useRef(null);

  const {
    user,
    logout,
  } = useAuth();


  

  const [profileOpen, setProfileOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);


  

  const name = useMemo(() => {

    return (
      user?.name ||
      user?.username ||
      "User"
    );

  }, [user]);


  const role = useMemo(() => {

    return (
      user?.role ||
      "Member"
    );

  }, [user]);


  

  const initials = useMemo(() => {

    if (!name) {
      return "TF";
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {

      return words[0]
        .charAt(0)
        .toUpperCase();

    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();

  }, [name]);


  

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {

        setProfileOpen(false);

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


  

  useEffect(() => {

    setProfileOpen(false);

    setMobileOpen(false);

  }, [location.pathname]);


  

  const goTo = (path) => {

    setProfileOpen(false);

    setMobileOpen(false);

    navigate(path);

  };


  

  const handleLogout = async () => {

    try {

      if (typeof logout === "function") {

        await logout();

      }

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      navigate(
        "/",
        {
          replace: true,
        }
      );

    }

  };


  

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
              : "navbar-avatar"
          }
        />
      );

    }


    return (
      <div
        className={
          large
            ? "dropdown-avatar initials-avatar"
            : "navbar-avatar initials-avatar"
        }
      >
        {initials}
      </div>
    );

  };


  

  return (

    <header className="navbar">

      

      <div className="navbar-left">

        <nav
          className="navbar-links"
          aria-label="Primary navigation"
        >

          {links.map((link, index) => (

            <React.Fragment
              key={link.path}
            >

              {index > 0 && (
                <span
                  className="nav-divider"
                  aria-hidden="true"
                >
                  |
                </span>
              )}


              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `navbar-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >

                {link.label}

              </NavLink>

            </React.Fragment>

          ))}

        </nav>

      </div>


      

      <div className="navbar-right">


        

        <div className="navbar-action">

          <NotificationBell />

        </div>


        

        <motion.button
          type="button"
          className="navbar-icon-button"
          onClick={() =>
            goTo("/settings")
          }
          whileHover={{
            scale: 1.06,
            rotate: 7,
          }}
          whileTap={{
            scale: 0.94,
          }}
          title="Settings"
          aria-label="Settings"
        >

          <FaCog />

        </motion.button>


        

        <div
          className="profile-wrapper"
          ref={menuRef}
        >

          

          <motion.button
            type="button"
            className={`profile-trigger ${
              profileOpen
                ? "profile-trigger-open"
                : ""
            }`}
            onClick={() =>
              setProfileOpen(
                (previous) =>
                  !previous
              )
            }
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.95,
            }}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            title={name}
          >

            <Avatar />

            <motion.span
              className="profile-chevron"
              animate={{
                rotate: profileOpen
                  ? 180
                  : 0,
              }}
              transition={{
                duration: 0.2,
              }}
            >

              <FaChevronDown />

            </motion.span>

          </motion.button>


          

          <AnimatePresence>

            {profileOpen && (

              <motion.div
                className="profile-dropdown"
                role="menu"

                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                  transformOrigin:
                    "top right",
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

                

                <div className="dropdown-header">

                  <Avatar large />

                  <div className="dropdown-user-info">

                    <h4 title={name}>
                      {name}
                    </h4>

                    <span>
                      {role}
                    </span>

                  </div>

                </div>


                

                <div className="dropdown-divider" />


                

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() =>
                    goTo("/profile")
                  }
                  role="menuitem"
                >

                  <span className="dropdown-item-icon">

                    <FaUser />

                  </span>

                  <span className="dropdown-item-text">
                    Profile
                  </span>

                </button>


                

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() =>
                    goTo("/settings")
                  }
                  role="menuitem"
                >

                  <span className="dropdown-item-icon">

                    <FaCog />

                  </span>

                  <span className="dropdown-item-text">
                    Settings
                  </span>

                </button>


                

                <div className="dropdown-divider logout-divider" />


                

                <button
                  type="button"
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                  role="menuitem"
                >

                  <span className="dropdown-item-icon">

                    <FaSignOutAlt />

                  </span>

                  <span className="dropdown-item-text">
                    Logout
                  </span>

                </button>

              </motion.div>

            )}

          </AnimatePresence>

        </div>


        

        <motion.button
          type="button"
          className="mobile-toggle"
          onClick={() =>
            setMobileOpen(
              (previous) =>
                !previous
            )
          }
          whileTap={{
            scale: 0.9,
          }}
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
        >

          <AnimatePresence
            mode="wait"
            initial={false}
          >

            {mobileOpen ? (

              <motion.span
                key="close"
                initial={{
                  opacity: 0,
                  rotate: -90,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  rotate: 90,
                }}
              >

                <FaTimes />

              </motion.span>

            ) : (

              <motion.span
                key="open"
                initial={{
                  opacity: 0,
                  rotate: 90,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  rotate: -90,
                }}
              >

                <FaBars />

              </motion.span>

            )}

          </AnimatePresence>

        </motion.button>

      </div>


      

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
                y: -12,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: -12,
              }}

              transition={{
                duration: 0.2,
              }}
            >

              

              {links.map((link) => (

                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `mobile-nav-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >

                  {link.label}

                </NavLink>

              ))}


              

              <button
                type="button"
                className="mobile-nav-link mobile-button"
                onClick={() =>
                  goTo("/settings")
                }
              >

                <FaCog />

                <span>
                  Settings
                </span>

              </button>


              

              <button
                type="button"
                className="mobile-logout-btn"
                onClick={handleLogout}
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