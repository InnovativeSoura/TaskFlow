import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  FaUsers,
  FaFolderOpen,
  FaTasks,
  FaChartLine,
} from "react-icons/fa";

import "../../styles/Statistics.css";

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

function Counter({
  end,
  suffix = "",
  decimals = 0,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 1600;
    const steps = 80;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setCount(start);
    }, duration / steps);

    return () => clearInterval(timer);
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

const Statistics = () => {
  return (
    <section
      id="statistics"
      className="statistics-section"
    >
      <div className="statistics-container">

        {/* ==========================================
            SECTION INTRO
        ========================================== */}

        <motion.div
          className="statistics-intro"
          initial={{
            opacity: 0,
            y: 35,
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
            ease: "easeOut",
          }}
        >
          <span className="statistics-tag">
            Trusted Worldwide
          </span>

          <h2 className="statistics-title">
            Numbers that demonstrate
            <br />
            productivity at scale
          </h2>

          <p className="statistics-description">
            Thousands of organizations rely on TaskFlow
            every day to plan, collaborate and deliver
            projects faster.
          </p>
        </motion.div>


        {/* ==========================================
            STATISTICS CARDS
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
                  duration: 0.65,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -10,
                }}
              >

                {/* CARD ICON */}

                <motion.div
                  className="statistics-icon"
                  whileHover={{
                    scale: 1.08,
                    rotate: 2,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <Icon />
                </motion.div>


                {/* NUMBER */}

                <h3 className="statistics-number">
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

                <h4 className="statistics-label">
                  {item.label}
                </h4>


                {/* DESCRIPTION */}

                <p className="statistics-card-description">
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