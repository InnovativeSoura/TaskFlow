import {
  FaFolderOpen,
  FaSpinner,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

const ProjectStats = ({
  projects = [],
}) => {
  const total = projects.length;

  const active = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const completed = projects.filter(
    (project) =>
      project.status === "Completed"
  ).length;

  const avgProgress =
    total > 0
      ? Math.round(
          projects.reduce(
            (sum, project) =>
              sum +
              (project.progress || 0),
            0
          ) / total
        )
      : 0;

  const stats = [
    {
      title: "Total Projects",
      value: total,
      icon: <FaFolderOpen />,
      className: "primary",
    },
    {
      title: "Active",
      value: active,
      icon: <FaSpinner />,
      className: "info",
    },
    {
      title: "Completed",
      value: completed,
      icon: <FaCheckCircle />,
      className: "success",
    },
    {
      title: "Average Progress",
      value: `${avgProgress}%`,
      icon: <FaChartLine />,
      className: "warning",
    },
  ];

  return (
    <div className="project-stats-grid">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`project-stat-card ${stat.className}`}
        >
          <div className="project-stat-icon">
            {stat.icon}
          </div>

          <div className="project-stat-content">
            <h4>{stat.title}</h4>

            <h2>{stat.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectStats;