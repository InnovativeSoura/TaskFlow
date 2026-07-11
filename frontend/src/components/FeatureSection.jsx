import { motion } from "framer-motion";

import {
  FaProjectDiagram,
  FaUsers,
  FaChartLine,
  FaBell,
  FaBolt,
  FaLock,
} from "react-icons/fa";

import "../styles/FeatureSection.css";

const features = [
  {
    icon: <FaProjectDiagram />,
    title: "Project Management",
    desc: "Create, organize and manage unlimited projects with ease.",
  },
  {
    icon: <FaUsers />,
    title: "Team Collaboration",
    desc: "Assign tasks, communicate and collaborate in real time.",
  },
  {
    icon: <FaChartLine />,
    title: "Analytics",
    desc: "Visual dashboards to monitor progress and productivity.",
  },
  {
    icon: <FaBell />,
    title: "Notifications",
    desc: "Stay updated with instant reminders and alerts.",
  },
  {
    icon: <FaBolt />,
    title: "High Performance",
    desc: "Built using React, Node.js and MongoDB for speed.",
  },
  {
    icon: <FaLock />,
    title: "Secure",
    desc: "JWT authentication and protected routes keep your data safe.",
  },
];

const FeatureSection = () => {
  return (
    <section
      className="features-section"
      id="features"
    >
      <motion.div
        className="section-title"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Why Choose TaskFlow?</h2>

        <p>
          Everything you need to manage projects,
          collaborate with your team and deliver
          work faster.
        </p>
      </motion.div>

      <div className="features-grid">
        {features.map((item, index) => (
          <motion.div
            key={index}
            className="feature-card"
            initial={{
              opacity: 0,
              y: 60,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
          >
            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;