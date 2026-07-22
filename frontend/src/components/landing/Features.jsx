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
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const features = [
  {
    icon: <FaTasks />,
    title: "Smart Task Management",
    description:
      "Create, assign, prioritize and organize work effortlessly using an intuitive Kanban workflow.",
  },
  {
    icon: <FaUsers />,
    title: "Real-Time Collaboration",
    description:
      "Collaborate with teammates using shared workspaces, comments and live project updates.",
  },
  {
    icon: <FaChartLine />,
    title: "Advanced Analytics",
    description:
      "Visualize project health with interactive charts, productivity metrics and detailed reports.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Project Planning",
    description:
      "Plan milestones, schedules and deadlines using integrated calendars and timelines.",
  },
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
    icon: <FaLock />,
    title: "Enterprise Security",
    description:
      "JWT authentication, encrypted data and secure workspaces keep every project protected.",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Workspace",
    description:
      "Access projects securely from anywhere with automatic cloud synchronization.",
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
      duration: 0.6,
    },
  }),
};

const stats = [
  {
    value: "10K+",
    label: "Projects",
  },
  {
    value: "50K+",
    label: "Tasks Managed",
  },
  {
    value: "99.9%",
    label: "System Uptime",
  },
  {
    value: "24/7",
    label: "Support",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="features-section"
    >
      {/* Heading */}

      <motion.div
        className="section-heading"
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
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <span className="section-tag">
          Premium Features
        </span>

        <h2>
          Everything your team needs to
          deliver projects faster
        </h2>

        <p>
          TaskFlow combines planning,
          collaboration, analytics and
          automation into one beautiful
          workspace built for modern teams.
        </p>
      </motion.div>

      {/* Feature Cards */}

      <div className="features-grid">
        {features.map((feature, index) => (
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
              y: -10,
            }}
          >
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Highlight Section */}

      <motion.div
        className="features-highlight"
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
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <div className="highlight-card">

          {/* Left */}

          <div className="highlight-left">

            <span className="section-tag">
              Productivity Platform
            </span>

            <h2>
              One intelligent workspace for
              every project and every team
            </h2>

            <p>
              Replace spreadsheets,
              disconnected tools and endless
              email chains with one
              collaborative platform designed
              to help your organization stay
              organized, productive and on
              schedule.
            </p>

            <div
              style={{
                marginTop: "35px",
                display: "grid",
                gap: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FaCheckCircle color="#22c55e" />
                AI-powered workflow automation
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FaCheckCircle color="#22c55e" />
                Real-time collaboration
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FaCheckCircle color="#22c55e" />
                Secure cloud infrastructure
              </div>
            </div>

            <motion.button
              whileHover={{
                x: 6,
              }}
              className="hero-primary-btn"
              style={{
                marginTop: "40px",
              }}
            >
              Explore Platform

              <FaArrowRight />
            </motion.button>

          </div>

          {/* Right */}

          <div className="highlight-right">
            {stats.map((item) => (
              <motion.div
                key={item.label}
                className="mini-stat"
                whileHover={{
                  y: -8,
                }}
              >
                <h3>{item.value}</h3>

                <span>{item.label}</span>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </section>
  );
}

export default Features;