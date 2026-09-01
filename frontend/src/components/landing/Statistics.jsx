import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  FaUsers,
  FaFolderOpen,
  FaTasks,
  FaChartLine,
  FaLock,
  FaGlobe,
  FaClock,
  FaArrowUp,
  FaCheckCircle,
} from "react-icons/fa";

import "./Statistics.css";

const statistics = [
  {
    icon: <FaUsers />,
    value: 2500,
    suffix: "+",
    label: "Active Teams",
    description: "Teams collaborating every day with TaskFlow.",
  },
  {
    icon: <FaFolderOpen />,
    value: 12000,
    suffix: "+",
    label: "Projects Created",
    description: "Projects planned, organized and delivered worldwide.",
  },
  {
    icon: <FaTasks />,
    value: 85000,
    suffix: "+",
    label: "Tasks Completed",
    description: "Tasks completed efficiently and delivered on schedule.",
  },
  {
    icon: <FaChartLine />,
    value: 99.9,
    suffix: "%",
    label: "Platform Uptime",
    description: "Reliable infrastructure built for teams that move fast.",
    decimals: 1,
  },
];

const companies = ["Google", "Microsoft", "Amazon", "Netflix", "Adobe", "IBM"];

const secondaryStats = [
  {
    icon: <FaArrowUp />,
    value: "95%",
    label: "Productivity Increase",
    description: "Average productivity improvement after adopting TaskFlow.",
  },
  {
    icon: <FaLock />,
    value: "100%",
    label: "Secure Workflows",
    description: "Protected authentication and secure project management.",
  },
  {
    icon: <FaGlobe />,
    value: "80+",
    label: "Countries Reached",
    description: "Teams around the world use TaskFlow every day.",
  },
  {
    icon: <FaClock />,
    value: "24/7",
    label: "Always Available",
    description: "Continuous monitoring and dependable cloud availability.",
  },
];

function Counter({ end, suffix = "", decimals = 0 }) {
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

    return () => clearInterval(timer);
  }, [end]);

  return (
    <>
      {decimals ? count.toFixed(decimals) : Math.floor(count)}

      {suffix}
    </>
  );
}

function Statistics() {
  return (
    <section id="statistics" className="statistics-section">
      <div className="statistics-orb statistics-orb-one" />
      <div className="statistics-orb statistics-orb-two" />

      <motion.div
        className="statistics-heading"
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
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <span className="statistics-eyebrow">
          <span className="eyebrow-dot" />
          Trusted Worldwide
        </span>

        <h2>
          Numbers that show
          <br />
          <span>how TaskFlow gets work done.</span>
        </h2>

        <p>
          From growing startups to established teams, TaskFlow helps
          organizations plan smarter, collaborate faster and deliver better
          results.
        </p>

        <div className="heading-divider">
          <span />
          <span />
          <span />
        </div>
      </motion.div>

      <div className="statistics-grid">
        {statistics.map((item, index) => (
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
              delay: index * 0.1,
              duration: 0.65,
              ease: "easeOut",
            }}
            whileHover={{
              y: -12,
            }}
          >
            <div className="card-glow" />

            <div className="statistics-icon">{item.icon}</div>

            <h3>
              <Counter
                end={item.value}
                suffix={item.suffix}
                decimals={item.decimals || 0}
              />
            </h3>

            <h4>{item.label}</h4>

            <p>{item.description}</p>

            <div className="card-accent">
              <span />
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="trusted-companies"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <div className="trusted-label">
          <span className="trusted-line" />

          <span>Trusted by innovative teams worldwide</span>

          <span className="trusted-line" />
        </div>

        <div className="company-grid">
          {companies.map((company, index) => (
            <motion.div
              key={company}
              className="company-pill"
              whileHover={{
                y: -5,
                scale: 1.03,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <span className="company-dot" />

              {company}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="secondary-statistics"
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
          amount: 0.1,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        {secondaryStats.map((item, index) => (
          <motion.div
            key={item.label}
            className="secondary-card"
            whileHover={{
              y: -8,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <div className="secondary-icon">{item.icon}</div>

            <div className="secondary-content">
              <div className="secondary-top">
                <h3>{item.value}</h3>

                <FaCheckCircle className="verified-icon" />
              </div>

              <h4>{item.label}</h4>

              <p>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="statistics-bottom"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <div className="bottom-icon">
          <FaChartLine />
        </div>

        <div>
          <strong>Built for teams that want more from work.</strong>

          <span>Plan better. Collaborate smarter. Deliver faster.</span>
        </div>

        <div className="bottom-status">
          <span />
          Platform running smoothly
        </div>
      </motion.div>
    </section>
  );
}

export default Statistics;
