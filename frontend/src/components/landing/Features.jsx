// src/components/landing/Features.jsx

import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaChartLine,
  FaBolt,
  FaShieldAlt,
  FaComments,
  FaCalendarAlt,
} from "react-icons/fa";

import "../../styles/Features.css";

/* =========================================================
   FEATURE DATA
========================================================= */

const FEATURES = [
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
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
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
   SCROLL TO AUTH
========================================================= */

const scrollToAuth = (mode = "login") => {
  /*
   * The authentication card is embedded inside the Hero
   * section. We scroll to it instead of navigating away
   * from the landing page.
   */

  const authSection =
    document.querySelector(".hero-right");

  if (!authSection) {
    const heroSection =
      document.querySelector(".hero-section");

    if (heroSection) {
      heroSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return;
  }

  /*
   * If AuthCard supports the custom event, this allows
   * Features buttons to request Login/Register mode.
   */
  window.dispatchEvent(
    new CustomEvent("taskflow-auth-mode", {
      detail: {
        mode,
      },
    })
  );

  setTimeout(() => {
    authSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 50);
};

/* =========================================================
   COMPONENT
========================================================= */

const Features = () => {
  return (
    <section
      id="features"
      className="features-section"
    >
      <div className="features-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          className="features-header"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
        >
          <span className="features-eyebrow">
            Powerful Features
          </span>

          <h2 className="features-title">
            Everything You Need

            <span>
              To Manage Projects Better.
            </span>
          </h2>

          <p className="features-description">
            TaskFlow brings projects, tasks, teams,
            communication and analytics together
            in one intelligent workspace designed
            for modern teams.
          </p>
        </motion.div>


        {/* =================================================
            FEATURE GRID
        ================================================= */}

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
        >
          {FEATURES.map(
            (feature, index) => (
              <motion.article
                className="feature-card"
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.25,
                  },
                }}
              >

                {/* =======================================
                    ICON
                ======================================== */}

                <motion.div
                  className="feature-icon"
                  whileHover={{
                    scale: 1.06,
                    rotate: 2,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  {feature.icon}
                </motion.div>


                {/* =======================================
                    TITLE
                ======================================== */}

                <h3>
                  {feature.title}
                </h3>


                {/* =======================================
                    DESCRIPTION
                ======================================== */}

                <p>
                  {feature.description}
                </p>


                {/* =======================================
                    FEATURE LIST
                ======================================== */}

                <ul className="feature-list">
                  {feature.points.map(
                    (point) => (
                      <li
                        key={point}
                      >
                        <FaCheckCircle />

                        <span>
                          {point}
                        </span>
                      </li>
                    )
                  )}
                </ul>

              </motion.article>
            )
          )}
        </motion.div>


        {/* =================================================
            EXPLORE PLATFORM
        ================================================= */}

        <motion.div
          className="features-explore"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.55,
            delay: 0.15,
          }}
        >
          <motion.button
            type="button"
            className="features-explore-btn"
            onClick={() =>
              scrollToAuth("login")
            }
            whileHover={{
              y: -3,
              scale: 1.02,
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
        </motion.div>

      </div>
    </section>
  );
};

export default Features;