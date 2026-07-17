import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaArrowUp,
  FaTasks,
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
      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <div className="footer-logo">

            <div className="footer-logo-icon">
              <FaTasks />
            </div>

            <h2>TaskFlow</h2>

          </div>

          <p>
            TaskFlow is a modern project management
            platform that helps teams organize work,
            collaborate efficiently and deliver
            projects faster.
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

        </div>

        {/* Product */}

        <div className="footer-column">

          <h3>Product</h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/pricing">
            Pricing
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

        </div>

        {/* Platform */}

        <div className="footer-column">

          <h3>Platform</h3>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/projects">
            Projects
          </Link>

          <Link to="/tasks">
            Tasks
          </Link>

          <Link to="/analytics">
            Analytics
          </Link>

        </div>

        {/* Support */}

        <div className="footer-column">

          <h3>Resources</h3>

          <a href="#features">
            Features
          </a>

          <Link to="/pricing">
            Pricing
          </Link>

          <a href="#footer">
            Contact
          </a>

          <a href="#footer">
            Privacy Policy
          </a>

        </div>

      </div>

      {/* Bottom */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} TaskFlow.
          All rights reserved.
        </p>

        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>

      </div>

    </footer>
  );
}

export default Footer;