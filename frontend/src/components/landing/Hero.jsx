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
    // Tell AuthCard which mode should be displayed
    window.dispatchEvent(
      new CustomEvent("taskflow-auth-mode", {
        detail: { mode },
      })
    );

    // Scroll after the mode event has been processed
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (authRef.current) {
          authRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 100);
    });
  };

  /* =========================================================
     SCROLL TO FEATURES
  ========================================================= */

  const scrollToFeatures = (event) => {
    event.preventDefault();

    const featuresSection = document.getElementById("features");

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    // Fallback if the section is not currently mounted
    window.location.hash = "features";
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

      requestAnimationFrame(() => {
        setTimeout(() => {
          authRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }, 100);
      });
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
          BACKGROUND DECORATION
          IMPORTANT:
          These elements must NEVER capture mouse clicks.
      ===================================================== */}

      <div
        className="hero-glow hero-glow-one"
        aria-hidden="true"
      />

      <div
        className="hero-glow hero-glow-two"
        aria-hidden="true"
      />

      <div
        className="hero-glow hero-glow-three"
        aria-hidden="true"
      />

      <div
        className="hero-grid"
        aria-hidden="true"
      />

      {/* =====================================================
          MAIN HERO CONTAINER
      ===================================================== */}

      <div className="hero-container">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
        >

          {/* BADGE */}

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

          {/* TITLE */}

          <h1 className="hero-title">
            Manage Projects.
            <br />

            <span className="hero-title-gradient">
              Collaborate Faster.
            </span>

            <br />

            Deliver On Time.
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

            {/* START FREE */}

            <button
              type="button"
              className="hero-primary-btn"
              onClick={() => scrollToAuth("register")}
              aria-label="Start using TaskFlow for free"
            >
              <span>Start Free</span>

              <FaArrowRight
                className="hero-button-arrow"
                aria-hidden="true"
              />
            </button>

            {/* EXPLORE FEATURES */}

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={scrollToFeatures}
              aria-label="Explore TaskFlow features"
            >
              <span className="hero-play-icon">
                <FaPlay aria-hidden="true" />
              </span>

              <span>
                Explore Features
              </span>
            </button>

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

              <div>
                <strong>10K+</strong>
                <span>Teams</span>
              </div>

            </div>

            <div className="hero-mini-stat">

              <div className="hero-mini-stat-icon">
                <FaChartLine />
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

        {/* ===================================================
            RIGHT AUTH / PRODUCT PREVIEW
        =================================================== */}

        <motion.div
          ref={authRef}
          className="hero-right"
          id="auth-section"
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: "easeOut",
          }}
        >

          {/* AUTH CARD GLOW */}

          <div
            className="hero-auth-glow"
            aria-hidden="true"
          />

          <div className="hero-auth-wrapper">

            {/* WORKSPACE HEADER */}

            <div className="hero-auth-top">

              <div className="hero-auth-status">
                <span />
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

            <div className="hero-auth-card-area">
              <AuthCard
                compact
                onAuthReady={() => {}}
              />
            </div>

            {/* =================================================
                AUTH CARD METRICS
            ================================================= */}

            <div className="hero-auth-metrics">

              <div className="hero-auth-metric">

                <div className="hero-auth-metric-icon blue">
                  <FaTasks />
                </div>

                <div>
                  <strong>124</strong>
                  <span>Tasks Completed</span>
                </div>

              </div>

              <div className="hero-auth-metric">

                <div className="hero-auth-metric-icon green">
                  <FaChartLine />
                </div>

                <div>
                  <strong>96%</strong>
                  <span>Project Success</span>
                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* =====================================================
          BOTTOM SCROLL INDICATOR
      ===================================================== */}

      <motion.button
        type="button"
        className="hero-scroll"
        onClick={scrollToFeatures}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.2,
        }}
        aria-label="Scroll to explore features"
      >
        <span className="hero-scroll-line" />

        <span>
          Scroll to explore
        </span>
      </motion.button>

    </section>
  );
};

export default Hero;