import { motion } from "framer-motion";
import {
  FaUsers,
  FaFolderOpen,
  FaTasks,
  FaChartLine,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const statistics = [
  {
    icon: FaUsers,
    value: "2500+",
    label: "Active Teams",
    description: "Teams collaborating daily using TaskFlow.",
  },
  {
    icon: FaFolderOpen,
    value: "12000+",
    label: "Projects Created",
    description: "Projects successfully managed worldwide.",
  },
  {
    icon: FaTasks,
    value: "85000+",
    label: "Tasks Completed",
    description: "Completed tasks delivered on schedule.",
  },
  {
    icon: FaChartLine,
    value: "99.9%",
    label: "Platform Uptime",
    description: "Reliable cloud infrastructure you can trust.",
  },
];

const Statistics = () => {
  return (
    <section
      id="statistics"
      className="statistics-section"
    >
      <div className="statistics-container">

        {/* ==========================================
            PRODUCTIVITY PLATFORM
        ========================================== */}

        <motion.div
          className="productivity-panel"
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >

          {/* LEFT */}

          <div className="productivity-content">

            <span className="productivity-label">
              Productivity Platform
            </span>

            <h2>
              One intelligent workspace for
              <br />
              every project and every team
            </h2>

            <p>
              Replace spreadsheets, disconnected tools and endless
              email chains with one collaborative platform designed
              to help your organization stay organized, productive
              and on schedule.
            </p>

            <div className="productivity-points">

              <div>
                <FaCheckCircle />
                <span>
                  AI-powered workflow automation
                </span>
              </div>

              <div>
                <FaCheckCircle />
                <span>
                  Real-time collaboration
                </span>
              </div>

              <div>
                <FaCheckCircle />
                <span>
                  Secure cloud infrastructure
                </span>
              </div>

            </div>

            <button
              className="productivity-button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("taskflow-scroll-auth", {
                    detail: {
                      mode: "register",
                    },
                  })
                );
              }}
            >
              <span>
                Explore Platform
              </span>

              <FaArrowRight />
            </button>

          </div>


          {/* RIGHT STATS */}

          <div className="productivity-mini-grid">

            <div className="productivity-mini-card">
              <strong>10K+</strong>
              <span>Projects</span>
            </div>

            <div className="productivity-mini-card">
              <strong>50K+</strong>
              <span>Tasks Managed</span>
            </div>

            <div className="productivity-mini-card">
              <strong>99.9%</strong>
              <span>System Uptime</span>
            </div>

            <div className="productivity-mini-card">
              <strong>24/7</strong>
              <span>Support</span>
            </div>

          </div>

        </motion.div>


        {/* ==========================================
            STATISTICS HEADER
        ========================================== */}

        <motion.div
          className="statistics-heading"
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
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          <span>
            Trusted Worldwide
          </span>

          <h3>
            Numbers that demonstrate productivity at scale
          </h3>

          <p>
            Thousands of organizations rely on TaskFlow every day
            to plan, collaborate and deliver projects faster.
          </p>

        </motion.div>


        {/* ==========================================
            STATISTICS GRID
        ========================================== */}

        <div className="statistics-grid">

          {statistics.map((item, index) => {

            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                className="statistics-card"
                initial={{
                  opacity: 0,
                  y: 45,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -10,
                }}
              >

                <div className="statistics-icon">
                  <Icon />
                </div>

                <h2>
                  {item.value}
                </h2>

                <h4>
                  {item.label}
                </h4>

                <p>
                  {item.description}
                </p>

              </motion.article>
            );

          })}

        </div>

      </div>
    </section>
  );
};

export default Statistics;