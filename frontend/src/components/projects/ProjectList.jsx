import ProjectTable from "./ProjectTable";
import ProjectCard from "./ProjectCard";

const ProjectList = ({
  projects = [],
  loading = false,
  view = "table",
  canManage = true,
  onEdit,
  onDelete,
}) => {
  if (view === "table") {
    return (
      <ProjectTable
        projects={projects}
        loading={loading}
        canManage={canManage}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <div className="project-card-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;