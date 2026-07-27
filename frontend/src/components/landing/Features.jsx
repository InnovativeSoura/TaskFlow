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
  FaBell,
  FaRobot,
  FaLock,
  FaCloud,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import "./Features.css";

const features = [
  {
    icon: FaProjectDiagram,
    title: "Project Management",
    description:
      "Create, organize and manage multiple projects from one centralized workspace.",
    points: [
      "Unlimited projects",
      "Project progress tracking",
      "Centralized workspace",
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
  {
    icon: FaBell,
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
    icon: FaRobot,
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
    icon: FaLock,
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
    icon: FaCloud,
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

const Features = () => {
  return (
    <section
      className="features-section"
      id="features"
    >
      <div className="features-background-glow features-glow-one" />
      <div className="features-background-glow features-glow-two" />

      <div className="features-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

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
            duration: 0.7,
          }}
        >
          <span className="features-eyebrow">
            <span className="features-eyebrow-dot" />
            POWERFUL FEATURES
          </span>

          <h2 className="features-title">
            Everything You Need
            <br />
            <span>To Manage Projects Better.</span>
          </h2>

          <p className="features-subtitle">
            TaskFlow brings projects, tasks, teams, communication and
            analytics together in one intelligent workspace designed for
            modern teams.
          </p>
        </motion.div>


        {/* =====================================================
            FEATURE GRID
        ===================================================== */}

        <div className="features-grid">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                className="feature-card"
                key={feature.title}
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
                  amount: 0.12,
                }}
                transition={{
                  duration: 0.5,
                  delay: (index % 4) * 0.07,
                }}
                whileHover={{
                  y: -8,
                }}
              >

                {/* CARD GLOW */}

                <div className="feature-card-glow" />


                {/* TOP */}

                <div className="feature-card-top">

                  <div className="feature-icon">
                    <Icon />
                  </div>

                  <span className="feature-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

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


                {/* POINTS */}

                <ul className="feature-points">

                  {feature.points.map((point) => (
                    <li key={point}>
                      <FaCheckCircle />

                      <span>
                        {point}
                      </span>
                    </li>
                  ))}

                </ul>


                {/* BOTTOM */}

                <div className="feature-card-bottom">

                  <span>
                    Explore feature
                  </span>

                  <FaArrowRight />

                </div>

              </motion.article>
            );
          })}

        </div>


        {/* =====================================================
            FEATURE CTA PANEL
        ===================================================== */}

        <motion.div
          className="features-cta"
          initial={{
            opacity: 0,
            y: 40,
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

          <div className="features-cta-content">

            <span className="features-cta-label">
              PRODUCTIVITY PLATFORM
            </span>

            <h3>
              One intelligent workspace for
              <br />
              <span>every project and every team.</span>
            </h3>

            <p>
              Replace spreadsheets, disconnected tools and endless email
              chains with one collaborative platform designed to help your
              organization stay organized, productive and on schedule.
            </p>

            <div className="features-cta-points">

              <span>
                <FaCheckCircle />
                AI-powered workflow automation
              </span>

              <span>
                <FaCheckCircle />
                Real-time collaboration
              </span>

              <span>
                <FaCheckCircle />
                Secure cloud infrastructure
              </span>

            </div>

          </div>


          <div className="features-cta-stats">

            <div className="feature-stat">
              <strong>10K+</strong>
              <span>Projects</span>
            </div>

            <div className="feature-stat">
              <strong>50K+</strong>
              <span>Tasks Managed</span>
            </div>

            <div className="feature-stat">
              <strong>99.9%</strong>
              <span>System Uptime</span>
            </div>

            <div className="feature-stat">
              <strong>24/7</strong>
              <span>Support</span>
            </div>

          </div>


          <div className="features-cta-shine" />

        </motion.div>

      </div>
    </section>
  );
};

export default Features;