// src/components/landing/Hero.jsx

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaShieldAlt,
  FaUsers,
  FaTasks,
} from "react-icons/fa";

import AuthCard from "../auth/AuthCard";

import "./Hero.css";

const Hero = () => {
  const authRef = useRef(null);

  /* =====================================================
      SCROLL TO AUTH CARD
  ===================================================== */

  const scrollToAuth = (mode = "login") => {
    window.dispatchEvent(
      new CustomEvent("taskflow-auth-mode", {
        detail: {
          mode,
        },
      })
    );

    requestAnimationFrame(() => {
      setTimeout(() => {
        authRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 80);
    });
  };

  /* =====================================================
      GLOBAL AUTH SCROLL EVENT
  ===================================================== */

  useEffect(() => {
    const handleAuthScroll = (event) => {
      const mode = event.detail?.mode || "login";

      window.dispatchEvent(
        new CustomEvent("taskflow-auth-mode", {
          detail: {
            mode,
          },
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
    <section
      className="hero-section"
      id="home"
    >
      {/* =================================================
          DECORATIVE BACKGROUND GLOWS
      ================================================= */}

      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="hero-grid-overlay" />

      {/* =================================================
          MAIN HERO CONTAINER
      ================================================= */}

      <div className="hero-container">

        {/* =================================================
            LEFT CONTENT
        ================================================= */}

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
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* ================================
              BADGE
          ================================= */}

          <motion.div
            className="hero-badge"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 0.5,
            }}
          >
            <span className="hero-badge-dot" />

            <span>
              Next Generation Project Management
            </span>

            <FaArrowRight />
          </motion.div>

          {/* ================================
              MAIN TITLE
          ================================= */}

          <h1 className="hero-title">
            Manage Projects.
            <br />

            <span className="hero-title-gradient">
              Collaborate Faster.
            </span>

            <br />

            Deliver On Time.
          </h1>

          {/* ================================
              DESCRIPTION
          ================================= */}

          <p className="hero-description">
            TaskFlow is an intelligent project management
            workspace built for modern teams. Plan projects,
            manage tasks, collaborate in real time and track
            progress — all from one powerful dashboard.
          </p>

          {/* ================================
              BUTTONS
          ================================= */}

          <div className="hero-buttons">

            <motion.button
              type="button"
              className="hero-primary-btn"
              onClick={() => scrollToAuth("register")}
              whileHover={{
                y: -3,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span>Start Free</span>
              <FaArrowRight />
            </motion.button>

            <motion.a
              href="#features"
              className="hero-secondary-btn"
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span className="hero-play-icon">
                <FaPlay />
              </span>

              <span>Explore Features</span>
            </motion.a>

          </div>

          {/* ================================
              TRUST POINTS
          ================================= */}

          <div className="hero-features">

            <motion.div
              whileHover={{
                x: 4,
              }}
            >
              <FaCheckCircle />

              <span>
                Free Forever Plan
              </span>
            </motion.div>

            <motion.div
              whileHover={{
                x: 4,
              }}
            >
              <FaCheckCircle />

              <span>
                No Credit Card
              </span>
            </motion.div>

            <motion.div
              whileHover={{
                x: 4,
              }}
            >
              <FaCheckCircle />

              <span>
                2 Minute Setup
              </span>
            </motion.div>

          </div>

          {/* =================================================
              MINI TRUST STATS
          ================================================= */}

          <div className="hero-mini-stats">

            <div className="hero-mini-stat">
              <div className="hero-mini-stat-icon">
                <FaUsers />
              </div>

              <div>
                <strong>10K+</strong>
                <span>Teams</span>
              </div>
            </div>

            <div className="hero-mini-stat">
              <div className="hero-mini-stat-icon">
                <FaTasks />
              </div>

              <div>
                <strong>50K+</strong>
                <span>Tasks Managed</span>
              </div>
            </div>

            <div className="hero-mini-stat">
              <div className="hero-mini-stat-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>99.9%</strong>
                <span>Secure</span>
              </div>
            </div>

          </div>

        </motion.div>

        {/* =================================================
            RIGHT AUTH / DASHBOARD AREA
        ================================================= */}

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
            delay: 0.15,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* ================================
              TOP FLOATING LABEL
          ================================= */}

          <motion.div
            className="hero-floating-label"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
              duration: 0.5,
            }}
          >
            <span className="floating-status-dot" />

            <span>
              Workspace is ready
            </span>
          </motion.div>

          {/* ================================
              AUTH CARD
          ================================= */}

          <div className="hero-auth-wrapper">

            <AuthCard
              compact
              onAuthReady={() => {
                // Reserved for future animation
              }}
            />

          </div>

          {/* ================================
              FLOATING CARDS
          ================================= */}

          <motion.div
            className="hero-floating-card hero-floating-card-one"
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="floating-card-icon blue">
              <FaTasks />
            </div>

            <div>
              <strong>124</strong>
              <span>Tasks Completed</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-floating-card hero-floating-card-two"
            animate={{
              y: [0, 7, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="floating-card-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <strong>96%</strong>
              <span>Project Success</span>
            </div>
          </motion.div>

        </motion.div>

      </div>

      {/* =================================================
          BOTTOM SCROLL INDICATOR
      ================================================= */}

      <motion.a
        href="#features"
        className="hero-scroll-indicator"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.1,
          duration: 0.6,
        }}
      >
        <span>Scroll to explore</span>

        <span className="hero-scroll-line">
          <span />
        </span>
      </motion.a>

    </section>
  );
};

export default Hero;