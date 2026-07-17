import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTasks,
} from "react-icons/fa";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItems = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Features",
      to: "#features",
      hash: true,
    },
    {
      label: "Pricing",
      to: "/pricing",
    },
    {
      label: "About",
      to: "#footer",
      hash: true,
    },
  ];

  const handleHashNavigation = (id) => {
    closeMenu();

    const element = document.querySelector(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="landing-navbar">

      <div className="landing-navbar-container">

        <Link
          to="/"
          className="landing-logo"
        >
          <span className="landing-logo-icon">
            <FaTasks />
          </span>

          <span>
            TaskFlow
          </span>
        </Link>

        <nav className={`landing-nav ${menuOpen ? "open" : ""}`}>

          {navItems.map((item) =>
            item.hash ? (
              <button
                key={item.label}
                className="landing-nav-link landing-nav-button"
                onClick={() =>
                  handleHashNavigation(item.to)
                }
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className="landing-nav-link"
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            )
          )}

          <div className="landing-auth-buttons">

            <Link
              to="/login"
              className="landing-login-btn"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="landing-register-btn"
              onClick={closeMenu}
            >
              Get Started
            </Link>

          </div>

        </nav>

        <button
          className="landing-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </div>

    </header>
  );
};

export default LandingNavbar;