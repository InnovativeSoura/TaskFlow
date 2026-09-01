import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

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

const openAuth = (mode) => {
  window.dispatchEvent(
    new CustomEvent("taskflow-auth-mode", {
      detail: {
        mode,
      },
    }),
  );

  const authCard = document.querySelector(".tf-auth-preview");

  if (authCard) {
    authCard.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

function CTA() {
  return (
    <section className="cta-section" id="get-started">
      <motion.div
        className="cta-container"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <div className="cta-circle cta-circle-1" />

        <div className="cta-circle cta-circle-2" />

        <div className="cta-grid-overlay" />

        <div className="cta-content">
          <span className="cta-badge">
            <span className="cta-badge-icon">🚀</span>
            Ready to Get Started?
          </span>

          <h2>
            Build Better Projects.
            <br />
            Collaborate Smarter.
            <br />
            <span>Deliver Faster.</span>
          </h2>

          <p>
            Join thousands of teams using TaskFlow to organize projects,
            collaborate in real time, monitor performance and finish work on
            schedule—all from one intelligent workspace.
          </p>

          <div className="cta-buttons">
            <button
              type="button"
              className="cta-primary-btn"
              onClick={() => openAuth("register")}
            >
              <span>Start Free</span>

              <FaArrowRight />
            </button>

            <button
              type="button"
              className="cta-secondary-btn"
              onClick={() => openAuth("login")}
            >
              <FaPlayCircle />

              <span>Watch Demo</span>
            </button>
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

            <h3>Workspace Performance</h3>

            <div className="widget-progress">
              <div
                className="widget-progress-fill"
                style={{
                  width: "91%",
                }}
              />
            </div>

            <div className="widget-performance">
              <strong>91%</strong>

              <span>Overall Team Productivity</span>
            </div>
          </div>

          <div className="cta-mini-card">
            <div className="cta-mini-content">
              <h3>124</h3>

              <span>Tasks Completed</span>
            </div>

            <div className="cta-mini-icon purple">
              <FaTasks />
            </div>
          </div>

          <div className="cta-mini-card">
            <div className="cta-mini-content">
              <h3>18</h3>

              <span>Active Members</span>
            </div>

            <div className="cta-mini-icon green">
              <FaUsers />
            </div>
          </div>

          <div className="cta-mini-card">
            <div className="cta-mini-content">
              <h3>96%</h3>

              <span>Project Success</span>
            </div>

            <div className="cta-mini-icon cyan">
              <FaChartLine />
            </div>
          </div>

          <div className="cta-mini-card sprint-card">
            <div className="sprint-content">
              <strong>Sprint Completed</strong>

              <span className="sprint-subtitle">Excellent Progress</span>
            </div>

            <div className="sprint-check">
              <FaCheckCircle />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default CTA;
