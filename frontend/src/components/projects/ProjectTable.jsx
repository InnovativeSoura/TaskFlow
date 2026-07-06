import {
  FaEdit,
  FaTrash,
  FaFolderOpen,
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

  return (

    <div className="project-table-wrapper">

      <table className="project-table">

        <thead>

          <tr>

            <th>Project</th>

            <th>Description</th>

            <th>Status</th>

            <th>Created</th>

            <th align="center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {projects.map((project) => (

            <tr key={project._id}>

              {/* Project */}

              <td>

                <div className="project-name">

                  <FaFolderOpen />

                  <span>

                    {project.title}

                  </span>

                </div>

              </td>

              {/* Description */}

              <td>

                {project.description
                  ? project.description.length > 60
                    ? `${project.description.substring(
                        0,
                        60
                      )}...`
                    : project.description
                  : "-"}

              </td>

              {/* Status */}

              <td>

                <span
                  className={`badge ${getBadgeClass(
                    project.status
                  )}`}
                >

                  {project.status}

                </span>

              </td>

              {/* Created */}

              <td>

                {project.createdAt
                  ? new Date(
                      project.createdAt
                    ).toLocaleDateString()
                  : "-"}

              </td>

              {/* Actions */}

              <td>

                {canManage ? (

                  <div className="table-actions">

                    <button
                      className="edit-btn"
                      onClick={() => onEdit(project)}
                    >

                      <FaEdit />

                    </button>

                    <button
                      className="delete-btn"
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