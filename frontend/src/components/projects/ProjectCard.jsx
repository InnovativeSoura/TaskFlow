import { memo, useMemo } from "react";
import { motion } from "framer-motion";

import {
  FaUsers,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

import "../../styles/ProjectCard.css";

const ProjectCard = ({ project, onEdit, onDelete, canManage = false }) => {
  const {
    title = "Untitled Project",
    description = "No description available.",
    status = "Planning",
    priority = "Medium",
    progress = 0,
    members = [],
    createdAt,
    endDate,
    color = "#4F46E5",
  } = project || {};

  const statusConfig = useMemo(() => {
    switch (status) {
      case "Completed":
        return {
          icon: <FaCheckCircle />,
          className: "completed",
        };

      case "Active":
        return {
          icon: <FaChartLine />,
          className: "active",
        };

      case "Planning":
        return {
          icon: <FaClock />,
          className: "planning",
        };

      case "Archived":
        return {
          icon: <FaClock />,
          className: "archived",
        };

      default:
        return {
          icon: <FaClock />,
          className: "planning",
        };
    }
  }, [status]);

  const priorityConfig = useMemo(() => {
    switch (priority) {
      case "Critical":
        return {
          className: "critical",
          icon: <FaExclamationTriangle />,
        };

      case "High":
        return {
          className: "high",
          icon: <FaExclamationTriangle />,
        };

      case "Medium":
        return {
          className: "medium",
          icon: <FaChartLine />,
        };

      default:
        return {
          className: "low",
          icon: <FaChartLine />,
        };
    }
  }, [priority]);

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const visibleMembers = members.slice(0, 4);

  const remainingMembers = members.length - visibleMembers.length;

  const progressColor = useMemo(() => {
    if (progress >= 100) return "#22c55e";

    if (progress >= 70) return "#3b82f6";

    if (progress >= 40) return "#f59e0b";

    return "#ef4444";
  }, [progress]);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
      },
    },
  };

  return (
    <motion.article
      className="project-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -6,
      }}
    >
      <div
        className="project-card-top"
        style={{
          borderTop: `4px solid ${color}`,
        }}
      >
        <div className="project-title-section">
          <h3 className="project-title">{title}</h3>

          <div className="project-badges">
            <span className={`status-badge ${statusConfig.className}`}>
              {statusConfig.icon}

              {status}
            </span>

            <span className={`priority-badge ${priorityConfig.className}`}>
              {priorityConfig.icon}

              {priority}
            </span>
          </div>
        </div>

        <p className="project-description">{description}</p>

        <div className="project-progress-section">
          <div className="progress-header">
            <span>Progress</span>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
                backgroundColor: progressColor,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />
          </div>
        </div>

        <div className="project-meta">
          <div className="meta-item">
            <FaCalendarAlt />

            <div>
              <small>Created</small>

              <strong>{formatDate(createdAt)}</strong>
            </div>
          </div>

          <div className="meta-item">
            <FaClock />

            <div>
              <small>Deadline</small>

              <strong>{formatDate(endDate)}</strong>
            </div>
          </div>
        </div>

        <div className="project-members">
          <div className="members-left">
            <FaUsers className="members-icon" />

            <span>
              Team
              <strong> ({members.length})</strong>
            </span>
          </div>

          <div className="members-avatars">
            {visibleMembers.length > 0 ? (
              visibleMembers.map((member, index) => (
                <div
                  key={member._id || index}
                  className="member-avatar"
                  title={member.name}
                  style={{
                    marginLeft: index === 0 ? 0 : -10,
                  }}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} />
                  ) : (
                    getInitials(member.name)
                  )}
                </div>
              ))
            ) : (
              <div className="no-members">No Members</div>
            )}

            {remainingMembers > 0 && (
              <div className="member-avatar more-members">
                +{remainingMembers}
              </div>
            )}
          </div>
        </div>

        <div className="project-card-footer">
          <div className="footer-left">
            <small>Project Status</small>

            <span className={`footer-status ${statusConfig.className}`}>
              {statusConfig.icon}

              {status}
            </span>
          </div>

          <div className="footer-right">
            {canManage && (
              <motion.button
                type="button"
                className="action-btn edit-btn"
                whileHover={{
                  scale: 1.08,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => onEdit(project)}
                title="Edit Project"
              >
                <FaEdit />
              </motion.button>
            )}

            {canManage && (
              <motion.button
                type="button"
                className="action-btn delete-btn"
                whileHover={{
                  scale: 1.08,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => onDelete(project)}
                title="Delete Project"
              >
                <FaTrash />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default memo(ProjectCard);
