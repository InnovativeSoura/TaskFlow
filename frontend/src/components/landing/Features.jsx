// src/components/landing/Features.jsx

import React from "react";
import { motion } from "framer-motion";

import {
  FaBell,
  FaRobot,
  FaShieldAlt,
  FaCloud,
  FaCheckCircle,
  FaArrowRight,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";


/* ==========================================================
   FEATURES DATA
========================================================== */

const features = [
  {
    icon: <FaBell />,
    title: "Instant Notifications",
    description:
      "Receive real-time alerts for deadlines, assignments and team activity.",
  },

  {
    icon: <FaRobot />,
    title: "AI Productivity",
    description:
      "AI-powered recommendations help teams prioritize tasks and improve efficiency.",
  },

  {
    icon: <FaShieldAlt />,
    title: "Enterprise Security",
    description:
      "JWT authentication, encrypted data and secure workspaces keep every project protected.",
  },

  {
    icon: <FaCloud />,
    title: "Cloud Workspace",
    description:
      "Access projects securely from anywhere without complicated cloud synchronization.",
  },
];


/* ==========================================================
   ANIMATIONS
========================================================== */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};


const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};


const highlightVariants = {
  hidden: {
    opacity: 0,
    y: 45,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};


/* ==========================================================
   FEATURES COMPONENT
========================================================== */

const Features = () => {

  /* ==========================================
     EXPLORE PLATFORM
  ========================================== */

  const handleExplore = () => {
    const target = document.getElementById("auth-section");

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    /*
      Small visual feedback after scrolling.
    */

    setTimeout(() => {
      target.classList.add("auth-focus");

      setTimeout(() => {
        target.classList.remove("auth-focus");
      }, 1200);
    }, 500);
  };


  return (

    <section
      className="features-section"
      id="features"
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <motion.div
        className="features-header"

        initial={{
          opacity: 0,
          y: 30,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
          amount: 0.2,
        }}

        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >

        {/* Small label */}

        <span className="section-pill">
          Everything You Need
        </span>


        {/* Main heading */}

        <h2>
          Everything You Need
          <span> To Manage Projects Better.</span>
        </h2>


        {/* Description */}

        <p>
          TaskFlow brings projects, tasks, teams, communication and
          analytics together in one intelligent workspace designed
          for modern teams.
        </p>

      </motion.div>


      {/* ==================================================
          FEATURE CARDS
      ================================================== */}

      <motion.div
        className="features-grid"

        variants={containerVariants}

        initial="hidden"

        whileInView="visible"

        viewport={{
          once: true,
          amount: 0.15,
        }}
      >

        {features.map((feature) => (

          <motion.article
            className="feature-card"
            key={feature.title}
            variants={cardVariants}

            whileHover={{
              y: -8,

              transition: {
                duration: 0.25,
                ease: "easeOut",
              },
            }}
          >

            {/* ICON */}

            <div className="feature-icon">
              {feature.icon}
            </div>


            {/* CONTENT */}

            <div className="feature-content">

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

            </div>

          </motion.article>

        ))}

      </motion.div>


      {/* ==================================================
          PRODUCTIVITY HIGHLIGHT
      ================================================== */}

      <motion.div
        className="features-highlight"

        variants={highlightVariants}

        initial="hidden"

        whileInView="visible"

        viewport={{
          once: true,
          amount: 0.2,
        }}
      >

        <div className="highlight-card">


          {/* ============================================
              LEFT CONTENT
          ============================================ */}

          <div className="highlight-left">

            <span className="highlight-label">
              Productivity Platform
            </span>


            <h2>
              One intelligent workspace for
              <span> every project and every team.</span>
            </h2>


            <p>
              Replace spreadsheets, disconnected tools and endless
              email chains with one collaborative platform designed
              to help your organization stay organized, productive
              and on schedule.
            </p>


            {/* FEATURES */}

            <div className="highlight-features">

              <div>
                <FaCheckCircle />
                <span>
                  AI-powered workflow automation
                </span>
              </div>


              <div>
                <FaCheckCircle />
                <span>
                  Real-time collaboration
                </span>
              </div>


              <div>
                <FaCheckCircle />
                <span>
                  Secure cloud infrastructure
                </span>
              </div>

            </div>


            {/* EXPLORE BUTTON */}

            <button
              type="button"
              className="highlight-button"
              onClick={handleExplore}
            >

              <span>
                Explore Platform
              </span>

              <FaArrowRight />

            </button>

          </div>


          {/* ============================================
              RIGHT STATISTICS
          ============================================ */}

          <div className="highlight-right">


            {/* PROJECTS */}

            <motion.div
              className="mini-stat"

              whileHover={{
                y: -6,
                scale: 1.02,
              }}

              transition={{
                duration: 0.25,
              }}
            >

              <div className="mini-stat-icon">
                <FaProjectDiagram />
              </div>

              <h3>
                10K+
              </h3>

              <span>
                Projects
              </span>

            </motion.div>


            {/* TASKS */}

            <motion.div
              className="mini-stat"

              whileHover={{
                y: -6,
                scale: 1.02,
              }}

              transition={{
                duration: 0.25,
              }}
            >

              <div className="mini-stat-icon">
                <FaTasks />
              </div>

              <h3>
                50K+
              </h3>

              <span>
                Tasks Managed
              </span>

            </motion.div>


            {/* UPTIME */}

            <motion.div
              className="mini-stat"

              whileHover={{
                y: -6,
                scale: 1.02,
              }}

              transition={{
                duration: 0.25,
              }}
            >

              <div className="mini-stat-icon">
                <FaChartLine />
              </div>

              <h3>
                99.9%
              </h3>

              <span>
                System Uptime
              </span>

            </motion.div>


            {/* SUPPORT */}

            <motion.div
              className="mini-stat"

              whileHover={{
                y: -6,
                scale: 1.02,
              }}

              transition={{
                duration: 0.25,
              }}
            >

              <div className="mini-stat-icon">
                <FaUsers />
              </div>

              <h3>
                24/7
              </h3>

              <span>
                Support
              </span>

            </motion.div>

          </div>

        </div>

      </motion.div>

    </section>
  );
};


export default Features;