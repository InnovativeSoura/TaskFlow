import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaTasks,
  FaArrowRight,
} from "react-icons/fa";

import "../../styles/LandingNavbar.css";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const toggleMenu = () =>
    setMenuOpen((prev) => !prev);

  const handleSectionScroll = (id) => {
    closeMenu();

    if (location.pathname !== "/") {
      window.location.href = `/${id}`;
      return;
    }

    const section = document.querySelector(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.header
      className={`landing-navbar ${
        scrolled ? "scrolled" : ""
      }`}
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
      }}
    >
      <div className="landing-navbar-container">
        {/* Logo */}

        <Link
          to="/"
          className="landing-logo"
          onClick={closeMenu}
        >
          <div className="landing-logo-icon">
            <FaTasks />
          </div>

          <div className="landing-logo-text">
            <h2>TaskFlow</h2>
            <span>Project Management</span>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <nav
          className={`landing-nav ${
            menuOpen ? "open" : ""
          }`}
        >
          <button
            className="landing-nav-link"
            onClick={() =>
              handleSectionScroll("#home")
            }
          >
            Home
          </button>

          <button
            className="landing-nav-link"
            onClick={() =>
              handleSectionScroll("#features")
            }
          >
            Features
          </button>

          <button
            className="landing-nav-link"
            onClick={() =>
              handleSectionScroll("#statistics")
            }
          >
            Statistics
          </button>

          <button
            className="landing-nav-link"
            onClick={() =>
              handleSectionScroll("#testimonials")
            }
          >
            Testimonials
          </button>

          <button
            className="landing-nav-link"
            onClick={() =>
              handleSectionScroll("#footer")
            }
          >
            Contact
          </button>

           <div className="landing-auth-buttons">
            <NavLink
              
              className="landing-register-btn"
              onClick={closeMenu}
            >
              Explore

              <FaArrowRight />
            </NavLink>
          </div>
        </nav>

        {/* Mobile Toggle */}

        <button
          className="landing-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

        {/* Mobile Background */}

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
              onClick={closeMenu}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default LandingNavbar;