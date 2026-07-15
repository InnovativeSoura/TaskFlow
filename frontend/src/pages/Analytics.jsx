import MainLayout from "../layouts/MainLayout";

import AnalyticsCards from "../components/analytics/AnalyticsCards";
import TaskPieChart from "../components/analytics/TaskPieChart";
import MonthlyBarChart from "../components/analytics/MonthlyBarChart";
import ProjectProgressChart from "../components/analytics/ProjectProgressChart";
import TeamPerformance from "../components/analytics/TeamPerformance";

import "../styles/Analytics.css";

const Analytics = () => {
  return (
    <MainLayout>
      <div className="analytics-page">

        <div className="analytics-header">
          <h1>Analytics Dashboard</h1>

          <p>
            Monitor your team's productivity, projects and task
            performance in real time.
          </p>
        </div>

        <AnalyticsCards />

        <div className="analytics-grid">

          <div className="analytics-card large">
            <h3>Task Status</h3>

            <TaskPieChart />
          </div>

          <div className="analytics-card large">
            <h3>Monthly Productivity</h3>

            <MonthlyBarChart />
          </div>

          <div className="analytics-card">
            <h3>Project Progress</h3>

            <ProjectProgressChart />
          </div>

          <div className="analytics-card">
            <h3>Team Performance</h3>

            <TeamPerformance />
          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Analytics;