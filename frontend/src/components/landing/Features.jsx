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

const Features = () => {

  /* ==========================================
      SCROLL TO HERO AUTH CARD
  ========================================== */

  const scrollToAuth = (mode = "login") => {
    /*
      Tell AuthCard which mode should be active.
      This does NOT change the URL.
    */

    window.dispatchEvent(
      new CustomEvent(
        "taskflow-auth-mode",
        {
          detail: {
            mode,
          },
        }
      )
    );

    /*
      Ask Hero to scroll to the AuthCard.
    */

    window.dispatchEvent(
      new CustomEvent(
        "taskflow-scroll-auth",
        {
          detail: {
            mode,
          },
        }
      )
    );
  };

  /* ==========================================
      FEATURE DATA
  ========================================== */

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
  ];

  /* ==========================================
      ANIMATION VARIANTS
  ========================================== */

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 35,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  /* ==========================================
      RENDER
  ========================================== */

  return (
    <section
      id="features"
      className="features-section"
    >

      <div className="features-container">

        {/* ======================================
            SECTION HEADER
        ======================================= */}

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
            duration: 0.7,
          }}
        >

          <span className="features-badge">
            ✨ Powerful Features
          </span>

          <h2 className="features-title">
            Everything You Need
            <br />

            <span>
              To Manage Projects Better.
            </span>
          </h2>

          <p className="features-description">
            TaskFlow brings projects, tasks,
            teams, communication and analytics
            together in one intelligent workspace
            designed for modern teams.
          </p>

        </motion.div>


        {/* ======================================
            FEATURE GRID
        ======================================= */}

        <motion.div
          className="features-grid"
          variants={
            containerVariants
          }
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
        >

          {features.map(
            (
              feature,
              index
            ) => (

              <motion.article
                key={
                  feature.title
                }
                className="feature-card"
                variants={
                  itemVariants
                }
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.25,
                }}
              >

                {/* ==============================
                    ICON
                =============================== */}

                <div className="feature-icon">
                  {feature.icon}
                </div>


                {/* ==============================
                    CARD CONTENT
                =============================== */}

                <div className="feature-content">

                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {
                      feature.description
                    }
                  </p>


                  {/* ============================
                      FEATURE POINTS
                  ============================= */}

                  <ul className="feature-points">

                    {feature.points.map(
                      (point) => (

                        <li
                          key={
                            point
                          }
                        >
                          <FaCheckCircle />

                          <span>
                            {point}
                          </span>
                        </li>

                      )
                    )}

                  </ul>

                </div>

              </motion.article>

            )
          )}

        </motion.div>


        {/* ======================================
            FEATURE CTA
        ======================================= */}

        <motion.div
          className="features-cta"
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
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          {/* ==============================
              CTA CONTENT
          =============================== */}

          <div className="features-cta-content">

            <span className="features-cta-badge">
              🚀 Ready to Get Started?
            </span>

            <h3>
              Turn Your Ideas
              <br />
              Into Organized Workflows.
            </h3>

            <p>
              Bring your projects and team
              together with TaskFlow and
              start managing work smarter.
            </p>

          </div>


          {/* ==============================
              CTA BUTTON
          =============================== */}

          <motion.button
            type="button"
            className="hero-primary-btn"
            onClick={() =>
              scrollToAuth(
                "login"
              )
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

            <motion.span
              whileHover={{
                x: 4,
              }}
            >
              <FaArrowRight />
            </motion.span>

          </motion.button>

        </motion.div>

      </div>

    </section>
  );
};

export default Features;