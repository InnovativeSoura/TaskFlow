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
      <main className="reports-page">

        {/* =====================================================
            PREMIUM BACKGROUND
        ====================================================== */}
        <div className="reports-background" aria-hidden="true">
          <div className="reports-glow reports-glow-one" />
          <div className="reports-glow reports-glow-two" />
          <div className="reports-grid-overlay" />
          <div className="reports-background-orb reports-orb-one" />
          <div className="reports-background-orb reports-orb-two" />
        </div>

        <div className="reports-container">

          {/* =====================================================
              HERO
          ====================================================== */}
          <section className="reports-hero">

            <div className="reports-hero-content">

              <div className="reports-hero-badge">
                <span className="reports-hero-dot" />
                WORKSPACE INTELLIGENCE
              </div>

              <div className="reports-hero-title-row">

                <div className="reports-hero-copy">
                  <h1>Reports &amp; Analytics</h1>

                  <p>
                    Track project performance, task activity,
                    and workspace productivity through clear,
                    actionable analytics.
                  </p>
                </div>

                <div className="reports-hero-status">
                  <span className="status-pulse" />

                  <div>
                    <strong>Live</strong>
                    <span>Workspace data</span>
                  </div>
                </div>

              </div>

              <div className="reports-hero-line" />

              <div className="reports-hero-meta">

                <span>
                  <span className="meta-icon">01</span>
                  Performance
                </span>

                <span className="meta-divider" />

                <span>
                  <span className="meta-icon">02</span>
                  Productivity
                </span>

                <span className="meta-divider" />

                <span>
                  <span className="meta-icon">03</span>
                  Insights
                </span>

              </div>

            </div>

          </section>


          {/* =====================================================
              01 / PERFORMANCE OVERVIEW
          ====================================================== */}
          <section className="reports-overview">

            <div className="reports-section-heading">

              <div className="section-heading-copy">

                <div className="section-kicker">
                  <span className="kicker-line" />
                  <span className="section-number">01</span>
                  <span className="section-slash">/</span>
                  PERFORMANCE OVERVIEW
                </div>

                <h2>Workspace at a glance</h2>

                <p>
                  A real-time snapshot of your projects, tasks,
                  productivity and overall workspace activity.
                </p>

              </div>

              <div className="section-live-indicator">
                <span />
                <strong>Workspace synchronized</strong>
              </div>

            </div>


            <div className="performance-overview-frame">

              <div className="performance-frame-glow" />

              <div className="performance-frame-header">

                <div>
                  <span className="performance-frame-label">
                    WORKSPACE PERFORMANCE
                  </span>

                  <span className="performance-frame-description">
                    Live operational metrics
                  </span>
                </div>

                <div className="performance-frame-status">
                  <span className="performance-status-dot" />
                  LIVE
                </div>

              </div>

              <div className="reports-stats-shell">
                <ReportCards
                  projects={projects}
                  tasks={tasks}
                />
              </div>

            </div>

          </section>


          {/* =====================================================
              02 / VISUAL ANALYTICS
          ====================================================== */}
          <section className="reports-analytics">

            <div className="reports-analytics-heading">

              <div className="section-heading-copy">

                <div className="section-kicker">
                  <span className="kicker-line" />
                  <span className="section-number">02</span>
                  <span className="section-slash">/</span>
                  VISUAL ANALYTICS
                </div>

                <h2>Performance intelligence</h2>

                <p>
                  Transform workspace activity into clear,
                  actionable performance insights.
                </p>

              </div>

              <div className="analytics-live-badge">
                <span className="analytics-live-dot" />
                Live analytics
              </div>

            </div>


            {/* =================================================
                CHART GRID
            ================================================== */}
            <div className="reports-grid">

              {/* TASK STATUS */}
              <article className="report-chart-card report-chart-wide">

                <div className="chart-card-top-line" />

                <div className="report-chart-card-header">

                  <div className="chart-heading-copy">

                    <span className="chart-kicker">
                      01 / TASK ANALYTICS
                    </span>

                    <h3>Task Status</h3>

                    <p>
                      Current distribution of tasks across
                      your workspace.
                    </p>

                  </div>

                  <div className="chart-header-icon">
                    <span>✓</span>
                  </div>

                </div>

                <div className="chart-divider" />

                <div className="report-chart-body task-status-body">
                  <TaskStatusChart tasks={tasks} />
                </div>

              </article>


              {/* PROJECT PROGRESS */}
              <article className="report-chart-card">

                <div className="chart-card-top-line" />

                <div className="report-chart-card-header">

                  <div className="chart-heading-copy">

                    <span className="chart-kicker">
                      02 / PROJECT ANALYTICS
                    </span>

                    <h3>Project Progress</h3>

                    <p>
                      Progress overview across all active
                      projects.
                    </p>

                  </div>

                  <div className="chart-header-icon">
                    <span>↗</span>
                  </div>

                </div>

                <div className="chart-divider" />

                <div className="report-chart-body project-progress-body">
                  <ProjectProgressChart projects={projects} />
                </div>

              </article>


              {/* TASK PRIORITY */}
              <article className="report-chart-card">

                <div className="chart-card-top-line" />

                <div className="report-chart-card-header">

                  <div className="chart-heading-copy">

                    <span className="chart-kicker">
                      03 / PRIORITY ANALYTICS
                    </span>

                    <h3>Task Priority</h3>

                    <p>
                      Priority distribution across workspace
                      tasks.
                    </p>

                  </div>

                  <div className="chart-header-icon">
                    <span>◎</span>
                  </div>

                </div>

                <div className="chart-divider" />

                <div className="report-chart-body priority-chart-body">
                  <PriorityChart tasks={tasks} />
                </div>

              </article>

            </div>

          </section>


          {/* =====================================================
              ANALYTICS WAITING
          ====================================================== */}
          <section className="analytics-waiting">

            <div className="waiting-glow" />
            <div className="waiting-glow-secondary" />

            <div className="analytics-waiting-icon">
              <span>↗</span>
            </div>

            <div className="analytics-waiting-main">

              <div className="waiting-kicker">
                TASKFLOW ANALYTICS
              </div>

              <h3>
                Your analytics are waiting
              </h3>

              <p>
                Create projects and tasks to start generating
                meaningful workspace reports and performance
                insights.
              </p>

            </div>

            <div className="analytics-engine">

              <span className="engine-pulse" />

              <div>
                <strong>TaskFlow Analytics Engine</strong>
                <span>Ready for workspace activity</span>
              </div>

            </div>

          </section>


          {/* =====================================================
              REPORT CENTER / EXPORT
          ====================================================== */}
          <section className="reports-export">

            <div className="export-background-glow" />

            <div className="export-decoration export-decoration-one" />
            <div className="export-decoration export-decoration-two" />

            <div className="reports-export-content">

              <div className="section-kicker export-kicker">
                <span className="kicker-line" />
                REPORT CENTER
              </div>

              <div className="export-title-row">

                <div>
                  <h3>
                    Export workspace analytics
                  </h3>

                  <p>
                    Download your current project and task
                    performance data whenever you need it.
                  </p>
                </div>

                <div className="export-status">

                  <span className="export-status-icon">
                    ↓
                  </span>

                  <div>
                    <strong>Ready to export</strong>
                    <span>Workspace data available</span>
                  </div>

                </div>

              </div>

            </div>


            <div className="reports-export-actions">

              <div className="export-actions-label">
                <span>AVAILABLE FORMATS</span>
              </div>

              <ExportButtons
                projects={projects}
                tasks={tasks}
              />

            </div>

          </section>


          {/* =====================================================
              FOOTER
          ====================================================== */}
          <footer className="reports-footer">

            <div className="reports-footer-left">
              <span className="footer-status-dot" />
              <span>Secure workspace analytics</span>
            </div>

            <span>
              Metrics update automatically with workspace activity.
            </span>

          </footer>

        </div>

      </main>
    </MainLayout>
  );
};

export default Reports;