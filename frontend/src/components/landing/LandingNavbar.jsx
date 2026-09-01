import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { FaBars, FaTimes, FaTasks, FaArrowRight } from "react-icons/fa";

import "./LandingNavbar.css";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSectionScroll = (id) => {
    closeMenu();

    if (location.pathname === "/") {
      const section = document.querySelector(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    navigate("/");

    setTimeout(() => {
      const section = document.querySelector(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  const handleExplorePlatform = () => {
    closeMenu();

    window.dispatchEvent(
      new CustomEvent("taskflow-auth-mode", {
        detail: {
          mode: "login",
        },
      }),
    );

    const authCard = document.querySelector(".tf-auth-preview");

    if (authCard) {
      authCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleLogoClick = () => {
    closeMenu();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.header
      className={`landing-navbar ${scrolled ? "scrolled" : ""}`}
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
        <Link to="/" className="landing-logo" onClick={handleLogoClick}>
          <div className="landing-logo-icon">
            <FaTasks />
          </div>

          <div className="landing-logo-text">
            <h2>TaskFlow</h2>

            <span>Project Management</span>
          </div>
        </Link>

        <nav className={`landing-nav ${menuOpen ? "open" : ""}`}>
          <button
            type="button"
            className="landing-nav-link"
            onClick={() => handleSectionScroll("#home")}
          >
            Home
          </button>

          <button
            type="button"
            className="landing-nav-link"
            onClick={() => handleSectionScroll("#features")}
          >
            Features
          </button>

          <button
            type="button"
            className="landing-nav-link"
            onClick={() => handleSectionScroll("#statistics")}
          >
            Statistics
          </button>

          <button
            type="button"
            className="landing-nav-link"
            onClick={() => handleSectionScroll("#testimonials")}
          >
            Testimonials
          </button>

          <button
            type="button"
            className="landing-nav-link"
            onClick={() => handleSectionScroll("#footer")}
          >
            Contact
          </button>

          <div className="landing-auth-buttons">
            <motion.button
              type="button"
              className="landing-explore-btn"
              onClick={handleExplorePlatform}
              whileHover={{
                y: -2,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span>Explore Platform</span>

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

        <button
          type="button"
          className="landing-menu-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Navigation" : "Open Navigation"}
          aria-expanded={menuOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
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
              onClick={closeMenu}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default LandingNavbar;
