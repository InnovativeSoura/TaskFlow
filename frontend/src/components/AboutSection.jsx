import { motion } from "framer-motion";
import {
  FaBullseye,
  FaRocket,
  FaUsers,
  FaTasks,
} from "react-icons/fa";

import "../styles/AboutSection.css";

const stats = [
  {
    number: "10K+",
    title: "Tasks Completed",
    icon: <FaTasks />,
  },
  {
    number: "500+",
    title: "Teams",
    icon: <FaUsers />,
  },
  {
    number: "99.9%",
    title: "Uptime",
    icon: <FaRocket />,
  },
  {
    number: "100%",
    title: "Secure",
    icon: <FaBullseye />,
  },
];

const AboutSection = () => {
  return (
    <section
      className="about-section"
      id="about"
    >
      <div className="about-container">

        <motion.div
          className="about-left"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">
            ABOUT TASKFLOW
          </span>

          <h2>
            One Platform For Every Team
          </h2>

          <p>
            TaskFlow helps teams organize work,
            collaborate effortlessly and deliver
            projects on time using modern
            project management tools.
          </p>

          <div className="about-features">

            <div className="about-item">
              <FaRocket />

              <div>
                <h4>Fast Workflow</h4>

                <p>
                  Organize projects in seconds.
                </p>
              </div>
            </div>

            <div className="about-item">
              <FaUsers />

              <div>
                <h4>Team Collaboration</h4>

                <p>
                  Work together seamlessly.
                </p>
              </div>
            </div>

            <div className="about-item">
              <FaBullseye />

              <div>
                <h4>Goal Tracking</h4>

                <p>
                  Stay focused and productive.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        <motion.div
          className="about-right"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="stats-grid">
            {stats.map((item, index) => (
              <motion.div
                key={index}
                className="stat-card"
                whileHover={{
                  scale: 1.05,
                }}
              >
                <div className="stat-icon">
                  {item.icon}
                </div>

                <h3>{item.number}</h3>

                <p>{item.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;