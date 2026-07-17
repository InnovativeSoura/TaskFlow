import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaFolderOpen,
  FaTasks,
  FaChartLine,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers />,
    value: 2500,
    suffix: "+",
    label: "Active Teams",
  },
  {
    icon: <FaFolderOpen />,
    value: 12000,
    suffix: "+",
    label: "Projects Created",
  },
  {
    icon: <FaTasks />,
    value: 85000,
    suffix: "+",
    label: "Tasks Completed",
  },
  {
    icon: <FaChartLine />,
    value: 99.9,
    suffix: "%",
    label: "Platform Uptime",
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

    const duration = 1800;

    const increment =
      end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setCount(start);
    }, 20);

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

function Statistics() {
  return (
    <section className="statistics-section">

      <div className="section-heading">

        <span className="section-tag">
          Trusted Worldwide
        </span>

        <h2>
          Helping teams deliver projects
          faster every day
        </h2>

        <p>
          Thousands of professionals rely
          on TaskFlow to organize work,
          collaborate effectively and
          achieve outstanding results.
        </p>

      </div>

      <div className="statistics-grid">

        {stats.map((item, index) => (

          <motion.div
            key={item.label}
            className="statistics-card"
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * 0.15,
              duration: 0.5,
            }}
            whileHover={{
              y: -8,
            }}
          >

            <div className="statistics-icon">
              {item.icon}
            </div>

            <h2>

              <Counter
                end={item.value}
                suffix={item.suffix}
                decimals={
                  item.value % 1 !== 0
                    ? 1
                    : 0
                }
              />

            </h2>

            <p>
              {item.label}
            </p>

          </motion.div>

        ))}

      </div>

      <motion.div
        className="trusted-companies"
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.3,
          duration: 0.8,
        }}
      >

        <p>
          Trusted by innovative teams worldwide
        </p>

        <div className="company-grid">

          <span>Google</span>

          <span>Microsoft</span>

          <span>Amazon</span>

          <span>Netflix</span>

          <span>IBM</span>

          <span>Adobe</span>

        </div>

      </motion.div>

    </section>
  );
}

export default Statistics;