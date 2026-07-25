// src/components/landing/Hero.jsx

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import AuthCard from "../auth/AuthCard";
import "../../styles/Hero.css";

const Hero = () => {
  const authRef = useRef(null);

  /* ==========================================
      SCROLL TO AUTH CARD
  ========================================== */

  const scrollToAuth = (mode = "login") => {
    // Tell AuthCard which mode should be active
    window.dispatchEvent(
      new CustomEvent("taskflow-auth-mode", {
        detail: {
          mode,
        },
      })
    );

    // Small delay allows the AuthCard to update first
    setTimeout(() => {
      authRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  /* ==========================================
      GLOBAL AUTH SCROLL EVENT
  ========================================== */

  useEffect(() => {
    const handleAuthScroll = (event) => {
      const mode =
        event.detail?.mode || "login";

      // Update auth mode
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
      }, 50);
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
      <div className="hero-container">

        {/* ======================================
            LEFT SIDE
        ======================================= */}

        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            x: -60,
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

          {/* ==============================
              BADGE
          =============================== */}

          <span className="hero-badge">
            🚀 Next Generation Project Management
          </span>

          {/* ==============================
              TITLE
          =============================== */}

          <h1 className="hero-title">
            Manage Projects
            <br />
            Collaborate Faster
            <br />

            <span>
              Deliver On Time.
            </span>
          </h1>

          {/* ==============================
              DESCRIPTION
          =============================== */}

          <p className="hero-description">
            TaskFlow is an all-in-one project
            management platform built for modern
            teams. Plan projects, assign tasks,
            monitor progress, collaborate in real
            time and keep every workflow organized
            from one beautiful dashboard.
          </p>

          {/* ==============================
              ACTION BUTTONS
          =============================== */}

          <div className="hero-buttons">

            {/* LEARN MORE */}

            <a
              href="#features"
              className="hero-secondary-btn"
            >
              Learn More
            </a>

          </div>

          {/* ==============================
              FEATURES
          =============================== */}

          <div className="hero-features">

            <motion.div
              whileHover={{
                x: 4,
              }}
            >
              <FaCheckCircle />

              <span>
                Unlimited Projects
              </span>
            </motion.div>

            <motion.div
              whileHover={{
                x: 4,
              }}
            >
              <FaCheckCircle />

              <span>
                Real-Time Collaboration
              </span>
            </motion.div>

            <motion.div
              whileHover={{
                x: 4,
              }}
            >
              <FaCheckCircle />

              <span>
                Enterprise Security
              </span>
            </motion.div>

          </div>
        </motion.div>

        {/* ======================================
            RIGHT SIDE
        ======================================= */}

        <motion.div
          ref={authRef}
          className="hero-right"
          id="auth"
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >

          <AuthCard
            compact
            onAuthReady={() => {
              // Reserved for future auth animation
            }}
          />

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;