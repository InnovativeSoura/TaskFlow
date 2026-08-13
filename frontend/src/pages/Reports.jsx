import MainLayout from "../layouts/MainLayout";

import ReportsHeader from "../components/reports/ReportsHeader";
import ReportCards from "../components/reports/ReportCards";
import TaskStatusChart from "../components/reports/TaskStatusChart";
import ProjectProgressChart from "../components/reports/ProjectProgressChart";
import PriorityChart from "../components/reports/PriorityChart";
import ExportButtons from "../components/reports/ExportButtons";

import { useProjects } from "../context/ProjectContext";
import { useTasks } from "../context/TaskContext";

import "../styles/Reports.css";

const Reports = () => {
  const { projects = [] } = useProjects();
  const { tasks = [] } = useTasks();

  return (
    <MainLayout>
      <div className="reports-page">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="reports-header-area">
          <ReportsHeader />
        </div>

        {/* =====================================================
            PERFORMANCE OVERVIEW
        ====================================================== */}

        <section className="reports-overview">

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
          </div>

          <ReportCards
            projects={projects}
            tasks={tasks}
          />

        </section>

        {/* =====================================================
            VISUAL ANALYTICS
        ====================================================== */}

        <section className="reports-analytics">

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

            <div className="analytics-status">
              <span className="analytics-status-dot"></span>
              Live analytics
            </div>

          </div>

          {/* ===================================================
              CHART GRID
          ==================================================== */}

          <div className="reports-grid">

            {/* TASK STATUS */}

            <div className="report-chart-card report-chart-wide">

              <div className="report-chart-card-header">

                <div>
                  <span className="chart-eyebrow">
                    01 / TASK ANALYTICS
                  </span>

                  <h3>Task Status</h3>

                  <p>
                    Current distribution of workspace tasks.
                  </p>
                </div>

                <div className="chart-header-icon">
                  ✓
                </div>

              </div>

              <div className="report-chart-body">
                <TaskStatusChart tasks={tasks} />
              </div>

            </div>

            {/* PROJECT PROGRESS */}

            <div className="report-chart-card">

              <div className="report-chart-card-header">

                <div>
                  <span className="chart-eyebrow">
                    02 / PROJECT ANALYTICS
                  </span>

                  <h3>Project Progress</h3>

                  <p>
                    Progress overview across all projects.
                  </p>
                </div>

                <div className="chart-header-icon">
                  ↗
                </div>

              </div>

              <div className="report-chart-body">
                <ProjectProgressChart
                  projects={projects}
                />
              </div>

            </div>

            {/* =================================================
                TASK PRIORITY
            ================================================== */}

            <div className="report-chart-card priority-report-card">

              <div className="report-chart-card-header">

                <div>
                  <span className="chart-eyebrow">
                    03 / PRIORITY ANALYTICS
                  </span>

                  <h3>Task Priority</h3>

                  <p>
                    Priority distribution across tasks.
                  </p>
                </div>

                <div className="chart-header-icon">
                  ◎
                </div>

              </div>

              <div className="report-chart-body priority-chart-body">
                <PriorityChart tasks={tasks} />
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            ANALYTICS WAITING
        ====================================================== */}

        <section className="analytics-waiting">

          <div className="analytics-waiting-main">

            <div className="analytics-waiting-icon">
              ↗
            </div>

            <div className="analytics-waiting-text">

              <span>
                TASKFLOW ANALYTICS
              </span>

              <h3>
                Your analytics are waiting
              </h3>

              <p>
                Create projects and tasks to start generating
                meaningful workspace reports.
              </p>

            </div>

          </div>

          <div className="analytics-engine">

            <span className="engine-dot"></span>

            <span>
              TaskFlow Analytics Engine
            </span>

          </div>

        </section>

        {/* =====================================================
            EXPORT
        ====================================================== */}

        <section className="reports-export">

          <div className="reports-export-content">

            <span className="reports-eyebrow">
              REPORT CENTER
            </span>

            <h3>
              Export workspace analytics
            </h3>

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

        <footer className="reports-footer">

          <span>
            Secure workspace analytics
          </span>

          <span>
            Metrics update automatically with workspace activity.
          </span>

        </footer>

      </div>
    </MainLayout>
  );
};

export default Reports;