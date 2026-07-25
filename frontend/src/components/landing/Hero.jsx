// src/components/landing/Hero.jsx

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import "../../styles/Hero.css";

const Hero = () => {
  const heroRef = useRef(null);

  /* =========================================================
     SCROLL TO AUTH
  ========================================================= */

  const scrollToAuth = (mode = "login") => {
    window.dispatchEvent(
      new CustomEvent("taskflow-auth-mode", {
        detail: {
          mode,
        },
      })
    );

    window.dispatchEvent(
      new CustomEvent("taskflow-scroll-auth", {
        detail: {
          mode,
        },
      })
    );

    setTimeout(() => {
      const authElement =
        document.getElementById("auth");

      authElement?.scrollIntoView({
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
      const mode =
        event.detail?.mode || "login";

      window.dispatchEvent(
        new CustomEvent("taskflow-auth-mode", {
          detail: {
            mode,
          },
        })
      );

      setTimeout(() => {
        const authElement =
          document.getElementById("auth");

        authElement?.scrollIntoView({
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
      ref={heroRef}
      className="hero-section"
      id="home"
    >
      <div className="hero-container">

        {/* =====================================================
            MAIN HERO PANEL
        ===================================================== */}

        <motion.div
          className="hero-main-panel"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="hero-content">

            {/* LABEL */}

            <motion.div
              className="hero-eyebrow"
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
              Productivity Platform
            </motion.div>

            {/* TITLE */}

            <motion.h1
              className="hero-title"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.7,
              }}
            >
              One intelligent workspace for
              <br />
              every project and every team
            </motion.h1>

            {/* DESCRIPTION */}

            <motion.p
              className="hero-description"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.6,
              }}
            >
              Replace spreadsheets, disconnected tools and
              endless email chains with one collaborative
              platform designed to help your organization stay
              organized, productive and on schedule.
            </motion.p>

            {/* =================================================
                BENEFITS
            ================================================= */}

            <motion.div
              className="hero-benefits"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.6,
              }}
            >

              <div className="hero-benefit">
                <FaCheckCircle />
                <span>
                  AI-powered workflow automation
                </span>
              </div>

              <div className="hero-benefit">
                <FaCheckCircle />
                <span>
                  Real-time collaboration
                </span>
              </div>

              <div className="hero-benefit">
                <FaCheckCircle />
                <span>
                  Secure cloud infrastructure
                </span>
              </div>

            </motion.div>

            {/* =================================================
                CTA
            ================================================= */}

            <motion.button
              type="button"
              className="hero-primary-btn"
              onClick={() => scrollToAuth("login")}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 0.6,
              }}
              whileHover={{
                y: -3,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span>
                Explore Platform
              </span>

              <FaArrowRight />
            </motion.button>

          </div>


          {/* =================================================
              RIGHT STATISTICS
          ================================================= */}

          <div className="hero-stats">

            {/* PROJECTS */}

            <motion.div
              className="hero-stat-card"
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.6,
              }}
              whileHover={{
                y: -5,
              }}
            >
              <span className="hero-stat-value">
                10K+
              </span>

              <span className="hero-stat-label">
                Projects
              </span>
            </motion.div>


            {/* TASKS */}

            <motion.div
              className="hero-stat-card"
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.45,
                duration: 0.6,
              }}
              whileHover={{
                y: -5,
              }}
            >
              <span className="hero-stat-value">
                50K+
              </span>

              <span className="hero-stat-label">
                Tasks Managed
              </span>
            </motion.div>


            {/* UPTIME */}

            <motion.div
              className="hero-stat-card"
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.55,
                duration: 0.6,
              }}
              whileHover={{
                y: -5,
              }}
            >
              <span className="hero-stat-value">
                99.9%
              </span>

              <span className="hero-stat-label">
                System Uptime
              </span>
            </motion.div>


            {/* SUPPORT */}

            <motion.div
              className="hero-stat-card"
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.65,
                duration: 0.6,
              }}
              whileHover={{
                y: -5,
              }}
            >
              <span className="hero-stat-value">
                24/7
              </span>

              <span className="hero-stat-label">
                Support
              </span>
            </motion.div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;