// src/components/PageHeader.jsx

import { motion } from "framer-motion";

import "../styles/PageHeader.css";

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onClick,
}) => {
  return (
    <motion.div
      className="page-header"
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
    >
      <div className="page-header-content">

        <div className="page-header-eyebrow">
          <span className="page-header-status-dot" />
          WORKSPACE OVERVIEW
        </div>

        <h1>
          {title}
        </h1>

        {subtitle && (
          <p>
            {subtitle}
          </p>
        )}

      </div>

      {buttonText && (
        <motion.button
          type="button"
          className="page-header-action"
          onClick={onClick}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          {buttonText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default PageHeader;