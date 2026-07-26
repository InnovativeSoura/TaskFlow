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
} from "react-icons/fa";

import "../../styles/Statistics.css";

const statistics = [
  {
    icon: <FaUsers />,
    value: 2500,
    suffix: "+",
    label: "Active Teams",
    description:
      "Teams collaborating daily using TaskFlow.",
  },
  {
    icon: <FaFolderOpen />,
    value: 12000,
    suffix: "+",
    label: "Projects Created",
    description:
      "Projects successfully managed worldwide.",
  },
  {
    icon: <FaTasks />,
    value: 85000,
    suffix: "+",
    label: "Tasks Completed",
    description:
      "Completed tasks delivered on schedule.",
  },
  {
    icon: <FaChartLine />,
    value: 99.9,
    suffix: "%",
    label: "Platform Uptime",
    description:
      "Reliable cloud infrastructure you can trust.",
  },
];

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Adobe",
  "IBM",
];

function Counter({ end, suffix = "", decimals = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const duration = 1800;
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        current = end;
        clearInterval(timer);
      }

      setCount(current);
    }, 20);

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
    <section
      id="statistics"
      className="statistics-section"
    >
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-tag">
          Trusted Worldwide
        </span>

        <h2>
          Numbers that demonstrate productivity at scale
        </h2>

        <p>
          Thousands of organizations rely on TaskFlow every day to
          plan, collaborate and deliver projects faster.
        </p>
      </motion.div>

      <div className="statistics-grid">
        {statistics.map((item, index) => (
          <motion.div
            key={item.label}
            className="statistics-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.12,
              duration: 0.6,
            }}
            whileHover={{ y: -10 }}
          >
            <div className="statistics-icon">
              {item.icon}
            </div>

            <h2>
              <Counter
                end={item.value}
                suffix={item.suffix}
                decimals={item.value % 1 ? 1 : 0}
              />
            </h2>

            <h4>{item.label}</h4>

            <p>{item.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="trusted-companies"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p>
          Trusted by innovative companies across the globe
        </p>

        <div className="company-grid">
          {companies.map((company) => (
            <motion.span
              key={company}
              whileHover={{ scale: 1.05 }}
            >
              {company}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="statistics-grid"
        style={{ marginTop: "70px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="statistics-card">
          <div className="statistics-icon">
            <FaChartLine />
          </div>

          <h2>95%</h2>

          <p>
            Average productivity increase after adopting TaskFlow.
          </p>
        </div>

        <div className="statistics-card">
          <div className="statistics-icon">
            <FaLock />
          </div>

          <h2>100%</h2>

          <p>
            Secure authentication using JWT and protected APIs.
          </p>
        </div>

        <div className="statistics-card">
          <div className="statistics-icon">
            <FaGlobe />
          </div>

          <h2>80+</h2>

          <p>
            Countries where teams use TaskFlow every day.
          </p>
        </div>

        <div className="statistics-card">
          <div className="statistics-icon">
            <FaClock />
          </div>

          <h2>24/7</h2>

          <p>
            Continuous monitoring and cloud availability.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default Statistics;