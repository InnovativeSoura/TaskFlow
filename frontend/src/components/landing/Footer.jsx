import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaArrowUp,
  FaTasks,
  FaPaperPlane,
} from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      id="footer"
      className="landing-footer"
    >
      {/* Background Glow */}

      <div className="footer-glow"></div>

      <div className="footer-container">
        {/* =========================
            BRAND
        ========================= */}

        <motion.div
          className="footer-brand"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <FaTasks />
            </div>

            <div>
              <h2>TaskFlow</h2>
              <span>Project Management Platform</span>
            </div>
          </div>

          <p>
            TaskFlow is an intelligent project management
            platform that helps individuals, startups and
            enterprise teams collaborate, organize work,
            automate workflows and deliver projects faster
            than ever.
          </p>

          <div className="footer-social">
            <a
              href="#"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="#"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="#"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </motion.div>

        {/* =========================
            PRODUCT
        ========================= */}

        <motion.div
          className="footer-column"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
            duration: 0.6,
          }}
        >
          <h3>Product</h3>

          <Link to="/">Home</Link>

          <a href="#features">
            Features
          </a>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>
        </motion.div>

        {/* =========================
            PLATFORM
        ========================= */}

        <motion.div
          className="footer-column"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            delay: 0.2,
            duration: 0.6,
          }}
        >
          <h3>Platform</h3>

          <Link to="/projects">
            Projects
          </Link>

          <Link to="/tasks">
            Tasks
          </Link>

          <Link to="/kanban">
            Kanban Board
          </Link>

          <Link to="/reports">
            Reports
          </Link>

          <Link to="/settings">
            Settings
          </Link>
        </motion.div>

        {/* =========================
            NEWSLETTER
        ========================= */}

        <motion.div
          className="footer-newsletter"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
        >
          <h3>Stay Updated</h3>

          <p>
            Subscribe to receive product updates,
            productivity tips and the latest TaskFlow
            features directly in your inbox.
          </p>

          <div className="newsletter-box">
            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      </div>

      {/* =========================
          FOOTER BOTTOM
      ========================= */}

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} TaskFlow.
          All rights reserved. Designed for modern teams.
        </p>

        <div className="footer-links">
          <a href="#features">
            Features
          </a>

          <a href="#get-started">
            Get Started
          </a>

          <a href="#footer">
            Contact
          </a>

          <a href="#footer">
            Privacy Policy
          </a>
        </div>
      </div>

      {/* =========================
          SCROLL TO TOP
      ========================= */}

      <button
        className="scroll-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
}

export default Footer;