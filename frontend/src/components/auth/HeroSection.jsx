import { motion } from "framer-motion";

import {
  FaCheckCircle,
} from "react-icons/fa";

const HeroSection = () => {
  return (
    <motion.section
      className="auth-left"
      initial={{
        opacity: 0,
        x: -60,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.8,
      }}
    >

      <span className="hero-badge">
        🚀 Smart Project Management
      </span>

      <h1>

        Manage Projects

        <br />

        <span>
          Like Never Before
        </span>

      </h1>

      <p>

        Plan projects,

        organize tasks,

        collaborate with your team,

        monitor progress,

        and boost productivity

        with one powerful workspace.

      </p>

      <div className="hero-features">

        <div className="hero-card">

          <FaCheckCircle />

          <span>
            Real-time Collaboration
          </span>

        </div>

        <div className="hero-card">

          <FaCheckCircle />

          <span>
            Kanban Boards
          </span>

        </div>

        <div className="hero-card">

          <FaCheckCircle />

          <span>
            Analytics Dashboard
          </span>

        </div>

        <div className="hero-card">

          <FaCheckCircle />

          <span>
            Team Notifications
          </span>

        </div>

      </div>

    </motion.section>
  );
};

export default HeroSection;