import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaBars,
  FaTimes,
  FaTasks,
} from "react-icons/fa";

import "../styles/LandingNavbar.css";

const LandingNavbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const closeMenu = () => setMobileMenu(false);

  return (
    <motion.header
      className="landing-navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}

      <div className="landing-logo">

        <div className="landing-logo-icon">

          <FaTasks />

        </div>

        <div className="landing-logo-text">

          <h2>TaskFlow</h2>

          <span>Project Management</span>

        </div>

      </div>

      {/* Navigation */}

      <nav
        className={
          mobileMenu
            ? "landing-nav active"
            : "landing-nav"
        }
      >
        <a href="#home" onClick={closeMenu}>
          Home
        </a>

        <a href="#features" onClick={closeMenu}>
          Features
        </a>

        <a href="#about" onClick={closeMenu}>
          About
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
      </nav>

      {/* Buttons */}

      <div className="landing-actions">

        <Link
          to="/login"
          className="login-btn"
        >
          Login
        </Link>

        <button
            className="register-btn"
            onClick={() =>
                navigate("/login?mode=register")
            }
        >
            Register
        </button>
      </div>

      {/* Mobile */}

      <button
        className="mobile-menu-btn"
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
    </motion.header>
  );
};

export default LandingNavbar;