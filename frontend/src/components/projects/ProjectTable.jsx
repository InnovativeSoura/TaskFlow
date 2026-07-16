import {
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaUserTie,
  FaCalendarAlt,
  FaUsers,
  FaEye,
} from "react-icons/fa";

import Loader from "../Loader";
import EmptyState from "../EmptyState";

const ProjectTable = ({
  projects = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  canManage = true,
}) => {
  if (loading) {
    return <Loader />;
  }

  if (!projects.length) {
    return (
      <EmptyState
        title="No Projects Found"
        description="Create your first project to get started."
      />
    );
  }

  const getBadgeClass = (status = "") => {
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

  const progressColor = (progress = 0) => {
    if (progress >= 100) return "completed";
    if (progress >= 75) return "good";
    if (progress >= 40) return "average";
    return "low";
  };

  return (
    <div className="project-table-wrapper">

      <table className="project-table">

        <thead>

          <tr>

            <th>Project</th>

            <th>Manager</th>

            <th>Members</th>

            <th>Status</th>

            <th>Priority</th>

            <th>Progress</th>

            <th>Due Date</th>

            <th>Created</th>

            <th align="center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {projects.map((project) => (

            <tr key={project._id}>

              {/* ==========================================
                  PROJECT
              ========================================== */}

              <td>
                <div className="project-name">
                  <div className="project-icon">
                    <FaFolderOpen />
                  </div>

                  <div className="project-info">
                    <div className="project-title">
                      {project.title}
                    </div>

                    <div className="project-description">
                      {project.description
                        ? project.description.length > 60
                          ? `${project.description.substring(
                              0,
                              60
                            )}...`
                          : project.description
                        : "No description"}
                    </div>
                  </div>
                </div>
              </td>

              {/* ==========================================
                  MANAGER
              ========================================== */}

              <td>
                <div className="project-manager">
                  <FaUserTie />

                  <span>
                    {project.manager?.name ||
                      project.owner?.name ||
                      "Unassigned"}
                  </span>
                </div>
              </td>

              {/* ==========================================
                  STATUS
              ========================================== */}

              <td>
                <span
                  className={`status-badge ${getStatusClass(
                    project.status
                  )}`}
                >
                  {project.status || "Planning"}
                </span>
              </td>

              {/* ==========================================
                  PRIORITY
              ========================================== */}

              <td>
                <span
                  className={`priority-badge ${getPriorityClass(
                    project.priority
                  )}`}
                >
                  {project.priority || "Medium"}
                </span>
              </td>
                            {/* ===========================
                  STATUS
              =========================== */}

              <td>
                <span
                  className={`badge ${getBadgeClass(
                    project.status
                  )}`}
                >
                  {project.status || "Planning"}
                </span>
              </td>

              {/* ===========================
                  PRIORITY
              =========================== */}

              <td>
                <span
                  className={`priority-badge ${getPriorityClass(
                    project.priority
                  )}`}
                >
                  {project.priority || "Medium"}
                </span>
              </td>

              {/* ===========================
                  PROGRESS
              =========================== */}

              <td>
                <div className="progress-wrapper">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${project.progress || 0}%`,
                      }}
                    />
                  </div>

                  <span className="progress-text">
                    {project.progress || 0}%
                  </span>
                </div>
              </td>

              {/* ===========================
                  MEMBERS
              =========================== */}

              <td>
                <div className="project-members">
                  {project.members?.length || 0}
                </div>
              </td>

              {/* ===========================
                  DUE DATE
              =========================== */}

              <td>
                <div className="project-date">
                  <FaCalendarAlt />

                  <span>
                    {project.endDate
                      ? new Date(
                          project.endDate
                        ).toLocaleDateString()
                      : "--"}
                  </span>
                </div>
              </td>

              {/* ===========================
                  CREATED
              =========================== */}

              <td>
                {project.createdAt
                  ? new Date(
                      project.createdAt
                    ).toLocaleDateString()
                  : "--"}
              </td>
                            {/* ===========================
                  ACTIONS
              =========================== */}

              <td>
                {canManage ? (
                  <div className="table-actions">
                    <button
                      className="edit-btn"
                      title="Edit Project"
                      onClick={() => onEdit(project)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      title="Delete Project"
                      onClick={() => onDelete(project)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <span className="view-only">
                    View Only
                  </span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;