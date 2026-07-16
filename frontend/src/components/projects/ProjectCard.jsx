import {
  FaFolderOpen,
  FaCalendarAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaChartLine,
} from "react-icons/fa";

const ProjectCard = ({
  project,
  canManage = true,
  onEdit,
  onDelete,
}) => {
  const getStatusClass = (status = "") => {
    switch (status.toLowerCase()) {
      case "planning":
        return "planning";
      case "active":
        return "active";
      case "completed":
        return "completed";
      case "archived":
        return "archived";
      default:
        return "planning";
    }
  };

  const getPriorityClass = (priority = "") => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "priority-critical";
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const progress = project.progress || 0;

  const description =
    project.description?.length > 120
      ? `${project.description.substring(0, 120)}...`
      : project.description || "No description";

  const dueDate = project.endDate
    ? new Date(project.endDate)
    : null;

  const isOverdue =
    dueDate &&
    dueDate < new Date() &&
    project.status !== "Completed";

  return (
    <div className="project-card">
      {project.color && (
        <div
          className="project-color-bar"
          style={{
            background: project.color,
          }}
        />
      )}

      <div className="project-card-header">
        <div className="project-card-title">
          <FaFolderOpen />

          <div>
            <h3>{project.title}</h3>
            <p>{description}</p>
          </div>
        </div>

        <span
          className={`badge ${getStatusClass(
            project.status
          )}`}
        >
          {project.status || "Planning"}
        </span>
      </div>

      <div className="project-card-row">
        <span>Priority</span>

        <span
          className={`priority-badge ${getPriorityClass(
            project.priority
          )}`}
        >
          {project.priority || "Medium"}
        </span>
      </div>

      <div className="project-card-progress">
        <div className="progress-header">
          <span>
            <FaChartLine /> Progress
          </span>

          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="project-card-row">
        <span>
          <FaUsers /> Members
        </span>

        <strong>
          {project.members?.length || 0}
        </strong>
      </div>

      <div className="project-card-row">
        <span>Owner</span>

        <strong>
          {project.owner?.name ||
            project.manager?.name ||
            "Unassigned"}
        </strong>
      </div>

      <div className="project-card-row">
        <span>
          <FaCalendarAlt /> Due Date
        </span>

        <strong
          className={
            isOverdue
              ? "overdue-date"
              : ""
          }
        >
          {dueDate
            ? dueDate.toLocaleDateString()
            : "--"}
        </strong>
      </div>

      {canManage && (
        <div className="project-card-actions">
          <button
            className="edit-btn"
            onClick={() => onEdit?.(project)}
            title="Edit Project"
            aria-label="Edit Project"
          >
            <FaEdit />
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => onDelete?.(project)}
            title="Delete Project"
            aria-label="Delete Project"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;