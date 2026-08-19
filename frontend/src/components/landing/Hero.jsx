import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaShieldAlt,
  FaTasks,
  FaChartLine,
  FaEnvelope,
  FaLock,
  FaEye,
  FaGoogle,
  FaGithub,
  FaUsers,
} from "react-icons/fa";

import "./Hero.css";

const Hero = () => {
  const authRef = useRef(null);

  const scrollToAuth = (mode = "login") => {
    window.dispatchEvent(
      new CustomEvent("taskflow-auth-mode", {
        detail: { mode },
      })
    );

    setTimeout(() => {
      authRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  useEffect(() => {
    const handleAuthScroll = (event) => {
      const mode = event.detail?.mode || "login";

      window.dispatchEvent(
        new CustomEvent("taskflow-auth-mode", {
          detail: { mode },
        })
      );

      setTimeout(() => {
        authRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 80);
    };

    window.addEventListener(
      "taskflow-scroll-auth",
      handleAuthScroll
    );

    return () => {
      window.removeEventListener(
        "taskflow-scroll-auth",
        handleAuthScroll
      );
    };
  }, []);

  return (
    <section className="hero-section" id="home">
      {/* BACKGROUND */}
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-glow hero-glow-three" />
      <div className="hero-grid" />

      {/* DECORATIVE ORBS */}
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-orb hero-orb-three" />

      <div className="hero-container">
        {/* =========================================
            LEFT SIDE
        ========================================= */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
          >
            <span className="hero-badge-dot" />

            <span>
              Next Generation Project Management
            </span>

            <FaArrowRight />
          </motion.div>

          <h1 className="hero-title">
            Manage Projects.
            <br />

            <span className="hero-title-gradient">
              Collaborate Faster.
            </span>

            <br />

            Deliver On Time.
          </h1>

          <p className="hero-description">
            TaskFlow is an all-in-one project management
            platform built for modern teams. Plan projects,
            assign tasks, monitor progress and collaborate
            in real time — all from one intelligent workspace.
          </p>

          {/* ACTION BUTTONS */}
          <div className="hero-buttons">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={() => scrollToAuth("register")}
            >
              <span>Start Free</span>
              <FaArrowRight />
            </button>

            <a
              href="#features"
              className="hero-secondary-btn"
            >
              <span className="hero-play-icon">
                <FaPlay />
              </span>

              <span>Explore Features</span>
            </a>
          </div>

          {/* TRUST */}
          <div className="hero-trust">
            <div className="hero-trust-item">
              <FaCheckCircle />
              <span>Free Forever Plan</span>
            </div>

            <div className="hero-trust-item">
              <FaCheckCircle />
              <span>No Credit Card</span>
            </div>

            <div className="hero-trust-item">
              <FaCheckCircle />
              <span>2 Minute Setup</span>
            </div>

            <div className="hero-trust-item">
              <FaCheckCircle />
              <span>Cloud Sync Included</span>
            </div>
          </div>

          {/* MINI STATS */}
          <div className="hero-mini-stats">
            <div className="hero-mini-stat">
              <div className="hero-mini-stat-icon">
                <FaTasks />
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
                <span>Secure</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================
            RIGHT SIDE — STATIC AUTH PREVIEW
        ========================================= */}
        <motion.div
          ref={authRef}
          className="hero-right"
          id="auth-section"
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: "easeOut",
          }}
        >
          <div className="hero-auth-glow" />

          <div className="hero-auth-wrapper">
            {/* TOP BAR */}
            <div className="hero-auth-top">
              <div className="hero-auth-status">
                <span className="hero-status-dot" />
                <span>Workspace is ready</span>
              </div>

              <div className="hero-auth-users">
                <span className="hero-avatar avatar-one">
                  S
                </span>

                <span className="hero-avatar avatar-two">
                  A
                </span>

                <span className="hero-avatar avatar-three">
                  R
                </span>

                <span className="hero-avatar-count">
                  +18
                </span>
              </div>
            </div>

            {/* =====================================
                PREVIEW CARD
            ===================================== */}
            <div className="hero-preview-card">
              <div className="hero-preview-check">
                ✓
              </div>

              <h3 className="hero-preview-title">
                Workspace is ready
              </h3>

              <p className="hero-preview-subtitle">
                Your project hub is online
              </p>

              {/* LOGIN / REGISTER SWITCH */}
              <div className="hero-preview-tabs">
                <button
                  type="button"
                  className="hero-preview-tab active"
                  onClick={() => scrollToAuth("login")}
                >
                  Login
                </button>

                <button
                  type="button"
                  className="hero-preview-tab"
                  onClick={() => scrollToAuth("register")}
                >
                  Register
                </button>
              </div>

              <div className="hero-preview-divider" />

              <div className="hero-preview-welcome">
                <strong>Welcome Back 👋</strong>
                <span>
                  Sign in to continue managing your projects.
                </span>
              </div>

              {/* EMAIL */}
              <div className="hero-preview-field">
                <FaEnvelope />

                <span>
                  soura@gmail.com
                </span>
              </div>

              {/* PASSWORD */}
              <div className="hero-preview-field">
                <FaLock />

                <span>
                  ••••••••••
                </span>

                <FaEye className="hero-preview-eye" />
              </div>

              <div className="hero-preview-forgot">
                Forgot Password?
              </div>

              {/* SIGN IN */}
              <button
                type="button"
                className="hero-preview-signin"
                onClick={() => scrollToAuth("login")}
              >
                Sign In
                <FaArrowRight />
              </button>

              {/* OR */}
              <div className="hero-preview-or">
                <span />
                <small>or continue with</small>
                <span />
              </div>

              {/* GOOGLE */}
              <button
                type="button"
                className="hero-preview-social"
                onClick={() => scrollToAuth("login")}
              >
                <FaGoogle />
                <span>Continue with Google</span>
              </button>

              {/* GITHUB */}
              <button
                type="button"
                className="hero-preview-social"
                onClick={() => scrollToAuth("login")}
              >
                <FaGithub />
                <span>Continue with GitHub</span>
              </button>

              <div className="hero-preview-register">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => scrollToAuth("register")}
                >
                  Register Now
                </button>
              </div>
            </div>

            {/* =====================================
                BOTTOM METRICS
            ===================================== */}
            <div className="hero-auth-metrics">
              <div className="hero-auth-metric">
                <div className="hero-auth-metric-icon blue">
                  <FaTasks />
                </div>

                <div className="hero-auth-metric-content">
                  <strong>124</strong>
                  <span>Tasks Completed</span>
                </div>
              </div>

              <div className="hero-auth-metric">
                <div className="hero-auth-metric-icon green">
                  <FaChartLine />
                </div>

                <div className="hero-auth-metric-content">
                  <strong>96%</strong>
                  <span>Project Success</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SCROLL */}
      <motion.a
        href="#features"
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="hero-scroll-line" />

        <span>Scroll to explore</span>
      </motion.a>
    </section>
  );
};

export default Hero;