import MainLayout from "../layouts/MainLayout";

import ReportsHeader from "../components/reports/ReportsHeader";
import ReportCards from "../components/reports/ReportCards";
import TaskStatusChart from "../components/reports/TaskStatusChart";
import ProjectProgressChart from "../components/reports/ProjectProgressChart";
import PriorityChart from "../components/reports/PriorityChart";
import ExportButtons from "../components/reports/ExportButtons";

import { useProjects } from "../context/ProjectContext";
import { useTasks } from "../context/TaskContext";

import {
  FaChartLine,
  FaRocket,
  FaFolderOpen,
  FaTasks,
  FaArrowRight,
  FaCircleCheck,
} from "react-icons/fa";

import "../styles/Reports.css";

const Reports = () => {
  const { projects = [] } = useProjects();
  const { tasks = [] } = useTasks();

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const hasAnalytics = totalProjects > 0 || totalTasks > 0;

  return (
    <MainLayout>
      <div className="reports-page">
        {/* =====================================================
            PREMIUM REPORTS HEADER
        ===================================================== */}
        <ReportsHeader />

        {/* =====================================================
            PERFORMANCE OVERVIEW
        ===================================================== */}
        <section className="reports-overview-section">
          <div className="reports-section-heading">
            <div>
              <span className="reports-eyebrow">
                PERFORMANCE OVERVIEW
              </span>

              <h2>Workspace at a glance</h2>

              <p>
                A real-time summary of your projects and task performance.
              </p>
            </div>

            <div className="reports-live-indicator">
              <span className="live-dot"></span>
              <span>Live workspace data</span>
            </div>
          </div>

          <ReportCards
            projects={projects}
            tasks={tasks}
          />
        </section>

        {/* =====================================================
            ANALYTICS CHARTS
        ===================================================== */}
        <section className="reports-analytics-section">
          <div className="reports-section-heading analytics-heading">
            <div>
              <span className="reports-eyebrow">
                VISUAL ANALYTICS
              </span>

              <h2>Performance intelligence</h2>

              <p>
                Understand task distribution, project progress, and priority
                across your workspace.
              </p>
            </div>

            <div className="analytics-badge">
              <FaChartLine />
              Analytics dashboard
            </div>
          </div>

          <div className="reports-grid">
            {/* TASK STATUS */}
            <div className="report-chart-slot task-status-slot">
              <TaskStatusChart tasks={tasks} />
            </div>

            {/* PROJECT PROGRESS */}
            <div className="report-chart-slot project-progress-slot">
              <ProjectProgressChart
                projects={projects}
              />
            </div>

            {/* TASK PRIORITY */}
            <div className="report-chart-slot priority-slot">
              <PriorityChart
                tasks={tasks}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            LARGE ANALYTICS WAITING PANEL
        ===================================================== */}
        <section className="analytics-waiting-card">
          <div className="analytics-waiting-glow glow-one"></div>
          <div className="analytics-waiting-glow glow-two"></div>

          <div className="analytics-waiting-content">
            <div className="analytics-waiting-icon">
              <FaChartLine />
            </div>

            <div className="analytics-waiting-copy">
              <span className="analytics-waiting-label">
                TASKFLOW ANALYTICS ENGINE
              </span>

              <h2>
                {hasAnalytics
                  ? "Your workspace insights are ready"
                  : "Your analytics are waiting"}
              </h2>

              <p>
                {hasAnalytics
                  ? "Your projects and tasks are generating meaningful workspace insights. Continue managing your work to unlock deeper performance intelligence."
                  : "Create projects and tasks to start generating meaningful workspace reports, performance insights, and productivity analytics."}
              </p>

              <div className="analytics-waiting-features">
                <div className="waiting-feature">
                  <span className="waiting-feature-icon">
                    <FaFolderOpen />
                  </span>

                  <div>
                    <strong>Project insights</strong>
                    <small>Track project progress</small>
                  </div>
                </div>

                <div className="waiting-feature">
                  <span className="waiting-feature-icon">
                    <FaTasks />
                  </span>

                  <div>
                    <strong>Task intelligence</strong>
                    <small>Analyze task performance</small>
                  </div>
                </div>

                <div className="waiting-feature">
                  <span className="waiting-feature-icon">
                    <FaCircleCheck />
                  </span>

                  <div>
                    <strong>Performance metrics</strong>
                    <small>Measure workspace health</small>
                  </div>
                </div>
              </div>

              {!hasAnalytics && (
                <div className="analytics-waiting-status">
                  <span className="status-pulse"></span>
                  Waiting for workspace activity
                </div>
              )}
            </div>

            <div className="analytics-waiting-decoration">
              <div className="decoration-circle circle-one"></div>
              <div className="decoration-circle circle-two"></div>
              <div className="decoration-circle circle-three"></div>

              <div className="decoration-chart">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="decoration-arrow">
                <FaArrowRight />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            EXPORT AREA
        ===================================================== */}
        <section className="reports-export-section">
          <div className="reports-export-header">
            <div>
              <span className="reports-eyebrow">
                REPORT CENTER
              </span>

              <h2>Export your workspace reports</h2>

              <p>
                Download your project and task performance data whenever you
                need it.
              </p>
            </div>
          </div>

          <ExportButtons
            projects={projects}
            tasks={tasks}
          />
        </section>

        {/* =====================================================
            FOOTER STATUS
        ===================================================== */}
        <div className="reports-footer-status">
          <span className="footer-status-dot"></span>
          <span>TaskFlow Analytics Engine</span>

          <span className="footer-status-divider"></span>

          <span>
            Metrics update automatically with workspace activity.
          </span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;