import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaShieldAlt,
  FaTasks,
  FaChartLine,
} from "react-icons/fa";

import AuthCard from "../auth/AuthCard";

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

    setTimeout(() => {
      authRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  /* =========================================================
     GLOBAL AUTH SCROLL EVENT
  ========================================================= */

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

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="hero-background">
        <div className="hero-grid" />

        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-glow hero-glow-three" />

        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-orb hero-orb-three" />
      </div>

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
            x: -35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
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
              delay: 0.15,
              duration: 0.5,
            }}
          >
            <span className="hero-badge-dot" />

            <span className="hero-badge-text">
              Next Generation Project Management
            </span>

            <FaArrowRight className="hero-badge-arrow" />
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

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

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

          {/* =================================================
              TRUST ITEMS
          ================================================= */}

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

          {/* =================================================
              MINI STATS
          ================================================= */}

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
            RIGHT PRODUCT / AUTH PREVIEW
        =================================================== */}

        <motion.div
          ref={authRef}
          className="hero-right"
          id="auth-section"
          initial={{
            opacity: 0,
            x: 35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* SOFT GLOW */}

          <div className="hero-auth-glow" />

          {/* =================================================
              PRODUCT PREVIEW
          ================================================= */}

          <div className="hero-auth-preview">

            {/* TOP BAR */}

            <div className="hero-auth-top">

              <div className="hero-auth-status">
                <span className="hero-auth-status-dot" />
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

            {/* AUTH CARD */}

            <div className="hero-auth-card-container">
              <AuthCard
                compact
                onAuthReady={() => {}}
              />
            </div>

            {/* =================================================
                BOTTOM METRICS
            ================================================= */}

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
          delay: 1.2,
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