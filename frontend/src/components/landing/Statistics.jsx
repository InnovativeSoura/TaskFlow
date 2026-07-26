// src/components/landing/Statistics.jsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  FaUsers,
  FaFolderOpen,
  FaTasks,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import "../../styles/Statistics.css";

/* =========================================================
   MAIN STATISTICS
========================================================= */

const statistics = [
  {
    icon: FaUsers,
    value: 2500,
    suffix: "+",
    label: "Active Teams",
    description:
      "Teams collaborating daily using TaskFlow.",
  },

  {
    icon: FaFolderOpen,
    value: 12000,
    suffix: "+",
    label: "Projects Created",
    description:
      "Projects successfully managed worldwide.",
  },

  {
    icon: FaTasks,
    value: 85000,
    suffix: "+",
    label: "Tasks Completed",
    description:
      "Completed tasks delivered on schedule.",
  },

  {
    icon: FaChartLine,
    value: 99.9,
    suffix: "%",
    label: "Platform Uptime",
    description:
      "Reliable cloud infrastructure you can trust.",
  },
];

/* =========================================================
   PLATFORM HIGHLIGHTS
========================================================= */

const platformStats = [
  {
    value: "10K+",
    label: "Projects",
  },

  {
    value: "50K+",
    label: "Tasks Managed",
  },

  {
    value: "99.9%",
    label: "System Uptime",
  },

  {
    value: "24/7",
    label: "Support",
  },
];

/* =========================================================
   COUNTER
========================================================= */

function Counter({
  end,
  suffix = "",
  decimals = 0,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const duration = 1800;
    const intervalTime = 20;

    const steps = duration / intervalTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        current = end;
        clearInterval(timer);
      }

      setCount(current);
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [end]);

  return (
    <>
      {decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count)}

      {suffix}
    </>
  );
}

/* =========================================================
   STATISTICS COMPONENT
========================================================= */

const Statistics = () => {
  return (
    <section
      id="statistics"
      className="statistics-section"
    >
      <div className="statistics-container">

        {/* =================================================
            PRODUCTIVITY PLATFORM FEATURE PANEL
        ================================================= */}

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

          {/* ==============================================
              LEFT CONTENT
          ============================================== */}

          <div className="productivity-content">

            <span className="productivity-label">
              Productivity Platform
            </span>

            <h2 className="productivity-title">
              One intelligent workspace for
              <br />

              <span>
                every project and every team
              </span>
            </h2>

            <p className="productivity-description">
              Replace spreadsheets, disconnected tools and
              endless email chains with one collaborative
              platform designed to help your organization
              stay organized, productive and on schedule.
            </p>

            {/* ============================================
                BENEFITS
            ============================================ */}

            <div className="productivity-benefits">

              <motion.div
                className="productivity-benefit"
                whileHover={{
                  x: 5,
                }}
              >
                <FaCheckCircle />

                <span>
                  AI-powered workflow automation
                </span>
              </motion.div>

              <motion.div
                className="productivity-benefit"
                whileHover={{
                  x: 5,
                }}
              >
                <FaCheckCircle />

                <span>
                  Real-time collaboration
                </span>
              </motion.div>

              <motion.div
                className="productivity-benefit"
                whileHover={{
                  x: 5,
                }}
              >
                <FaCheckCircle />

                <span>
                  Secure cloud infrastructure
                </span>
              </motion.div>

            </div>

            {/* ============================================
                CTA
            ============================================ */}

            <motion.a
              href="#features"
              className="productivity-button"
              whileHover={{
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span>
                Explore Platform
              </span>

              <FaArrowRight />
            </motion.a>

          </div>

          {/* ==============================================
              RIGHT PLATFORM STATS
          ============================================== */}

          <div className="productivity-stats">

            {platformStats.map(
              (item, index) => (
                <motion.div
                  key={item.label}
                  className="productivity-stat-card"
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + index * 0.08,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                >

                  <strong>
                    {item.value}
                  </strong>

                  <span>
                    {item.label}
                  </span>

                </motion.div>
              )
            )}

          </div>

        </motion.div>


        {/* =================================================
            TRUSTED WORLDWIDE HEADING
        ================================================= */}

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

          <span className="statistics-tag">
            Trusted Worldwide
          </span>

          <h2>
            Numbers that demonstrate
            <br />
            productivity at scale
          </h2>

          <p>
            Thousands of organizations rely on TaskFlow
            every day to plan, collaborate and deliver
            projects faster.
          </p>

        </motion.div>


        {/* =================================================
            MAIN STATISTIC CARDS
        ================================================= */}

        <div className="statistics-grid">

          {statistics.map(
            (item, index) => {
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
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -10,
                  }}
                >

                  {/* ICON */}

                  <motion.div
                    className="statistics-icon"
                    whileHover={{
                      scale: 1.08,
                      rotate: 2,
                    }}
                  >
                    <Icon />
                  </motion.div>


                  {/* VALUE */}

                  <h3>
                    <Counter
                      end={item.value}
                      suffix={item.suffix}
                      decimals={
                        item.value % 1 !== 0
                          ? 1
                          : 0
                      }
                    />
                  </h3>


                  {/* LABEL */}

                  <h4>
                    {item.label}
                  </h4>


                  {/* DESCRIPTION */}

                  <p>
                    {item.description}
                  </p>

                </motion.article>
              );
            }
          )}

        </div>

      </div>
    </section>
  );
};

export default Statistics;