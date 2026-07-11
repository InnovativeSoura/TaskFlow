import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaUsers,
  FaTasks,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/Hero.css";

const Hero = () => {
  return (
    <section className="hero">

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >

        <span className="hero-badge">
          🚀 Modern Project Management Platform
        </span>

        <h1>
          Organize Projects.
          <br />
          Manage Teams.
          <br />
          Deliver Faster.
        </h1>

        <p>
          TaskFlow helps individuals and teams manage projects,
          assign tasks, monitor progress, collaborate in real-time,
          and boost productivity with an intuitive dashboard.
        </p>

        <div className="hero-buttons">

            <Link
                to="/login"
                className="primary-btn"
            >
                Get Started
            </Link>

            <a
                href="#features"
                className="secondary-btn"
            >
                Learn More
            </a>

        </div>

        <div className="hero-stats">

          <div className="stat-card">

            <FaTasks />

            <div>

              <h3>Projects</h3>

              <p>Unlimited</p>

            </div>

          </div>

          <div className="stat-card">

            <FaUsers />

            <div>

              <h3>Team</h3>

              <p>Collaborate Easily</p>

            </div>

          </div>

          <div className="stat-card">

            <FaChartLine />

            <div>

              <h3>Analytics</h3>

              <p>Real-time Insights</p>

            </div>

          </div>

        </div>

      </motion.div>

      <motion.div
        className="hero-image"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >

        <div className="dashboard-preview">

          <div className="preview-header">

            <div className="dots">

              <span></span>
              <span></span>
              <span></span>

            </div>

            <h4>TaskFlow Dashboard</h4>

          </div>

          <div className="preview-body">

            <div className="preview-card purple">
              <FaCheckCircle />
              <span>Project Completed</span>
            </div>

            <div className="preview-card blue">
              <FaTasks />
              <span>28 Active Tasks</span>
            </div>

            <div className="preview-card green">
              <FaUsers />
              <span>12 Team Members</span>
            </div>

            <div className="progress">

              <div className="progress-title">

                <span>Overall Progress</span>

                <strong>84%</strong>

              </div>

              <div className="progress-bar">

                <div className="progress-fill"></div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
};

export default Hero;