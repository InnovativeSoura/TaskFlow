// src/components/landing/Footer.jsx

import React from "react";
import {
  FaTasks,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaArrowUp,
  FaArrowRight,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavigation = (id) => {
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="landing-footer">

      {/* ==========================================
          FOOTER MAIN
      ========================================== */}

      <div className="footer-container">

        {/* ==========================================
            BRAND
        ========================================== */}

        <div className="footer-brand">

          <div className="footer-logo">
            <div className="footer-logo-icon">
              <FaTasks />
            </div>

            <div className="footer-logo-text">
              <h3>TaskFlow</h3>
              <span>Project Management Platform</span>
            </div>
          </div>

          <p className="footer-description">
            TaskFlow is an intelligent project management platform
            that helps individuals, startups and enterprise teams
            collaborate, organize work, automate workflows and
            deliver projects faster than ever.
          </p>

          <div className="footer-socials">

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

          </div>
        </div>

        {/* ==========================================
            PRODUCT
        ========================================== */}

        <div className="footer-column">

          <h4>Product</h4>

          <ul>
            <li>
              <button onClick={() => handleNavigation("home")}>
                Home
              </button>
            </li>

            <li>
              <button onClick={() => handleNavigation("features")}>
                Features
              </button>
            </li>

            <li>
              <button onClick={() => handleNavigation("statistics")}>
                Statistics
              </button>
            </li>

            <li>
              <a href="/login">
                Login
              </a>
            </li>

            <li>
              <a href="/register">
                Register
              </a>
            </li>

            <li>
              <a href="/dashboard">
                Dashboard
              </a>
            </li>
          </ul>

        </div>

        {/* ==========================================
            PLATFORM
        ========================================== */}

        <div className="footer-column">

          <h4>Platform</h4>

          <ul>
            <li>
              <a href="/projects">
                Projects
              </a>
            </li>

            <li>
              <a href="/tasks">
                Tasks
              </a>
            </li>

            <li>
              <a href="/kanban">
                Kanban Board
              </a>
            </li>

            <li>
              <a href="/reports">
                Reports
              </a>
            </li>

            <li>
              <a href="/settings">
                Settings
              </a>
            </li>
          </ul>

        </div>

        {/* ==========================================
            NEWSLETTER
        ========================================== */}

        <div className="footer-newsletter">

          <h4>Stay Updated</h4>

          <p>
            Subscribe to receive product updates, productivity tips
            and the latest TaskFlow features directly in your inbox.
          </p>

          <form
            className="footer-subscribe"
            onSubmit={(e) => e.preventDefault()}
          >

            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              required
            />

            <button
              type="submit"
              aria-label="Subscribe"
            >
              <FaArrowRight />
            </button>

          </form>

          <span className="newsletter-note">
            No spam. Unsubscribe anytime.
          </span>

        </div>

      </div>

      {/* ==========================================
          FOOTER BOTTOM
      ========================================== */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
            <span> Designed for modern teams.</span>
          </p>

          <div className="footer-legal">

            <a href="/features">
              Features
            </a>

            <a href="/get-started">
              Get Started
            </a>

            <a href="/contact">
              Contact
            </a>

            <a href="/privacy">
              Privacy
            </a>

            <a href="/terms">
              Terms
            </a>

          </div>

        </div>

      </div>

      {/* ==========================================
          BACK TO TOP
      ========================================== */}

      <button
        type="button"
        className="footer-back-top"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>

    </footer>
  );
};

export default Footer;