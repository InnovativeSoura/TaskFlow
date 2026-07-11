import {
  FaTasks,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../styles/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Company */}

        <div className="footer-column">

          <div className="footer-logo">

            <div className="footer-logo-icon">
              <FaTasks />
            </div>

            <div>
              <h2>TaskFlow</h2>
              <p>Project Management Platform</p>
            </div>

          </div>

          <p className="footer-description">
            TaskFlow helps individuals and teams
            manage projects, collaborate efficiently,
            and achieve goals with a modern,
            secure and intuitive workspace.
          </p>

        </div>

        {/* Quick Links */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <a href="#home">Home</a>

          <a href="#features">Features</a>

          <a href="#about">About</a>

          <a href="#contact">Contact</a>

        </div>

        {/* Contact */}

        <div className="footer-column">

          <h3>Contact</h3>

          <div className="footer-contact">

            <FaEnvelope />

            <span>support@taskflow.com</span>

          </div>

          <div className="footer-contact">

            <FaPhoneAlt />

            <span>+91 8100181321</span>

          </div>

          <div className="footer-contact">

            <FaMapMarkerAlt />

            <span>Kolkata, India</span>

          </div>

        </div>

        {/* Newsletter */}

        <div className="footer-column">

          <h3>Newsletter</h3>

          <p>
            Subscribe to receive updates,
            new features and announcements.
          </p>

          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >

            <input
              type="email"
              placeholder="Your Email"
            />

            <button>
              Subscribe
            </button>

          </form>

          <div className="footer-social">

            <a href="https://github.com/InnovativeSoura/TaskFlow">
              <FaGithub />
            </a>

            <a href="https://www.linkedin.com/in/souradipta-patra-310669260/">
              <FaLinkedin />
            </a>


          </div>

        </div>

      </div>

      <div className="footer-bottom">

        © {year} TaskFlow. All Rights Reserved.

      </div>

    </footer>
  );
};

export default Footer;