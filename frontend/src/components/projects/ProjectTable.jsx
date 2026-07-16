import {
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaUserTie,
  FaCalendarAlt,
  FaUsers,
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
      STATUS CLASS
  ========================================== */

  const getStatusClass = (status = "") => {

    switch (
      status.toLowerCase()
    ) {

      case "active":
        return "active";

      case "completed":
        return "completed";

      case "archived":
        return "archived";

      case "on hold":
        return "planning";

      case "planning":
      default:
        return "planning";
    }

  };



  /* ==========================================
      PRIORITY CLASS
  ========================================== */

  const getPriorityClass = (
    priority = ""
  ) => {

    switch (
      priority.toLowerCase()
    ) {

      case "critical":
        return "priority-critical";

      case "high":
        return "priority-high";

      case "low":
        return "priority-low";

      case "medium":
      default:
        return "priority-medium";
    }

  };



  return (

    <div className="project-table-wrapper">

      <table className="project-table">


        <thead>

          <tr>

            <th>
              Project
            </th>


            <th>
              Manager
            </th>


            <th>
              Members
            </th>


            <th>
              Status
            </th>


            <th>
              Priority
            </th>


            <th>
              Progress
            </th>


            <th>
              Due Date
            </th>


            <th>
              Created
            </th>


            <th>
              Actions
            </th>


          </tr>


        </thead>



        <tbody>


          {projects.map(
            (project) => (

              <tr
                key={
                  project._id
                }
              >


                {/* PROJECT */}

                <td>

                  <div className="project-name">


                    <FaFolderOpen />


                    <div>

                      <strong>
                        {
                          project.title ||
                          "Untitled Project"
                        }
                      </strong>


                      <p className="project-description">

                        {
                          project.description
                            ? project.description.length > 70
                              ? `${project.description.substring(
                                  0,
                                  70
                                )}...`
                              : project.description
                            : "No description"
                        }

                      </p>


                    </div>


                  </div>


                </td>



                {/* MANAGER */}

                <td>

                  <div className="project-manager">

                    <FaUserTie />


                    <span>

                      {
                        project.manager?.name ||
                        project.owner?.name ||
                        "Unassigned"
                      }

                    </span>


                  </div>


                </td>



                {/* MEMBERS */}

                <td>

                  <div className="project-members">

                    <FaUsers />


                    <span>

                      {
                        project.members?.length ||
                        0
                      }

                    </span>


                  </div>


                </td>



                {/* STATUS */}

                <td>

                  <span
                    className={
                      `badge ${getStatusClass(
                        project.status
                      )}`
                    }
                  >

                    {
                      project.status ||
                      "Planning"
                    }

                  </span>


                </td>



                {/* PRIORITY */}

                <td>

                  <span
                    className={
                      `priority-badge ${getPriorityClass(
                        project.priority
                      )}`
                    }
                  >

                    {
                      project.priority ||
                      "Medium"
                    }

                  </span>


                </td>



                {/* PROGRESS */}

                <td>


                  <div className="progress-wrapper">


                    <div className="progress-bar">


                      <div

                        className="progress-fill"

                        style={{
                          width:
                            `${project.progress || 0}%`
                        }}

                      />


                    </div>



                    <span className="progress-text">

                      {
                        project.progress ||
                        0
                      }%

                    </span>


                  </div>


                </td>




                {/* DUE DATE */}

                <td>


                  <div className="project-date">


                    <FaCalendarAlt />


                    <span>

                      {
                        project.endDate

                        ? new Date(
                            project.endDate
                          ).toLocaleDateString()

                        : "--"
                      }

                    </span>


                  </div>


                </td>



                {/* CREATED */}

                <td>

                  {
                    project.createdAt

                    ? new Date(
                        project.createdAt
                      ).toLocaleDateString()

                    : "--"
                  }

                </td>




                {/* ACTIONS */}

                <td>


                  {
                    canManage ? (

                      <div className="table-actions">


                        <button

                          className="edit-btn"

                          onClick={() =>
                            onEdit(project)
                          }

                          title="Edit"

                        >

                          <FaEdit />

                        </button>



                        <button

                          className="delete-btn"

                          onClick={() =>
                            onDelete(project)
                          }

                          title="Delete"

                        >

                          <FaTrash />

                        </button>


                      </div>


                    ) : (

                      <span className="view-only">
                        View Only
                      </span>

                    )
                  }


                </td>



              </tr>

            )
          )}


        </tbody>


      </table>


    </div>

  );

};


export default ProjectTable;