import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaPlayCircle,
  FaCheckCircle,
  FaTasks,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

import "./CTA.css";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function CTA() {
  return (
    <section
      className="cta-section"
      id="get-started"
    >
      <motion.div
        className="cta-container"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Glow */}

        <div className="cta-circle cta-circle-1" />
        <div className="cta-circle cta-circle-2" />

        {/* Left */}

        <div className="cta-content">
          <span className="section-tag">
            🚀 Ready to Get Started?
          </span>

          <h2>
            Build Better Projects.
            <br />
            Collaborate Smarter.
            <br />
            Deliver Faster.
          </h2>

          <p>
            Join thousands of teams using
            TaskFlow to organize projects,
            collaborate in real time,
            monitor performance and finish
            work on schedule—all from one
            intelligent workspace.
          </p>

          <div className="cta-buttons">
            <Link
              to="/login"
              className="cta-primary-btn"
            >
              Start Free

              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="cta-secondary-btn"
            >
              <FaPlayCircle />

              Watch Demo
            </Link>
          </div>

          <div className="cta-features">
            <div>
              <FaCheckCircle />
              <span>Free Forever Plan</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>No Credit Card Required</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>2 Minute Setup</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Cloud Sync Included</span>
            </div>
          </div>
        </div>

        {/* Right Dashboard */}

        <motion.div
          className="cta-dashboard"
          animate={{
            y: [-8, 8, -8],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
        >
          <div className="cta-widget">
            <div className="widget-header">
              <span />
              <span />
              <span />
            </div>

            <h3>
              Workspace Performance
            </h3>

            <div className="widget-progress">
              <div
                className="widget-progress-fill"
                style={{
                  width: "91%",
                }}
              />
            </div>

            <h1>91%</h1>

            <p>
              Overall Team Productivity
            </p>
          </div>

          <div className="cta-mini-card">
            <div>
              <h3>124</h3>
              <span>
                Tasks Completed
              </span>
            </div>

            <FaTasks
              size={34}
              color="#818cf8"
            />
          </div>

          <div className="cta-mini-card">
            <div>
              <h3>18</h3>
              <span>
                Active Members
              </span>
            </div>

            <FaUsers
              size={34}
              color="#22c55e"
            />
          </div>

          <div className="cta-mini-card">
            <div>
              <h3>96%</h3>
              <span>
                Project Success
              </span>
            </div>

            <FaChartLine
              size={34}
              color="#06b6d4"
            />
          </div>

          <div className="cta-mini-card">
            <div>
              <strong>
                Sprint Completed
              </strong>

              <span>
                Excellent Progress
              </span>
            </div>

            <FaCheckCircle
              size={30}
              color="#fbbf24"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default CTA;