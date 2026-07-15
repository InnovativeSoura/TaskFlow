import {
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaUserTie,
  FaCalendarAlt,
} from "react-icons/fa";

import Loader from "../Loader";
import EmptyState from "../EmptyState";

const ProjectTable = ({
  projects = [],
  loading = false,
  onEdit,
  onDelete,
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

  /* ==========================================
     STATUS BADGE
  ========================================== */

  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
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

  /* ==========================================
     PRIORITY BADGE
  ========================================== */

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
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

  return (
    <div className="project-table-wrapper">
      <table className="project-table">
        <thead>
          <tr>
            <th>Project</th>

            <th>Manager</th>

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
              {/* ===========================
                  PROJECT
              =========================== */}

              <td>
                <div className="project-name">
                  <FaFolderOpen />

                  <div>
                    <strong>{project.title}</strong>

                    <div className="project-description">
                      {project.description
                        ? project.description.length > 45
                          ? `${project.description.substring(
                              0,
                              45
                            )}...`
                          : project.description
                        : "No description"}
                    </div>
                  </div>
                </div>
              </td>

              {/* ===========================
                  PROJECT MANAGER
              =========================== */}

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

              <td style={{ minWidth: "170px" }}>
                <div className="progress-wrapper">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          project.progress || 0
                        }%`,
                      }}
                    />
                  </div>

                  <span className="progress-text">
                    {project.progress || 0}%
                  </span>
                </div>
              </td>

              {/* ===========================
                  DUE DATE
              =========================== */}

              <td>
                <div className="project-date">
                  <FaCalendarAlt />

                  <span>
                    {project.dueDate
                      ? new Date(
                          project.dueDate
                        ).toLocaleDateString()
                      : "--"}
                  </span>
                </div>
              </td>

              {/* ===========================
                  CREATED DATE
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
                      onClick={() =>
                        onEdit(project)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      title="Delete Project"
                      onClick={() =>
                        onDelete(project)
                      }
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



