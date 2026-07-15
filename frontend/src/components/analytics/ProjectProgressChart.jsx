import { useMemo } from "react";
import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";




const ProjectProgressChart = () => {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const projectProgress = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter((task) => {
        const projectId =
          task.project?._id ||
          task.project ||
          task.projectId;

        return projectId === project._id;
      });

      const completed = projectTasks.filter(
        (task) =>
          task.status === "Completed" ||
          task.status === "Done"
      ).length;

      const total = projectTasks.length;

      const progress =
        total > 0
          ? Math.round((completed / total) * 100)
          : 0;

      return {
        id: project._id,
        name: project.name,
        progress,
        completed,
        total,
      };
    });
  }, [projects, tasks]);

  if (!projectProgress.length) {
    return (
      <div className="empty-chart">
        <p>No projects available.</p>
      </div>
    );
  }

  return (
    <div className="project-progress-list">
      {projectProgress.map((project) => (
        <div
          key={project.id}
          className="project-progress-item"
        >
          <div className="project-progress-header">
            <h4>{project.name}</h4>

            <span>{project.progress}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${project.progress}%`,
              }}
            />
          </div>

          <small>
            {project.completed} of {project.total} Tasks
            Completed
          </small>
        </div>
      ))}
    </div>
  );
};

export default ProjectProgressChart;