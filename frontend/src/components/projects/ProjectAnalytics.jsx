import ProjectStats from "./ProjectStats";
import ProjectProgressChart from "./ProjectProgressChart";
import ProjectStatusChart from "./ProjectStatusChart";

const ProjectAnalytics = ({
  projects = [],
}) => {
  return (
    <div className="project-analytics">
      <ProjectStats
        projects={projects}
      />

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-header">
            <h3>Project Progress</h3>

            <p>
              Progress of every project
            </p>
          </div>

          <ProjectProgressChart
            projects={projects}
          />
        </div>

        <div className="analytics-card">
          <div className="analytics-header">
            <h3>
              Status Distribution
            </h3>

            <p>
              Projects grouped by status
            </p>
          </div>

          <ProjectStatusChart
            projects={projects}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;