// src/components/landing/LandingNavbar.jsx

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaBars,
  FaTimes,
  FaTasks,
  FaArrowRight,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import { useTheme } from "../../context/ThemeContext";

import "./LandingNavbar.css";

/* =========================================================
   LANDING NAVBAR
========================================================= */

const LandingNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* =======================================================
     GLOBAL THEME
  ======================================================= */

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  /* =======================================================
     STATE
  ======================================================= */

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("home");

  /* =======================================================
     SCROLL DETECTION
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 30
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =======================================================
     ACTIVE SECTION DETECTION
  ======================================================= */

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const sectionIds = [
      "home",
      "features",
      "statistics",
      "testimonials",
      "footer",
    ];

    const handleActiveSection = () => {
      const scrollPosition =
        window.scrollY + 180;

      let currentSection = "home";

      sectionIds.forEach(
        (id) => {
          const section =
            document.getElementById(id);

          if (!section) {
            return;
          }

          if (
            section.offsetTop <=
            scrollPosition
          ) {
            currentSection = id;
          }
        }
      );

      setActiveSection(
        currentSection
      );
    };

    handleActiveSection();

    window.addEventListener(
      "scroll",
      handleActiveSection,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleActiveSection
      );
    };
  }, [location.pathname]);

  /* =======================================================
     CLOSE MOBILE MENU
  ======================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =======================================================
     TOGGLE MOBILE MENU
  ======================================================= */

  const toggleMenu = () => {
    setMenuOpen(
      (previous) => !previous
    );
  };

  /* =======================================================
     SECTION SCROLL
  ======================================================= */

  const handleSectionScroll = (
    id
  ) => {
    closeMenu();

    /*
      Already on landing page.
    */

    if (
      location.pathname === "/"
    ) {
      const section =
        document.querySelector(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    /*
      Navigate home first.
    */

    navigate("/");

    /*
      Wait for Home page to mount.
    */

    window.setTimeout(() => {
      const section =
        document.querySelector(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 350);
  };

  /* =======================================================
     EXPLORE PLATFORM
     -------------------------------------------------------
     Opens Login mode inside AuthCard.
  ======================================================= */

  const handleExplorePlatform = () => {
    closeMenu();

    /*
      Already on landing page.
    */

    if (
      location.pathname === "/"
    ) {
      window.dispatchEvent(
        new CustomEvent(
          "taskflow-scroll-auth",
          {
            detail: {
              mode: "login",
            },
          }
        )
      );

      return;
    }

    /*
      Navigate home.
    */

    navigate("/");

    /*
      Wait for landing page.
    */

    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(
          "taskflow-scroll-auth",
          {
            detail: {
              mode: "login",
            },
          }
        )
      );
    }, 400);
  };

  /* =======================================================
     LOGO CLICK
  ======================================================= */

  const handleLogoClick = () => {
    closeMenu();

    if (
      location.pathname === "/"
    ) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /* =======================================================
     NAV ITEM
  ======================================================= */

  const isActive = (section) => {
    if (
      location.pathname !== "/"
    ) {
      return false;
    }

    return (
      activeSection === section
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.header
      className={`
        landing-navbar
        ${scrolled ? "scrolled" : ""}
        ${darkMode ? "dark" : "light"}
      `}
      initial={{
        y: -80,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
    >

      <div className="landing-navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="landing-logo"
          onClick={
            handleLogoClick
          }
        >

          <motion.div
            className="landing-logo-icon"
            whileHover={{
              rotate: 8,
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.94,
            }}
          >
            <FaTasks />
          </motion.div>

          <div className="landing-logo-text">

            <h2>
              TaskFlow
            </h2>

            <span>
              Project Management
            </span>

          </div>

        </Link>


        {/* =================================================
            DESKTOP / MOBILE NAVIGATION
        ================================================= */}

        <nav
          className={`
            landing-nav
            ${menuOpen ? "open" : ""}
          `}
        >

          {/* ===============================================
              HOME
          =============================================== */}

          <button
            type="button"
            className={`
              landing-nav-link
              ${isActive("home")
                ? "active"
                : ""}
            `}
            onClick={() =>
              handleSectionScroll(
                "#home"
              )
            }
          >
            <span>
              Home
            </span>
          </button>


          {/* ===============================================
              FEATURES
          =============================================== */}

          <button
            type="button"
            className={`
              landing-nav-link
              ${isActive("features")
                ? "active"
                : ""}
            `}
            onClick={() =>
              handleSectionScroll(
                "#features"
              )
            }
          >
            <span>
              Features
            </span>
          </button>


          {/* ===============================================
              STATISTICS
          =============================================== */}

          <button
            type="button"
            className={`
              landing-nav-link
              ${isActive("statistics")
                ? "active"
                : ""}
            `}
            onClick={() =>
              handleSectionScroll(
                "#statistics"
              )
            }
          >
            <span>
              Statistics
            </span>
          </button>


          {/* ===============================================
              TESTIMONIALS
          =============================================== */}

          <button
            type="button"
            className={`
              landing-nav-link
              ${isActive("testimonials")
                ? "active"
                : ""}
            `}
            onClick={() =>
              handleSectionScroll(
                "#testimonials"
              )
            }
          >
            <span>
              Testimonials
            </span>
          </button>


          {/* ===============================================
              CONTACT
          =============================================== */}

          <button
            type="button"
            className={`
              landing-nav-link
              ${isActive("footer")
                ? "active"
                : ""}
            `}
            onClick={() =>
              handleSectionScroll(
                "#footer"
              )
            }
          >
            <span>
              Contact
            </span>
          </button>


          {/* =================================================
              THEME TOGGLE
          ================================================= */}

          <motion.button
            type="button"
            className={`
              landing-theme-toggle
              ${darkMode
                ? "theme-dark"
                : "theme-light"}
            `}
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
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.92,
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


          {/* =================================================
              EXPLORE PLATFORM
          ================================================= */}

          <div className="landing-auth-buttons">

            <motion.button
              type="button"
              className="landing-explore-btn"
              onClick={
                handleExplorePlatform
              }
              whileHover={{
                y: -2,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >

              <span>
                Explore Platform
              </span>

              <motion.span
                className="landing-explore-icon"
                whileHover={{
                  x: 4,
                }}
              >
                <FaArrowRight />
              </motion.span>

            </motion.button>

          </div>

        </nav>


        {/* =================================================
            MOBILE MENU TOGGLE
        ================================================= */}

        <button
          type="button"
          className="landing-menu-toggle"
          onClick={toggleMenu}
          aria-label={
            menuOpen
              ? "Close Navigation"
              : "Open Navigation"
          }
          aria-expanded={
            menuOpen
          }
        >

          <AnimatePresence
            mode="wait"
            initial={false}
          >

            {menuOpen ? (

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
                transition={{
                  duration: 0.2,
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
                transition={{
                  duration: 0.2,
                }}
              >
                <FaBars />
              </motion.span>

            )}

          </AnimatePresence>

        </button>


        {/* =================================================
            MOBILE OVERLAY
        ================================================= */}

        <AnimatePresence>

          {menuOpen && (

            <motion.div
              className="landing-mobile-overlay"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={
                closeMenu
              }
            />

          )}

        </AnimatePresence>

      </div>

    </motion.header>
  );
};

export default LandingNavbar;