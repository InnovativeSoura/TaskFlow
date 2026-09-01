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
  FaLayerGroup,
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
    points: ["Task assignment", "Priority management", "Status tracking"],
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
    points: ["JWT authentication", "Encrypted data", "Secure workspaces"],
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
  const handleExplorePlatform = () => {
    window.dispatchEvent(
      new CustomEvent("taskflow-scroll-auth", {
        detail: {
          mode: "login",
        },
      }),
    );

    setTimeout(() => {
      document.getElementById("auth")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  return (
    <section className="features-section" id="features">
      <div className="features-container">
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
          <span className="features-eyebrow">POWERFUL WORKSPACE</span>

          <h2>
            Everything You Need <span>To Manage Projects Better.</span>
          </h2>

          <p>
            TaskFlow brings projects, tasks, teams, communication and analytics
            together in one intelligent workspace designed for modern teams.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                className="feature-card"
                key={feature.title}
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
                  amount: 0.12,
                }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(index * 0.035, 0.3),
                }}
                whileHover={{
                  y: -8,
                }}
              >
                <div className="feature-card-glow" />

                <div className="feature-icon">
                  <Icon />
                </div>

                <h3>{feature.title}</h3>

                <p className="feature-description">{feature.description}</p>

                <ul>
                  {feature.points.map((point) => (
                    <li key={point}>
                      <FaCheckCircle />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="productivity-platform"
          initial={{
            opacity: 0,
            y: 45,
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
            duration: 0.8,
          }}
        >
          <div className="productivity-background-glow" />

          <div className="productivity-content">
            <span className="productivity-eyebrow">
              <FaLayerGroup />
              PRODUCTIVITY PLATFORM
            </span>

            <h2>
              One intelligent workspace for{" "}
              <span>every project and every team.</span>
            </h2>

            <p>
              Replace spreadsheets, disconnected tools and endless email chains
              with one collaborative platform designed to help your organization
              stay organized, productive and on schedule.
            </p>

            <div className="productivity-benefits">
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

            <button
              type="button"
              className="productivity-button"
              onClick={handleExplorePlatform}
            >
              <span>Explore Platform</span>
              <FaArrowRight />
            </button>
          </div>

          <div className="productivity-visual">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />

            <div className="visual-line line-one" />
            <div className="visual-line line-two" />
            <div className="visual-line line-three" />

            <div className="visual-center">
              <FaLayerGroup />
            </div>

            <div className="visual-node node-one">
              <FaUsers />
            </div>

            <div className="visual-node node-two">
              <FaChartLine />
            </div>

            <div className="visual-node node-three">
              <FaTasks />
            </div>

            <div className="visual-node node-four">
              <FaCloud />
            </div>
          </div>

          <div className="productivity-stats">
            <div className="productivity-stat">
              <strong>10K+</strong>
              <span>Projects</span>
            </div>

            <div className="productivity-stat">
              <strong>50K+</strong>
              <span>Tasks Managed</span>
            </div>

            <div className="productivity-stat">
              <strong>99.9%</strong>
              <span>System Uptime</span>
            </div>

            <div className="productivity-stat">
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
