import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaPlayCircle,
  FaCheckCircle,
  FaUsers,
  FaTasks,
  FaChartLine,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="hero-section">

      <div className="hero-container">

        {/* LEFT CONTENT */}

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <span className="hero-badge">
            🚀 The Modern Project Management Platform
          </span>

          <h1 className="hero-title">
            Organize Projects.
            <br />

            Manage Teams.
            <br />

            <span>Deliver Faster.</span>
          </h1>

          <p className="hero-description">
            TaskFlow helps teams collaborate, manage projects,
            track tasks, monitor progress, and deliver work
            efficiently from one beautiful workspace.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="hero-primary-btn"
            >
              Get Started

              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="hero-secondary-btn"
            >
              <FaPlayCircle />

              Live Demo
            </Link>

          </div>

          <div className="hero-features">

            <div>

              <FaCheckCircle />

              <span>No Credit Card</span>

            </div>

            <div>

              <FaCheckCircle />

              <span>Unlimited Projects</span>

            </div>

            <div>

              <FaCheckCircle />

              <span>Real-time Collaboration</span>

            </div>

          </div>

        </motion.div>

        {/* RIGHT SIDE */}

        <motion.div
          className="hero-dashboard"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="dashboard-window">

            <div className="window-header">

              <span></span>
              <span></span>
              <span></span>

            </div>

            <div className="window-body">

              <div className="dashboard-card large">

                <div className="card-title">
                  Project Progress
                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{ width: "82%" }}
                  />

                </div>

                <p>82% Completed</p>

              </div>

              <div className="dashboard-grid">

                <div className="dashboard-card">

                  <FaTasks />

                  <h3>156</h3>

                  <p>Tasks</p>

                </div>

                <div className="dashboard-card">

                  <FaUsers />

                  <h3>28</h3>

                  <p>Members</p>

                </div>

                <div className="dashboard-card">

                  <FaChartLine />

                  <h3>96%</h3>

                  <p>Efficiency</p>

                </div>

              </div>

            </div>

          </div>

          {/* Floating Cards */}

          <motion.div
            className="floating-card card-one"
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
          >
            +24 Tasks Completed
          </motion.div>

          <motion.div
            className="floating-card card-two"
            animate={{
              y: [10, -10, 10],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
          >
            🎉 Sprint Finished
          </motion.div>

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;