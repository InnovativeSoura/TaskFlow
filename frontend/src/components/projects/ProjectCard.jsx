const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="project-card">

      <h3>
        {project.title}
      </h3>

      <p>
        {project.description}
      </p>

      <span
        className={`badge ${project.status.toLowerCase()}`}
      >
        {project.status}
      </span>

      <div className="project-actions">

        <button
          onClick={() => onEdit(project)}
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(project._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default ProjectCard;