// src/components/PageHeader.jsx

import { motion } from "framer-motion";
import {
  FaHome,
  FaChevronRight,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

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
      {/* Background Glow */}

      <div className="page-header-glow" />

      {/* Left */}

      <div className="page-header-left">

        {/* Breadcrumb */}

        <div className="page-breadcrumb">

          <FaHome />

          {breadcrumb.length > 0 &&
            breadcrumb.map((item, index) => (
              <span
                key={index}
                className="breadcrumb-item"
              >
                <FaChevronRight />

                {item}
              </span>
            ))}

        </div>

        {/* Eyebrow */}

        <div className="page-header-eyebrow">

          <span className="page-header-status-dot" />

          WORKSPACE OVERVIEW

        </div>

        {/* Title */}

        <h1 className="page-title">

          {title}

        </h1>

        {/* Subtitle */}

        {subtitle && (

          <p className="page-subtitle">

            {subtitle}

          </p>

        )}

      </div>

      {/* Right */}

      <div className="page-header-right">

        {/* Date */}

        <div className="header-info-card">

          <FaCalendarAlt />

          <div>

            <small>Date</small>

            <strong>

              {currentDate}

            </strong>

          </div>

        </div>

        {/* Time */}

        <div className="header-info-card">

          <FaClock />

          <div>

            <small>Time</small>

            <strong>

              {currentTime}

            </strong>

          </div>

        </div>

        {/* Custom Actions */}

        {actions}

        {/* Default Button */}

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