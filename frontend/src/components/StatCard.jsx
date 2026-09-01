import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color = "blue", subtitle, trend }) => {
  return (
    <motion.div
      className={`stat-card stat-card-${color}`}
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <div className="stat-card-glow" />

      <div className="stat-card-top">
        <div className="stat-card-title">{title}</div>

        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>

      <div className="stat-card-value">{value}</div>

      <div className="stat-card-bottom">
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}

        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
    </motion.div>
  );
};

export default StatCard;
