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
  FaBolt,
  FaComments,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";

import "./Features.css";
/* =========================================================
   FEATURE DATA
========================================================= */

const features = [
  {
    icon: <FaProjectDiagram />,
    title: "Project Management",
    description:
      "Create, organize and manage multiple projects from one centralized workspace.",
    points: [
      "Unlimited projects",
      "Project progress tracking",
      "Centralized project workspace",
    ],
  },

  {
    icon: <FaTasks />,
    title: "Smart Task Management",
    description:
      "Break projects into manageable tasks and keep every team member aligned.",
    points: [
      "Task assignment",
      "Priority management",
      "Status tracking",
    ],
  },

  {
    icon: <FaUsers />,
    title: "Team Collaboration",
    description:
      "Bring your team together with real-time collaboration and transparent workflows.",
    points: [
      "Team-based workspaces",
      "Real-time collaboration",
      "Role-based access",
    ],
  },

  {
    icon: <FaChartLine />,
    title: "Progress Analytics",
    description:
      "Understand project performance with clear dashboards, progress indicators and reports.",
    points: [
      "Visual progress tracking",
      "Project analytics",
      "Performance insights",
    ],
  },

  {
    icon: <FaBolt />,
    title: "Real-Time Updates",
    description:
      "Stay informed as your team works with fast, real-time updates across the platform.",
    points: [
      "Instant task updates",
      "Live notifications",
      "Real-time status changes",
    ],
  },

  {
    icon: <FaShieldAlt />,
    title: "Enterprise Security",
    description:
      "Keep your projects and team data protected with secure authentication and controlled access.",
    points: [
      "Secure authentication",
      "Protected project data",
      "Role-based permissions",
    ],
  },

  {
    icon: <FaComments />,
    title: "Team Communication",
    description:
      "Keep project communication connected to your workflow instead of scattered across different tools.",
    points: [
      "Centralized communication",
      "Team collaboration",
      "Workflow visibility",
    ],
  },

  {
    icon: <FaCalendarAlt />,
    title: "Workflow Planning",
    description:
      "Plan deadlines, organize schedules and keep your team focused on what matters most.",
    points: [
      "Deadline tracking",
      "Workflow planning",
      "Better project visibility",
    ],
  },

  {
    icon: <FaBell />,
    title: "Instant Notifications",
    description:
      "Receive real-time alerts for deadlines, assignments and team activity.",
    points: [
      "Deadline alerts",
      "Assignment notifications",
      "Team activity updates",
    ],
  },

  {
    icon: <FaRobot />,
    title: "AI Productivity",
    description:
      "AI-powered recommendations help teams prioritize tasks and improve efficiency.",
    points: [
      "Smart recommendations",
      "Task prioritization",
      "Productivity insights",
    ],
  },

  {
    icon: <FaShieldAlt />,
    title: "Advanced Protection",
    description:
      "JWT authentication, encrypted data and secure workspaces keep every project protected.",
    points: [
      "JWT authentication",
      "Encrypted data",
      "Secure workspaces",
    ],
  },

  {
    icon: <FaCloud />,
    title: "Cloud Workspace",
    description:
      "Access projects securely from anywhere without complicated cloud synchronization.",
    points: [
      "Anywhere access",
      "Cloud synchronization",
      "Secure project storage",
    ],
  },
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
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

/* =========================================================
   COMPONENT
========================================================= */

const Features = () => {
  const handleExplore = () => {
    const target =
      document.getElementById("auth-section") ||
      document.getElementById("home");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <section className="features-section" id="features">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.div
        className="features-header"
        initial={{
          opacity: 0,
          y: 35,
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
          duration: 0.65,
        }}
      >
        {/* <span className="section-pill">
          Everything You Need
        </span> */}

        <h2>
          Everything You Need
          <span> To Manage Projects Better.</span>
        </h2>

        <p>
          TaskFlow brings projects, tasks, teams, communication
          and analytics together in one intelligent workspace
          designed for modern teams.
        </p>
      </motion.div>

      {/* =====================================================
          FEATURE GRID
      ====================================================== */}

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.08,
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
            {/* Icon */}
            <div className="feature-icon">
              {feature.icon}
            </div>

            {/* Content */}
            <div className="feature-content">
              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <ul className="feature-points">
                {feature.points.map((point) => (
                  <li key={point}>
                    <FaCheckCircle />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* =====================================================
          PRODUCTIVITY HIGHLIGHT
      ====================================================== */}

      <motion.div
        className="features-highlight"
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.75,
          ease: "easeOut",
        }}
      >
        <div className="highlight-card">
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="highlight-left">
            <span className="highlight-label">
              Productivity Platform
            </span>

            <h2>
              One intelligent workspace for
              <span> every project and every team.</span>
            </h2>

            <p>
              Replace spreadsheets, disconnected tools and
              endless email chains with one collaborative
              platform designed to help your organization stay
              organized, productive and on schedule.
            </p>

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

            <button
              type="button"
              className="highlight-button"
              onClick={handleExplore}
            >
              <span>Explore Platform</span>
              <FaArrowRight />
            </button>
          </div>

          {/* =================================================
              RIGHT SIDE STATS
          ================================================== */}

          <div className="highlight-right">
            <motion.div
              className="mini-stat"
              whileHover={{
                y: -5,
              }}
            >
              <span className="mini-stat-number">
                10K+
              </span>

              <span className="mini-stat-label">
                Projects
              </span>
            </motion.div>

            <motion.div
              className="mini-stat"
              whileHover={{
                y: -5,
              }}
            >
              <span className="mini-stat-number">
                50K+
              </span>

              <span className="mini-stat-label">
                Tasks Managed
              </span>
            </motion.div>

            <motion.div
              className="mini-stat"
              whileHover={{
                y: -5,
              }}
            >
              <span className="mini-stat-number">
                99.9%
              </span>

              <span className="mini-stat-label">
                System Uptime
              </span>
            </motion.div>

            <motion.div
              className="mini-stat"
              whileHover={{
                y: -5,
              }}
            >
              <span className="mini-stat-number">
                24/7
              </span>

              <span className="mini-stat-label">
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