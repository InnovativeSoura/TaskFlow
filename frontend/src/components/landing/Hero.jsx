// src/components/landing/Hero.jsx

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaShieldAlt,
  FaTasks,
  FaChartLine,
  FaCheck,
  FaLock,
  FaEnvelope,
  FaEye,
} from "react-icons/fa";

import "./Hero.css";

const Hero = () => {
  const authRef = useRef(null);

  /* =========================================================
     SCROLL TO AUTH
  ========================================================= */

  const scrollToAuth = (mode = "login") => {
    window.dispatchEvent(
      new CustomEvent("taskflow-auth-mode", {
        detail: { mode },
      })
    );

    window.setTimeout(() => {
      authRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  /* =========================================================
     GLOBAL AUTH SCROLL EVENT
  ========================================================= */

  useEffect(() => {
    const handleAuthScroll = (event) => {
      const mode = event?.detail?.mode || "login";

      window.dispatchEvent(
        new CustomEvent("taskflow-auth-mode", {
          detail: { mode },
        })
      );

      window.setTimeout(() => {
        authRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
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
            LEFT CONTENT
        =================================================== */}

        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          {/* BADGE */}

          <motion.div
            className="hero-badge"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 0.45,
            }}
          >
            <span className="hero-badge-dot" />

            <span>
              Next Generation Project Management
            </span>

            <FaArrowRight />
          </motion.div>

          {/* TITLE */}

          <h1 className="hero-title">
            <span>Manage Projects.</span>

            <span className="hero-title-gradient">
              Collaborate Faster.
            </span>

            <span>Deliver On Time.</span>
          </h1>

          {/* DESCRIPTION */}

          <p className="hero-description">
            TaskFlow is an all-in-one project management
            platform built for modern teams. Plan projects,
            assign tasks, monitor progress and collaborate
            in real time — all from one intelligent workspace.
          </p>

          {/* BUTTONS */}

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

          {/* TRUST ITEMS */}

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

        {/* ===================================================
            RIGHT PRODUCT PREVIEW
        =================================================== */}

        <motion.div
          ref={authRef}
          className="hero-right"
          id="auth-section"
          initial={{
            opacity: 0,
            x: 30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.1,
            ease: "easeOut",
          }}
        >
          <div className="hero-auth-glow" />

          <div className="hero-product-preview">
            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="preview-topbar">
              <div className="preview-brand">
                <div className="preview-brand-icon">
                  <FaTasks />
                </div>

                <div>
                  <strong>TaskFlow</strong>
                  <span>Workspace</span>
                </div>
              </div>

              <div className="preview-status">
                <span />
                Live
              </div>
            </div>

            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}

            <div className="preview-heading">
              <div>
                <span className="preview-eyebrow">
                  PROJECT OVERVIEW
                </span>

                <h3>Workspace is ready</h3>

                <p>
                  Your team is working efficiently.
                </p>
              </div>

              <div className="preview-avatars">
                <span>SP</span>
                <span>AR</span>
                <span>MK</span>
                <b>+18</b>
              </div>
            </div>

            {/* =================================================
                PROJECT CARD
            ================================================= */}

            <div className="preview-project-card">
              <div className="preview-project-top">
                <div className="preview-project-icon">
                  <FaChartLine />
                </div>

                <div className="preview-project-info">
                  <strong>Website Redesign</strong>
                  <span>Product Development</span>
                </div>

                <div className="preview-project-percent">
                  82%
                </div>
              </div>

              <div className="preview-progress">
                <span />
              </div>

              <div className="preview-project-footer">
                <span>24 Tasks</span>
                <span>6 Members</span>
                <span>Due in 8 days</span>
              </div>
            </div>

            {/* =================================================
                TASK LIST
            ================================================= */}

            <div className="preview-task-section">
              <div className="preview-section-heading">
                <strong>Recent Tasks</strong>
                <span>View all</span>
              </div>

              <div className="preview-task">
                <div className="preview-task-check completed">
                  <FaCheck />
                </div>

                <div className="preview-task-content">
                  <strong>Design landing page</strong>
                  <span>Completed</span>
                </div>

                <div className="preview-task-user">
                  SP
                </div>
              </div>

              <div className="preview-task">
                <div className="preview-task-check progress">
                  <FaArrowRight />
                </div>

                <div className="preview-task-content">
                  <strong>Build authentication</strong>
                  <span>In Progress</span>
                </div>

                <div className="preview-task-user blue">
                  AR
                </div>
              </div>

              <div className="preview-task">
                <div className="preview-task-check pending">
                  <FaTasks />
                </div>

                <div className="preview-task-content">
                  <strong>Deploy production build</strong>
                  <span>Upcoming</span>
                </div>

                <div className="preview-task-user green">
                  MK
                </div>
              </div>
            </div>

            {/* =================================================
                AUTH MINI PANEL
            ================================================= */}

            <div className="preview-auth-panel">
              <div className="preview-auth-panel-header">
                <div>
                  <span>SECURE ACCESS</span>
                  <strong>Welcome back 👋</strong>
                </div>

                <div className="preview-lock">
                  <FaLock />
                </div>
              </div>

              <div className="preview-input">
                <FaEnvelope />
                <span>you@example.com</span>
              </div>

              <div className="preview-input">
                <FaLock />
                <span>••••••••••••</span>

                <FaEye className="preview-eye" />
              </div>

              <div className="preview-login-button">
                Sign in
                <FaArrowRight />
              </div>
            </div>

            {/* =================================================
                BOTTOM METRICS
            ================================================= */}

            <div className="hero-auth-metrics">
              <div className="hero-auth-metric">
                <div className="hero-auth-metric-icon">
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

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <motion.a
        href="#features"
        className="hero-scroll"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1,
          duration: 0.5,
        }}
      >
        <span className="hero-scroll-line" />

        <span>Scroll to explore</span>
      </motion.a>
    </section>
  );
};

export default Hero;