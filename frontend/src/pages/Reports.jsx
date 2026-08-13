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
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/Reports.css";

const Reports = () => {
  const { projects = [] } = useProjects();
  const { tasks = [] } = useTasks();

  /*
   * ----------------------------------------------------------
   * BASIC REPORT METRICS
   * ----------------------------------------------------------
   */

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => {
    const status = String(task?.status || "").toLowerCase();

    return (
      status === "completed" ||
      status === "complete" ||
      status === "done"
    );
  }).length;

  const pendingTasks = Math.max(totalTasks - completedTasks, 0);

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  /*
   * ----------------------------------------------------------
   * PROJECT PROGRESS
   * ----------------------------------------------------------
   */

  const projectProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((total, project) => {
            const progress = Number(
              project?.progress ??
                project?.completion ??
                project?.completionPercentage ??
                0
            );

            return total + Math.min(Math.max(progress, 0), 100);
          }, 0) / projects.length
        )
      : 0;

  /*
   * ----------------------------------------------------------
   * EMPTY WORKSPACE STATE
   * ----------------------------------------------------------
   */

  const hasWorkspaceData = totalProjects > 0 || totalTasks > 0;

  return (
    <MainLayout>
      <div className="reports-page">

        {/* =====================================================
            PREMIUM REPORT HEADER
        ====================================================== */}

        <ReportsHeader />

        {/* =====================================================
            PERFORMANCE OVERVIEW
        ====================================================== */}

        <section className="reports-overview-section">

          <div className="reports-section-heading">
            <div>
              <span className="reports-eyebrow">
                PERFORMANCE OVERVIEW
              </span>

              <h2>Workspace at a glance</h2>

              <p>
                A real-time summary of your projects and task
                performance.
              </p>
            </div>

            <div className="reports-completion-indicator">
              <span className="completion-arrow">↑</span>

              <strong>{completionRate}%</strong>

              <span>completion</span>
            </div>
          </div>

          <ReportCards
            projects={projects}
            tasks={tasks}
          />

        </section>

        {/* =====================================================
            ANALYTICS
        ====================================================== */}

        <section className="reports-analytics-section">

          <div className="reports-analytics-heading">

            <div>
              <span className="reports-eyebrow">
                VISUAL ANALYTICS
              </span>

              <h2>Performance intelligence</h2>

              <p>
                Understand task distribution, project progress,
                and priority across your workspace.
              </p>
            </div>

            <button
              type="button"
              className="analytics-dashboard-button"
            >
              <FaChartLine />

              <span>Analytics dashboard</span>

              <FaArrowRight />
            </button>

          </div>

          <div className="reports-grid">

            {/* =================================================
                TASK STATUS
            ================================================== */}

            <div className="report-chart-container task-status-container">

              <div className="report-chart-label">
                <span>01 / TASK ANALYTICS</span>
              </div>

              <div className="report-chart-content">
                <TaskStatusChart tasks={tasks} />
              </div>

            </div>

            {/* =================================================
                PROJECT PROGRESS
            ================================================== */}

            <div className="report-chart-container project-progress-container">

              <div className="report-chart-label">
                <span>02 / PROJECT ANALYTICS</span>
              </div>

              <div className="report-chart-content">
                <ProjectProgressChart
                  projects={projects}
                />
              </div>

            </div>

            {/* =================================================
                TASK PRIORITY
            ================================================== */}

            <div className="report-chart-container priority-container">

              <div className="report-chart-label">
                <span>03 / PRIORITY ANALYTICS</span>
              </div>

              <div className="report-chart-content">
                <PriorityChart tasks={tasks} />
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            ANALYTICS WAITING / EMPTY STATE
        ====================================================== */}

        {!hasWorkspaceData && (
          <section className="analytics-waiting-card">

            <div className="analytics-waiting-icon">
              <FaChartLine />
            </div>

            <div className="analytics-waiting-content">

              <span className="analytics-waiting-label">
                WORKSPACE ANALYTICS
              </span>

              <h3>Your analytics are waiting</h3>

              <p>
                Create projects and tasks to start generating
                meaningful workspace reports.
              </p>

              <div className="analytics-waiting-stats">

                <div className="waiting-stat">
                  <div className="waiting-stat-icon">
                    <FaFolderOpen />
                  </div>

                  <div>
                    <strong>0</strong>
                    <span>Projects</span>
                  </div>
                </div>

                <div className="waiting-stat">
                  <div className="waiting-stat-icon">
                    <FaTasks />
                  </div>

                  <div>
                    <strong>0</strong>
                    <span>Tasks</span>
                  </div>
                </div>

                <div className="waiting-stat">
                  <div className="waiting-stat-icon">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <strong>0%</strong>
                    <span>Completion</span>
                  </div>
                </div>

              </div>

            </div>

            <div className="analytics-waiting-status">
              <span className="status-dot"></span>

              <span>TaskFlow Analytics Engine</span>
            </div>

          </section>
        )}

        {/* =====================================================
            WORKSPACE SUMMARY
        ====================================================== */}

        <section className="reports-summary-strip">

          <div className="summary-strip-item">

            <div className="summary-strip-icon">
              <FaFolderOpen />
            </div>

            <div>
              <strong>{totalProjects}</strong>
              <span>Total Projects</span>
            </div>

          </div>

          <div className="summary-strip-item">

            <div className="summary-strip-icon">
              <FaTasks />
            </div>

            <div>
              <strong>{totalTasks}</strong>
              <span>Total Tasks</span>
            </div>

          </div>

          <div className="summary-strip-item">

            <div className="summary-strip-icon">
              <FaCheckCircle />
            </div>

            <div>
              <strong>{completedTasks}</strong>
              <span>Completed</span>
            </div>

          </div>

          <div className="summary-strip-item">

            <div className="summary-strip-icon">
              <FaRocket />
            </div>

            <div>
              <strong>{projectProgress}%</strong>
              <span>Project Progress</span>
            </div>

          </div>

          <div className="summary-strip-item">

            <div className="summary-strip-icon">
              <FaChartLine />
            </div>

            <div>
              <strong>{pendingTasks}</strong>
              <span>Pending Tasks</span>
            </div>

          </div>

        </section>

        {/* =====================================================
            EXPORT
        ====================================================== */}

        <section className="reports-export-section">

          <div>
            <span className="reports-eyebrow">
              REPORT CENTER
            </span>

            <h3>Export workspace analytics</h3>

            <p>
              Download your current project and task
              performance data.
            </p>
          </div>

          <ExportButtons
            projects={projects}
            tasks={tasks}
          />

        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="reports-footer">

          <div className="footer-security">
            <span className="footer-dot"></span>
            Secure workspace analytics
          </div>

          <span>
            Metrics update automatically with workspace activity.
          </span>

        </div>

      </div>
    </MainLayout>
  );
};

export default Reports;