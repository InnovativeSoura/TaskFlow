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
  FaClock,
  FaRocket,
  FaLayerGroup,
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

        {/* ===================================================
            RIGHT PREMIUM PRODUCT PREVIEW
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

            <div className="hero-product-topbar">

              <div className="hero-product-brand">

                <div className="hero-product-logo">
                  <FaLayerGroup />
                </div>

                <div>
                  <strong>TaskFlow</strong>
                  <span>Workspace</span>
                </div>

              </div>

              <div className="hero-product-live">
                <span />
                Live
              </div>

            </div>

            {/* =================================================
                OVERVIEW LABEL
            ================================================= */}

            <div className="hero-product-label">
              PROJECT OVERVIEW
            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="hero-product-heading">

              <div>
                <h3>Workspace is ready</h3>
                <p>Your team is working efficiently.</p>
              </div>

              <div className="hero-product-users">

                <span>SP</span>
                <span>AR</span>
                <span>MK</span>

                <small>+18</small>

              </div>

            </div>

            {/* =================================================
                PROJECT CARD
            ================================================= */}

            <div className="hero-project-card">

              <div className="hero-project-card-top">

                <div className="hero-project-icon">
                  <FaRocket />
                </div>

                <div className="hero-project-name">
                  <strong>Website Redesign</strong>
                  <span>Product Development</span>
                </div>

                <strong className="hero-project-percent">
                  82%
                </strong>

              </div>

              <div className="hero-progress">
                <span />
              </div>

              <div className="hero-project-meta">
                <span>24 Tasks</span>
                <span>6 Members</span>
                <span>Due in 8 days</span>
              </div>

            </div>

            {/* =================================================
                RECENT TASKS
            ================================================= */}

            <div className="hero-recent-header">

              <strong>Recent Tasks</strong>

              <span>View all</span>

            </div>

            <div className="hero-task-list">

              <div className="hero-task">

                <div className="hero-task-check completed">
                  <FaCheck />
                </div>

                <div className="hero-task-info">
                  <strong>Design landing page</strong>
                  <span>Completed</span>
                </div>

                <div className="hero-task-avatar">
                  SP
                </div>

              </div>

              <div className="hero-task">

                <div className="hero-task-check">
                  <FaClock />
                </div>

                <div className="hero-task-info">
                  <strong>Build authentication</strong>
                  <span>In Progress</span>
                </div>

                <div className="hero-task-avatar blue">
                  AR
                </div>

              </div>

              <div className="hero-task">

                <div className="hero-task-check">
                  <FaArrowRight />
                </div>

                <div className="hero-task-info">
                  <strong>Deploy production build</strong>
                  <span>Upcoming</span>
                </div>

                <div className="hero-task-avatar green">
                  MK
                </div>

              </div>

            </div>

            {/* =================================================
                AUTH MINI PANEL
            ================================================= */}

            <div className="hero-mini-auth">

              <div className="hero-mini-auth-header">

                <div>
                  <span>SECURE ACCESS</span>
                  <strong>Welcome back 👋</strong>
                </div>

                <div className="hero-mini-auth-lock">
                  🔒
                </div>

              </div>

              <div className="hero-mini-input">
                <span>you@example.com</span>
              </div>

              <div className="hero-mini-input">
                <span>••••••••••••</span>
                <small>●</small>
              </div>

              <div className="hero-mini-login">
                <span>Sign in</span>
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