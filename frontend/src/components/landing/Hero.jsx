/* =========================================================
   TASKFLOW HERO
   Premium Landing Page Hero
========================================================= */

import React from "react";
import {
  FaArrowRight,
  FaPlay,
  FaCheck,
  FaListAlt,
  FaChartLine,
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaGoogle,
  FaGithub,
  FaClipboardCheck,
} from "react-icons/fa";

import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero-section" id="home">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-glow hero-glow-three" />

      <div className="hero-grid" />

      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-orb hero-orb-three" />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="hero-container">
        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="hero-content">
          {/* Badge */}

          <div className="hero-badge">
            <span className="hero-badge-dot" />

            <span>Next Generation Project Management</span>

            <FaArrowRight />
          </div>

          {/* Main Heading */}

          <h1 className="hero-title">
            <span>Manage Projects.</span>

            <span className="hero-title-gradient">
              Collaborate Faster.
            </span>

            <span>Deliver On Time.</span>
          </h1>

          {/* Description */}

          <p className="hero-description">
            TaskFlow is an all-in-one project management platform built for
            modern teams. Plan projects, assign tasks, monitor progress and
            collaborate in real time — all from one intelligent workspace.
          </p>

          {/* CTA Buttons */}

          <div className="hero-buttons">
            <a href="#platform" className="hero-primary-btn">
              <span>Start Free</span>
              <FaArrowRight />
            </a>

            <a href="#features" className="hero-secondary-btn">
              <span className="hero-play-icon">
                <FaPlay />
              </span>

              <span>
                Explore
                <br />
                Features
              </span>
            </a>
          </div>

          {/* Trust Points */}

          <div className="hero-trust">
            <div className="hero-trust-item">
              <FaCheck />
              <span>Free Forever Plan</span>
            </div>

            <div className="hero-trust-item">
              <FaCheck />
              <span>No Credit Card</span>
            </div>

            <div className="hero-trust-item">
              <FaCheck />
              <span>2 Minute Setup</span>
            </div>

            <div className="hero-trust-item">
              <FaCheck />
              <span>Cloud Sync Included</span>
            </div>
          </div>

          {/* Mini Stats */}

          <div className="hero-mini-stats">
            <div className="hero-mini-stat">
              <div className="hero-mini-stat-icon">
                <FaListAlt />
              </div>

              <div className="hero-mini-stat-content">
                <strong>10K+</strong>
                <span>Teams</span>
              </div>
            </div>

            <div className="hero-mini-stat">
              <div className="hero-mini-stat-icon">
                <FaChartLine />
              </div>

              <div className="hero-mini-stat-content">
                <strong>50K+</strong>
                <span>Tasks Managed</span>
              </div>
            </div>

            <div className="hero-mini-stat">
              <div className="hero-mini-stat-icon">
                <FaShieldAlt />
              </div>

              <div className="hero-mini-stat-content">
                <strong>99.9%</strong>
                <span>Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="hero-right">
          {/* Authentication Glow */}

          <div className="hero-auth-glow" />

          {/* =================================================
              WORKSPACE CARD
          ================================================= */}

          <div className="hero-product-preview">
            {/* ===============================================
                STATUS HEADER
            =============================================== */}

            <div className="hero-product-topbar">
              <div className="hero-product-live">
                <span />
                <span>Workspace is ready</span>
              </div>

              <div className="hero-product-users">
                <span>S</span>
                <span>A</span>
                <span>K</span>
                <small>+18</small>
              </div>
            </div>

            {/* ===============================================
                AUTH CONTENT
            =============================================== */}

            <div className="hero-auth-content">
              {/* Auth Toggle */}

              <div className="hero-auth-toggle">
                <button type="button" className="hero-auth-tab">
                  Register
                </button>

                <button
                  type="button"
                  className="hero-auth-tab active"
                >
                  Login
                </button>
              </div>

              {/* Heading */}

              <div className="hero-auth-heading">
                <h2>
                  Welcome Back <span>👋</span>
                </h2>

                <p>
                  Sign in to continue managing your projects.
                </p>
              </div>

              {/* =============================================
                  LOGIN FORM
              ============================================= */}

              <div className="hero-auth-form">
                {/* Email */}

                <div className="hero-auth-field">
                  <label htmlFor="hero-email">
                    Email
                  </label>

                  <div className="hero-auth-input">
                    <FaEnvelope />

                    <span id="hero-email">
                      sourav@gmail.com
                    </span>
                  </div>
                </div>

                {/* Password */}

                <div className="hero-auth-field">
                  <label htmlFor="hero-password">
                    Password
                  </label>

                  <div className="hero-auth-input">
                    <FaLock />

                    <span id="hero-password">
                      ••••••••••••
                    </span>

                    <FaEye className="hero-password-eye" />
                  </div>
                </div>

                {/* Remember / Forgot */}

                <div className="hero-auth-options">
                  <div className="hero-remember">
                    <span className="hero-checkbox">
                      <FaCheck />
                    </span>

                    <span>Remember me</span>
                  </div>

                  <span className="hero-forgot">
                    Forgot Password?
                  </span>
                </div>

                {/* Sign In */}

                <button
                  type="button"
                  className="hero-auth-submit"
                >
                  <span>Sign In</span>
                  <FaArrowRight />
                </button>
              </div>

              {/* =============================================
                  DIVIDER
              ============================================= */}

              <div className="hero-auth-divider">
                <span />
                <p>or continue with</p>
                <span />
              </div>

              {/* =============================================
                  SOCIAL LOGIN
              ============================================= */}

              <div className="hero-social-login">
                <button type="button" className="hero-social-btn">
                  <FaGoogle />

                  <span>Continue with Google</span>
                </button>

                <button type="button" className="hero-social-btn">
                  <FaGithub />

                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* =============================================
                  REGISTER LINK
              ============================================= */}

              <div className="hero-register-footer">
                <p>Don’t have an account?</p>

                <button type="button">
                  Register Now
                </button>
              </div>
            </div>

            {/* ===============================================
                WORKSPACE STATS
            =============================================== */}

            <div className="hero-workspace-stats">
              {/* Tasks Completed */}

              <div className="hero-workspace-stat">
                <div className="hero-workspace-stat-icon">
                  <FaClipboardCheck />
                </div>

                <div className="hero-workspace-stat-content">
                  <strong>124</strong>
                  <span>Tasks Completed</span>
                </div>
              </div>

              {/* Project Success */}

              <div className="hero-workspace-stat success">
                <div className="hero-workspace-stat-icon">
                  <FaChartLine />
                </div>

                <div className="hero-workspace-stat-content">
                  <strong>96%</strong>
                  <span>Project Success</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <a href="#features" className="hero-scroll">
        <span>Scroll to explore</span>

        <span className="hero-scroll-line" />
      </a>
    </section>
  );
};

export default Hero;