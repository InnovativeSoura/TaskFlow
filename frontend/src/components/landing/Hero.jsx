import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

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
            <span>Next Generation Project Management</span>
            <FaArrowRight />
          </div>


          {/* Heading */}

          <h1 className="tf-hero-title">
            <span>Manage Projects.</span>

            <span className="tf-gradient-text">
              Collaborate Faster.
            </span>

            <span>Deliver On Time.</span>
          </h1>


          {/* Description */}

          <p className="tf-hero-description">
            TaskFlow is an all-in-one project management platform built
            for modern teams. Plan projects, assign tasks, monitor
            progress and collaborate in real time — all from one
            intelligent workspace.
          </p>


          {/* Actions */}

          <div className="tf-hero-actions">

            <Link
              to="/register"
              className="tf-primary-cta"
            >
              <span>Start Free</span>
              <FaArrowRight />
            </Link>

            <a
              href="#features"
              className="tf-secondary-cta"
            >
              <span className="tf-play-icon">
                <FaPlay />
              </span>

              <span>Explore Features</span>
            </a>

          </div>


          {/* Benefits */}

          <div className="tf-hero-benefits">

            <div className="tf-benefit">
              <FaCheck />
              <span>Free Forever Plan</span>
            </div>

            <div className="tf-benefit">
              <FaCheck />
              <span>2 Minute Setup</span>
            </div>

            <div className="tf-benefit">
              <FaCheck />
              <span>No Credit Card Required</span>
            </div>

          </div>


          {/* Stats */}

          <div className="tf-hero-stats">

            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaUsers />
              </div>

              <div className="tf-stat-info">
                <strong>10K+</strong>
                <span>Teams</span>
              </div>

            </div>


            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaTasks />
              </div>

              <div className="tf-stat-info">
                <strong>500K+</strong>
                <span>Tasks Managed</span>
              </div>

            </div>


            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaClock />
              </div>

              <div className="tf-stat-info">
                <strong>99.9%</strong>
                <span>Uptime</span>
              </div>

            </div>


            <div className="tf-stat-card">

              <div className="tf-stat-icon">
                <FaChartLine />
              </div>

              <div className="tf-stat-info">
                <strong>4.9/5</strong>
                <span>User Rating</span>

                <div className="tf-stars">
                  ★ ★ ★ ★ ★
                </div>
              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT LOGIN PANEL
        =================================================== */}

        <div className="tf-auth-preview">

          <div className="tf-auth-card">

            {/* Top Status */}

            <div className="tf-auth-header">

              <div className="tf-workspace-status">
                <span className="tf-status-dot" />
                <span>Workspace is ready</span>
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


            {/* Login/Register Toggle */}

            <div className="tf-auth-tabs">

              <button
                type="button"
                className={
                  activeTab === "login"
                    ? "active"
                    : ""
                }
                onClick={() => setActiveTab("login")}
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
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>

            </div>


            {/* Heading */}

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


            {/* Form */}

            <form className="tf-auth-form">

              {/* Email */}

              <div className="tf-input-wrapper">

                <FaEnvelope />

                <input
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                />

              </div>


              {/* Password */}

              <div className="tf-input-wrapper">

                <FaLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="tf-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle password visibility"
                >
                  <FaEye />
                </button>

              </div>


              {/* Remember Me */}

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


              {/* Submit */}

              <button
                type="button"
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


            {/* Divider */}

            <div className="tf-divider">

              <span />

              <p>or continue with</p>

              <span />

            </div>


            {/* Social Buttons */}

            <div className="tf-social-buttons">

              <button
                type="button"
                className="tf-social-btn"
              >
                <FaGoogle />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="tf-social-btn"
              >
                <FaGithub />
                <span>Continue with GitHub</span>
              </button>

            </div>


            {/* Bottom Metrics */}

            <div className="tf-auth-metrics">

              <div className="tf-auth-metric">

                <div className="tf-metric-icon">
                  <FaRocket />
                </div>

                <div>
                  <strong>124</strong>
                  <span>Projects Completed</span>
                </div>

              </div>


              <div className="tf-auth-metric">

                <div className="tf-success-circle">
                  <span>✓</span>
                </div>

                <div>
                  <strong>96%</strong>
                  <span>Project Success Rate</span>
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

        <span>SCROLL TO EXPLORE</span>

        <div className="tf-scroll-line" />

      </div>

    </div>
  );
};

export default Hero;