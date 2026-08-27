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

    window.setTimeout(() => {
      authRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  /* =========================================================
     GLOBAL AUTH SCROLL EVENT
     
     Used by:
     - LandingNavbar
     - Hero
     - Other landing-page buttons
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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className="hero-section"
      id="home"
    >
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
          {/* =================================================
              BADGE
          ================================================= */}

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

          {/* =================================================
              TITLE
          ================================================= */}

          <h1 className="hero-title">
            <span>
              Manage Projects.
            </span>

            <span className="hero-title-gradient">
              Collaborate Faster.
            </span>

            <span>
              Deliver On Time.
            </span>
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="hero-description">
            TaskFlow is an all-in-one project management
            platform built for modern teams. Plan projects,
            assign tasks, monitor progress and collaborate
            in real time — all from one intelligent workspace.
          </p>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="hero-buttons">

            {/* START FREE */}

            <button
              type="button"
              className="hero-primary-btn"
              onClick={() =>
                scrollToAuth("register")
              }
            >
              <span>
                Start Free
              </span>

              <FaArrowRight />
            </button>

            {/* EXPLORE FEATURES */}

            <a
              href="#features"
              className="hero-secondary-btn"
            >
              <span className="hero-play-icon">
                <FaPlay />
              </span>

              <span>
                Explore Features
              </span>
            </a>

          </div>

          {/* =================================================
              TRUST
          ================================================= */}

          <div className="hero-trust">

            <div className="hero-trust-item">
              <FaCheckCircle />
              <span>
                Free Forever Plan
              </span>
            </div>

            <div className="hero-trust-item">
              <FaCheckCircle />
              <span>
                2 Minute Setup
              </span>
            </div>
          </div>

          {/* =================================================
              MINI STATS
          ================================================= */}

          <div className="hero-mini-stats">

            {/* TEAMS */}

            <div className="hero-mini-stat">

              <div className="hero-mini-stat-icon">
                <FaTasks />
              </div>

              <div className="hero-mini-stat-content">
                <strong>
                  10K+
                </strong>

                <span>
                  Teams
                </span>
              </div>

            </div>

            {/* TASKS */}

            <div className="hero-mini-stat">

              <div className="hero-mini-stat-icon">
                <FaChartLine />
              </div>

              <div className="hero-mini-stat-content">
                <strong>
                  50K+
                </strong>

                <span>
                  Tasks Managed
                </span>
              </div>

            </div>

            {/* SECURITY */}

            <div className="hero-mini-stat">

              <div className="hero-mini-stat-icon">
                <FaShieldAlt />
              </div>

              <div className="hero-mini-stat-content">
                <strong>
                  99.9%
                </strong>

                <span>
                  Secure
                </span>
              </div>

            </div>

          </div>

        </motion.div>

        {/* ===================================================
            RIGHT AUTH PANEL
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
          {/* =================================================
              AUTH GLOW
          ================================================= */}

          <div className="hero-auth-glow" />

          {/* =================================================
              REAL AUTH CARD

              This is NOT a mockup.

              It uses:
              - AuthContext
              - LoginForm
              - RegisterForm
              - SocialButtons
              - Forgot Password
              - Password visibility
              - Remember Me
              - Login/Register switching
          ================================================= */}

          <div className="hero-auth-card-wrapper">
            <AuthCard
              compact
              onAuthReady={() => {
                // AuthCard is mounted and ready.
              }}
            />
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

        <span>
          Scroll to explore
        </span>
      </motion.a>

    </section>
  );
};

export default Hero;