import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaPlayCircle,
  FaCheckCircle,
} from "react-icons/fa";

function CTA() {
  return (
    <section className="cta-section">

      <motion.div
        className="cta-container"
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
      >

        {/* Background Shapes */}

        <div className="cta-circle cta-circle-1"></div>
        <div className="cta-circle cta-circle-2"></div>

        {/* Content */}

        <div className="cta-content">

          <span className="section-tag">
            Start Today
          </span>

          <h2>
            Ready to transform the way
            your team works?
          </h2>

          <p>
            Join thousands of organizations
            using TaskFlow to plan projects,
            manage teams, collaborate in
            real time, and deliver work
            faster than ever.
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

              Book Demo
            </Link>

          </div>

          <div className="cta-features">

            <div>
              <FaCheckCircle />

              <span>Free Forever Plan</span>
            </div>

            <div>
              <FaCheckCircle />

              <span>No Credit Card</span>
            </div>

            <div>
              <FaCheckCircle />

              <span>Setup in 2 Minutes</span>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <motion.div
          className="cta-dashboard"

          animate={{
            y: [-10, 10, -10],
          }}

          transition={{
            repeat: Infinity,
            duration: 6,
          }}
        >

          <div className="cta-widget">

            <div className="widget-header">

              <span></span>
              <span></span>
              <span></span>

            </div>

            <h3>
              Project Health
            </h3>

            <div className="widget-progress">

              <div
                className="widget-progress-fill"
                style={{
                  width: "91%",
                }}
              ></div>

            </div>

            <h1>
              91%
            </h1>

            <p>
              Overall Team Productivity
            </p>

          </div>

          <div className="cta-mini-card">

            <strong>
              🚀 Sprint Completed
            </strong>

            <span>
              124 Tasks Finished
            </span>

          </div>

        </motion.div>

      </motion.div>

    </section>
  );
}

export default CTA;