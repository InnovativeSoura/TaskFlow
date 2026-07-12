import { useState } from "react";
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
        className={`landing-nav ${mobileMenu ? "active" : ""}`}
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

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenu((prev) => !prev)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenu ? <FaTimes /> : <FaBars />}
      </button>
    </motion.header>
  );
};

export default LandingNavbar;