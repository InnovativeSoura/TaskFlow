import { motion } from "framer-motion";
import {
  FaTasks,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaBell,
  FaRobot,
  FaLock,
  FaCloud,
} from "react-icons/fa";

const features = [
  {
    icon: <FaTasks />,
    title: "Smart Task Management",
    description:
      "Create, assign, prioritize and organize tasks with an intuitive Kanban workflow.",
  },
  {
    icon: <FaUsers />,
    title: "Team Collaboration",
    description:
      "Collaborate with teammates in real time through shared workspaces and comments.",
  },
  {
    icon: <FaChartLine />,
    title: "Advanced Analytics",
    description:
      "Visualize project health using interactive charts, reports and performance insights.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Project Planning",
    description:
      "Plan timelines with integrated calendar, milestones and Gantt charts.",
  },
  {
    icon: <FaBell />,
    title: "Instant Notifications",
    description:
      "Stay informed with activity feeds and real-time project notifications.",
  },
  {
    icon: <FaRobot />,
    title: "AI Productivity",
    description:
      "Receive AI-powered recommendations to improve workflow efficiency.",
  },
  {
    icon: <FaLock />,
    title: "Secure Authentication",
    description:
      "JWT authentication with protected routes keeps every workspace secure.",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Workspace",
    description:
      "Access your projects from anywhere with seamless cloud synchronization.",
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.5,
    },
  }),
};

function Features() {
  return (
    <section
      id="features"
      className="features-section"
    >
      <div className="section-heading">

        <span className="section-tag">
          Why Choose TaskFlow
        </span>

        <h2>
          Everything you need to manage
          projects efficiently
        </h2>

        <p>
          Powerful tools built for modern
          teams to collaborate, plan,
          organize and deliver projects
          faster than ever.
        </p>

      </div>

      <div className="features-grid">

        {features.map(
          (feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              whileHover={{
                y: -8,
              }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>
            </motion.div>
          )
        )}

      </div>

      <div className="features-highlight">

        <motion.div
          className="highlight-card"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >

          <div className="highlight-left">

            <span className="section-tag">
              Productivity
            </span>

            <h2>
              Manage every project from a
              single intelligent dashboard
            </h2>

            <p>
              Replace spreadsheets,
              scattered chats and multiple
              apps with one unified
              workspace built for
              productivity.
            </p>

          </div>

          <div className="highlight-right">

            <div className="mini-stat">
              <h3>10K+</h3>
              <span>Projects</span>
            </div>

            <div className="mini-stat">
              <h3>50K+</h3>
              <span>Tasks Managed</span>
            </div>

            <div className="mini-stat">
              <h3>99.9%</h3>
              <span>Availability</span>
            </div>

            <div className="mini-stat">
              <h3>24/7</h3>
              <span>Support</span>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default Features;