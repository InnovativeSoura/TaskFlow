import { motion } from "framer-motion";
import { FaHome, FaChevronRight, FaCalendarAlt, FaClock } from "react-icons/fa";

import "../styles/PageHeader.css";

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onClick,
  breadcrumb = [],
  actions,
}) => {
  const now = new Date();

  const currentDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.section
      className="page-header"
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
    >
      <div className="page-header-glow" />

      <div className="page-header-left">
        <div className="page-breadcrumb">
          <FaHome />

          {breadcrumb.length > 0 &&
            breadcrumb.map((item, index) => (
              <span key={index} className="breadcrumb-item">
                <FaChevronRight />

                {item}
              </span>
            ))}
        </div>

        <div className="page-header-eyebrow">
          <span className="page-header-status-dot" />
          WORKSPACE OVERVIEW
        </div>

        <h1 className="page-title">{title}</h1>

        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      <div className="page-header-right">
        <div className="header-info-card">
          <FaCalendarAlt />

          <div>
            <small>Date</small>

            <strong>{currentDate}</strong>
          </div>
        </div>

        <div className="header-info-card">
          <FaClock />

          <div>
            <small>Time</small>

            <strong>{currentTime}</strong>
          </div>
        </div>

        {actions}

        {buttonText && (
          <motion.button
            type="button"
            className="page-header-action"
            onClick={onClick}
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            {buttonText}
          </motion.button>
        )}
      </div>
    </motion.section>
  );
};

export default PageHeader;
