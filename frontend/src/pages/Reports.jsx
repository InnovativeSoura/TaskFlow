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
          <div className="reports-grid-overlay"></div>

          <div className="reports-glow reports-glow-one"></div>
          <div className="reports-glow reports-glow-two"></div>
          <div className="reports-glow reports-glow-three"></div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="reports-container">

          {/* ===================================================
              PAGE HEADER
          ==================================================== */}

          <section className="reports-hero">

            <div className="reports-hero-content">
              <div className="reports-hero-label">
                <span className="reports-hero-line"></span>

                <span>WORKSPACE INTELLIGENCE</span>

                <span className="reports-live-indicator">
                  <span></span>
                  LIVE
                </span>
              </div>

              <ReportsHeader />
            </div>

            <div className="reports-hero-decoration">
              <div className="hero-orbit hero-orbit-one"></div>
              <div className="hero-orbit hero-orbit-two"></div>

              <div className="hero-core">
                <span>TF</span>
              </div>
            </div>

          </section>


          {/* ===================================================
              PERFORMANCE OVERVIEW
          ==================================================== */}

          <section className="reports-section reports-overview-section">

            <div className="reports-section-header">

              <div className="reports-section-heading">

                <div className="reports-section-index">
                  01
                </div>

                <div>
                  <span className="reports-section-eyebrow">
                    PERFORMANCE OVERVIEW
                  </span>

                  <h2>
                    Workspace at a glance
                  </h2>

                  <p>
                    A real-time snapshot of your projects,
                    tasks, and overall workspace activity.
                  </p>
                </div>

              </div>

              <div className="reports-section-status">
                <span className="status-pulse"></span>

                <span>
                  Workspace synchronized
                </span>
              </div>

            </div>


            <div className="reports-stats-wrapper">
              <ReportCards
                projects={projects}
                tasks={tasks}
              />
            </div>

          </section>


          {/* ===================================================
              VISUAL ANALYTICS
          ==================================================== */}

          <section className="reports-section reports-analytics-section">

            <div className="reports-section-header">

              <div className="reports-section-heading">

                <div className="reports-section-index">
                  02
                </div>

                <div>
                  <span className="reports-section-eyebrow">
                    VISUAL ANALYTICS
                  </span>

                  <h2>
                    Performance intelligence
                  </h2>

                  <p>
                    Transform workspace activity into clear,
                    actionable performance insights.
                  </p>
                </div>

              </div>

              <div className="analytics-live-badge">
                <span className="analytics-live-dot"></span>

                <span>
                  Live analytics
                </span>
              </div>

            </div>


            {/* =================================================
                CHART DASHBOARD
            ================================================== */}

            <div className="reports-chart-grid">

              {/* ===============================================
                  TASK STATUS — LARGE CARD
              ================================================ */}

              <article className="reports-chart-card reports-chart-status">

                <div className="chart-card-top">

                  <div className="chart-card-heading">

                    <span className="chart-card-number">
                      01 / TASK ANALYTICS
                    </span>

                    <h3>
                      Task Status
                    </h3>

                    <p>
                      Current distribution of tasks
                      across your workspace.
                    </p>

                  </div>

                  <div className="chart-card-action">
                    <span>✓</span>
                  </div>

                </div>


                <div className="chart-card-divider"></div>


                <div className="chart-card-content">
                  <TaskStatusChart
                    tasks={tasks}
                  />
                </div>

              </article>


              {/* ===============================================
                  PROJECT PROGRESS
              ================================================ */}

              <article className="reports-chart-card reports-chart-project">

                <div className="chart-card-top">

                  <div className="chart-card-heading">

                    <span className="chart-card-number">
                      02 / PROJECT ANALYTICS
                    </span>

                    <h3>
                      Project Progress
                    </h3>

                    <p>
                      Progress overview across
                      all active projects.
                    </p>

                  </div>

                  <div className="chart-card-action">
                    <span>↗</span>
                  </div>

                </div>


                <div className="chart-card-divider"></div>


                <div className="chart-card-content">
                  <ProjectProgressChart
                    projects={projects}
                  />
                </div>

              </article>


              {/* ===============================================
                  TASK PRIORITY
              ================================================ */}

              <article className="reports-chart-card reports-chart-priority">

                <div className="chart-card-top">

                  <div className="chart-card-heading">

                    <span className="chart-card-number">
                      03 / PRIORITY ANALYTICS
                    </span>

                    <h3>
                      Task Priority
                    </h3>

                    <p>
                      Understand the priority
                      distribution of your tasks.
                    </p>

                  </div>

                  <div className="chart-card-action">
                    <span>◎</span>
                  </div>

                </div>


                <div className="chart-card-divider"></div>


                <div className="chart-card-content priority-chart-content">
                  <PriorityChart
                    tasks={tasks}
                  />
                </div>

              </article>

            </div>

          </section>


          {/* ===================================================
              INSIGHT / ANALYTICS ENGINE
          ==================================================== */}

          <section className="reports-insight-card">

            <div className="insight-card-decoration">
              <div></div>
              <div></div>
              <div></div>
            </div>


            <div className="insight-icon-wrapper">

              <div className="insight-icon">
                ↗
              </div>

            </div>


            <div className="insight-content">

              <span className="insight-eyebrow">
                TASKFLOW ANALYTICS ENGINE
              </span>

              <h3>
                Your workspace intelligence is ready
              </h3>

              <p>
                Create projects and tasks to generate
                deeper performance insights, productivity
                trends, and actionable workspace reports.
              </p>

            </div>


            <div className="insight-engine-status">

              <span className="engine-status-dot"></span>

              <div>
                <strong>
                  Analytics Engine
                </strong>

                <span>
                  Operational
                </span>
              </div>

            </div>

          </section>


          {/* ===================================================
              EXPORT CENTER
          ==================================================== */}

          <section className="reports-export-card">

            <div className="reports-export-left">

              <div className="export-icon">
                ↓
              </div>

              <div className="export-copy">

                <span className="reports-section-eyebrow">
                  REPORT CENTER
                </span>

                <h3>
                  Export workspace analytics
                </h3>

                <p>
                  Download your current project and
                  task performance data.
                </p>

              </div>

            </div>


            <div className="reports-export-actions">

              <ExportButtons
                projects={projects}
                tasks={tasks}
              />

            </div>

          </section>


          {/* ===================================================
              FOOTER
          ==================================================== */}

          <footer className="reports-footer">

            <div className="reports-footer-left">

              <span className="footer-secure-dot"></span>

              <span>
                Secure workspace analytics
              </span>

            </div>

            <div className="reports-footer-right">

              <span>
                Metrics update automatically
              </span>

              <span className="footer-separator">
                •
              </span>

              <span>
                TaskFlow Intelligence
              </span>

            </div>

          </footer>

        </div>

      </main>
    </MainLayout>
  );
};

export default Reports;