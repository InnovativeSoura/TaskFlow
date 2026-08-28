// src/components/landing/Hero.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaCheck,
  FaPlay,
  FaEnvelope,
  FaLock,
  FaEye,
  FaGoogle,
  FaGithub,
  FaUsers,
  FaTasks,
  FaClock,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";

import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  /* =========================================================
     AUTH ACTION
  ========================================================= */

  const handleAuthSubmit = (event) => {
    event.preventDefault();

    if (activeTab === "login") {
      navigate("/login");
      return;
    }

    navigate("/register");
  };

  /* =========================================================
     SOCIAL AUTH
     
     We intentionally route to the normal authentication page
     instead of inventing backend OAuth endpoints.
     
     Your actual Google/GitHub OAuth implementation can later
     be connected here without changing the landing layout.
  ========================================================= */

  const handleGoogleLogin = () => {
    navigate("/login");
  };

  const handleGithubLogin = () => {
    navigate("/login");
  };

  return (
    <div className="tf-hero">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="tf-hero-glow tf-hero-glow-left" />
      <div className="tf-hero-glow tf-hero-glow-right" />

      <div className="tf-hero-ring tf-ring-one" />
      <div className="tf-hero-ring tf-ring-two" />

      <div className="tf-hero-grid" />


      {/* =====================================================
          HERO CONTAINER
      ===================================================== */}

      <div className="tf-hero-container">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="tf-hero-content">

          {/* Badge */}

          <div className="tf-hero-badge">
            <FaRocket />

            <span>
              Next Generation Project Management
            </span>

            <FaArrowRight />
          </div>


          {/* Heading */}

          <h1 className="tf-hero-title">

            <span>
              Manage Projects.
            </span>

            <span className="tf-gradient-text">
              Collaborate Faster.
            </span>

            <span>
              Deliver On Time.
            </span>

          </h1>


          {/* Description */}

          <p className="tf-hero-description">
            TaskFlow is an all-in-one project management platform built
            for modern teams. Plan projects, assign tasks, monitor
            progress and collaborate in real time — all from one
            intelligent workspace.
          </p>


          {/* =================================================
              HERO ACTIONS
          ================================================= */}

          <div className="tf-hero-actions">

            <Link
              to="/register"
              className="tf-primary-cta"
            >
              <span>
                Start Free
              </span>

              <FaArrowRight />
            </Link>


            <a
              href="#features"
              className="tf-secondary-cta"
            >
              <span className="tf-play-icon">
                <FaPlay />
              </span>

              <span>
                Explore Features
              </span>
            </a>

          </div>


          {/* =================================================
              BENEFITS
          ================================================= */}

          <div className="tf-hero-benefits">

            <div className="tf-benefit">
              <FaCheck />
              <span>
                Free Forever Plan
              </span>
            </div>

            <div className="tf-benefit">
              <FaCheck />
              <span>
                2 Minute Setup
              </span>
            </div>

            <div className="tf-benefit">
              <FaCheck />
              <span>
                No Credit Card Required
              </span>
            </div>

          </div>


          {/* =================================================
              STATS
          ================================================= */}

          <div className="tf-hero-stats">

            {/* Teams */}

            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaUsers />
              </div>

              <div className="tf-stat-info">

                <strong>
                  10K+
                </strong>

                <span>
                  Teams
                </span>

              </div>

            </div>


            {/* Tasks */}

            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaTasks />
              </div>

              <div className="tf-stat-info">

                <strong>
                  500K+
                </strong>

                <span>
                  Tasks Managed
                </span>

              </div>

            </div>


            {/* Uptime */}

            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaClock />
              </div>

              <div className="tf-stat-info">

                <strong>
                  99.9%
                </strong>

                <span>
                  Uptime
                </span>

              </div>

            </div>


            {/* Rating */}

            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaChartLine />
              </div>

              <div className="tf-stat-info">

                <strong>
                  4.9/5
                </strong>

                <span>
                  User Rating
                </span>

                <div className="tf-stars">
                  ★ ★ ★ ★ ★
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT AUTH PREVIEW
        =================================================== */}

        <div className="tf-auth-preview">

          <div className="tf-auth-card">

            {/* =================================================
                TOP STATUS
            ================================================= */}

            <div className="tf-auth-header">

              <div className="tf-workspace-status">

                <span className="tf-status-dot" />

                <span>
                  Workspace is ready
                </span>

              </div>


              <div className="tf-team-avatars">

                <span className="tf-avatar tf-avatar-purple">
                  S
                </span>

                <span className="tf-avatar tf-avatar-blue">
                  A
                </span>

                <span className="tf-avatar tf-avatar-cyan">
                  K
                </span>

                <span className="tf-avatar-more">
                  +12
                </span>

              </div>

            </div>


            {/* =================================================
                LOGIN / REGISTER TABS
            ================================================= */}

            <div className="tf-auth-tabs">

              <button
                type="button"
                className={
                  activeTab === "login"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setActiveTab("login");
                  setShowPassword(false);
                }}
              >
                Login
              </button>


              <button
                type="button"
                className={
                  activeTab === "register"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setActiveTab("register");
                  setShowPassword(false);
                }}
              >
                Register
              </button>

            </div>


            {/* =================================================
                AUTH TITLE
            ================================================= */}

            <div className="tf-auth-title">

              <h2>
                {activeTab === "login"
                  ? "Welcome Back 👋"
                  : "Create Your Account 🚀"}
              </h2>


              <p>
                {activeTab === "login"
                  ? "Sign in to continue managing your projects."
                  : "Start managing your projects with TaskFlow."}
              </p>

            </div>


            {/* =================================================
                AUTH FORM
            ================================================= */}

            <form
              className="tf-auth-form"
              onSubmit={handleAuthSubmit}
            >

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="tf-input-wrapper">

                <FaEnvelope />

                <input
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  aria-label="Email address"
                />

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="tf-input-wrapper">

                <FaLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••••••"
                  autoComplete={
                    activeTab === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  aria-label="Password"
                />


                <button
                  type="button"
                  className="tf-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <FaEye />
                </button>

              </div>


              {/* =================================================
                  REMEMBER ME
                  
                  Forgot password intentionally removed.
              ================================================= */}

              {activeTab === "login" && (

                <div className="tf-remember-row">

                  <label className="tf-checkbox-label">

                    <input
                      type="checkbox"
                      defaultChecked
                    />

                    <span className="tf-custom-checkbox">
                      <FaCheck />
                    </span>

                    <span>
                      Remember me
                    </span>

                  </label>

                </div>

              )}


              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}

              <button
                type="submit"
                className="tf-auth-submit"
              >

                <span>
                  {activeTab === "login"
                    ? "Sign In"
                    : "Create Account"}
                </span>

                <FaArrowRight />

              </button>

            </form>


            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="tf-divider">

              <span />

              <p>
                or continue with
              </p>

              <span />

            </div>


            {/* =================================================
                SOCIAL BUTTONS
            ================================================= */}

            <div className="tf-social-buttons">

              <button
                type="button"
                className="tf-social-btn"
                onClick={handleGoogleLogin}
              >

                <FaGoogle />

                <span>
                  Continue with Google
                </span>

              </button>


              <button
                type="button"
                className="tf-social-btn"
                onClick={handleGithubLogin}
              >

                <FaGithub />

                <span>
                  Continue with GitHub
                </span>

              </button>

            </div>


            {/* =================================================
                BOTTOM METRICS
            ================================================= */}

            <div className="tf-auth-metrics">

              {/* Projects */}

              <div className="tf-auth-metric">

                <div className="tf-metric-icon">
                  <FaRocket />
                </div>

                <div>

                  <strong>
                    124
                  </strong>

                  <span>
                    Projects Completed
                  </span>

                </div>

              </div>


              {/* Success Rate */}

              <div className="tf-auth-metric">

                <div className="tf-success-circle">
                  <span>
                    ✓
                  </span>
                </div>

                <div>

                  <strong>
                    96%
                  </strong>

                  <span>
                    Project Success Rate
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <div className="tf-scroll-indicator">

        <span>
          SCROLL TO EXPLORE
        </span>

        <div className="tf-scroll-line" />

      </div>

    </div>
  );
};

export default Hero;