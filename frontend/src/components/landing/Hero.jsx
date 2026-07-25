// src/components/landing/Hero.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import AuthCard from "../auth/AuthCard";

const Hero = () => {
  const navigate = useNavigate();

  /* ==========================================
      NAVIGATION
  ========================================== */

  const handleExplore = () => {
    navigate("/login");
  };

  return (
    <section className="hero-section">

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
            TaskFlow is an all-in-one project management
            platform built for modern teams. Plan projects,
            assign tasks, monitor progress, collaborate in
            real time and keep every workflow organized
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
          className="hero-right"
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

          {/* 
             Keep the existing compact AuthCard.
             The actual full Login/Register page
             is opened through Explore -> /login.
          */}

          <AuthCard compact />

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;