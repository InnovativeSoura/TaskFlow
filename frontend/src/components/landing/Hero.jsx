
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import AuthCard from "../auth/AuthCard";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">

        {/* ==========================
            LEFT SIDE
        ========================== */}

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">
            🚀 Next Generation Project Management
          </span>

          <h1 className="hero-title">
            Manage Projects
            <br />
            Collaborate Faster
            <br />
            <span>Deliver On Time.</span>
          </h1>

          <p className="hero-description">
            TaskFlow is an all-in-one project management platform
            built for modern teams. Plan projects, assign tasks,
            monitor progress, collaborate in real time and keep
            every workflow organized from one beautiful dashboard.
          </p>

          <div className="hero-buttons">
            <a href="#features"
              className="hero-secondary-btn"
            >
              Learn More
            </a>
          </div>

          <div className="hero-features">

            <div>
              <FaCheckCircle />
              <span>Unlimited Projects</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Real-Time Collaboration</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Enterprise Security</span>
            </div>

          </div>

        </motion.div>

        {/* ==========================
            RIGHT SIDE
        ========================== */}

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AuthCard compact />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;