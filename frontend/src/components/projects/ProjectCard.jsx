import {
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaUserTie,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";


const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  canManage = true,
}) => {


  const getBadgeClass = (status = "") => {

    switch(status.toLowerCase()) {

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

    switch(priority.toLowerCase()) {


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



  return (

    <div className="project-card">


      {/* COLOR BAR */}

      <div

        className="project-color-bar"

        style={{
          background:
          project.color || "#6366f1"
        }}

      />




      {/* HEADER */}

      <div className="project-card-header">


        <div className="project-card-title">


          <FaFolderOpen />


          <div>


            <h3>

              {project.title}

            </h3>


            <p>

              {
                project.description

                ?

                project.description.length > 90

                ?

                `${project.description.substring(0,90)}...`

                :

                project.description

                :

                "No description"

              }

            </p>


          </div>


        </div>



      </div>





      {/* STATUS */}

      <div className="project-card-row">


        <span

          className={
            `badge ${
              getBadgeClass(
                project.status
              )
            }`
          }

        >

          {
            project.status ||
            "Planning"
          }

        </span>





        <span

          className={
            `priority-badge ${
              getPriorityClass(
                project.priority
              )
            }`
          }

        >

          {
            project.priority ||
            "Medium"
          }

        </span>


      </div>







      {/* PROGRESS */}

      <div className="project-card-progress">


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
              project.progress || 0
            }%

          </span>



        </div>


      </div>







      {/* DETAILS */}


      <div className="project-card-details">


        <div>

          <FaUserTie />

          {
            project.manager?.name ||
            project.owner?.name ||
            "Unassigned"
          }

        </div>




        <div>

          <FaUsers />

          {
            project.members?.length || 0
          }
          {" "}
          Members

        </div>




        <div>

          <FaCalendarAlt />

          {

            project.endDate

            ?

            new Date(
              project.endDate
            )
            .toLocaleDateString()

            :

            "--"

          }

        </div>


      </div>








      {/* ACTIONS */}


      {

        canManage &&

        <div className="project-card-actions">


          <button

            className="edit-btn"

            onClick={()=>
              onEdit(project)
            }

          >

            <FaEdit />

            Edit

          </button>





          <button

            className="delete-btn"

            onClick={()=>
              onDelete(project)
            }

          >

            <FaTrash />

            Delete

          </button>


        </div>


      }





    </div>


  );

};


export default ProjectCard;