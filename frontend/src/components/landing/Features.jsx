// src/components/landing/Features.jsx

import { motion } from "framer-motion";

import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaChartLine,
  FaBolt,
  FaShieldAlt,
  FaComments,
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import "../../styles/Features.css";

const FEATURES = [
  {
    icon: FaProjectDiagram,
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
    icon: FaTasks,
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
    icon: FaUsers,
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
    icon: FaChartLine,
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
    icon: FaBolt,
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
    icon: FaShieldAlt,
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
    icon: FaComments,
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
    icon: FaCalendarAlt,
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

const Features = () => {
  return (
    <section className="taskflow-features-section">
      <div className="taskflow-features-container">

        {/* ==================================================
            SECTION HEADER
        ================================================== */}

        <motion.div
          className="taskflow-features-header"
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
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <span className="taskflow-features-eyebrow">
            Powerful Features
          </span>

          <h2 className="taskflow-features-title">
            Everything You Need
          </h2>

          <h3 className="taskflow-features-gradient-title">
            To Manage Projects Better.
          </h3>

          <p className="taskflow-features-description">
            TaskFlow brings projects, tasks, teams, communication
            and analytics together in one intelligent workspace
            designed for modern teams.
          </p>
        </motion.div>


        {/* ==================================================
            FEATURE GRID
        ================================================== */}

        <div className="taskflow-features-grid">

          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                className="taskflow-feature-card"
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
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.06,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -8,
                }}
              >

                {/* ==================================================
                    ICON
                ================================================== */}

                <motion.div
                  className="taskflow-feature-icon"
                  whileHover={{
                    scale: 1.08,
                    rotate: 2,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <Icon />
                </motion.div>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="taskflow-feature-content">

                  <h3 className="taskflow-feature-card-title">
                    {feature.title}
                  </h3>

                  <p className="taskflow-feature-card-description">
                    {feature.description}
                  </p>


                  {/* ==================================================
                      FEATURE POINTS
                  ================================================== */}

                  <ul className="taskflow-feature-list">

                    {feature.points.map((point) => (
                      <li key={point}>
                        <FaCheckCircle />

                        <span>
                          {point}
                        </span>
                      </li>
                    ))}

                  </ul>

                </div>


                {/* ==================================================
                    CARD ARROW
                ================================================== */}

                <div className="taskflow-feature-arrow">
                  <FaArrowRight />
                </div>

              </motion.article>
            );
          })}

        </div>


        {/* ==================================================
            BOTTOM CTA
        ================================================== */}

        <motion.div
          className="taskflow-features-bottom"
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
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >

          <div className="taskflow-features-bottom-content">

            <span>
              Ready to work smarter?
            </span>

            <strong>
              Bring your entire workflow together with TaskFlow.
            </strong>

          </div>

          <motion.button
            type="button"
            className="taskflow-features-cta"
            onClick={() => {
              const authSection =
                document.querySelector(".hero-right");

              if (authSection) {
                authSection.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
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