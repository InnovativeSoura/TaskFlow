import { useMemo } from "react";
import {
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaFolderOpen,
  FaLayerGroup,
  FaArrowUp,
  FaShieldAlt,
} from "react-icons/fa";

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

  /* =========================================================
     SAFE STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
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

    const pendingTasks = Math.max(
      totalTasks - completedTasks,
      0
    );

    const completedProjects = projects.filter((project) => {
      const status = String(project?.status || "").toLowerCase();

      return (
        status === "completed" ||
        status === "complete" ||
        status === "done"
      );
    }).length;

    const activeProjects = projects.filter((project) => {
      const status = String(project?.status || "").toLowerCase();

      return (
        status === "active" ||
        status === "in progress" ||
        status === "in-progress"
      );
    }).length;

    const completionRate =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    const projectCompletionRate =
      totalProjects > 0
        ? Math.round(
            (completedProjects / totalProjects) * 100
          )
        : 0;

    const averageProjectProgress =
      totalProjects > 0
        ? Math.round(
            projects.reduce((total, project) => {
              const progress = Number(
                project?.progress ?? 0
              );

              return total + (
                Number.isFinite(progress)
                  ? progress
                  : 0
              );
            }, 0) / totalProjects
          )
        : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completedProjects,
      activeProjects,
      completionRate,
      projectCompletionRate,
      averageProjectProgress,
    };
  }, [projects, tasks]);

  /* =========================================================
     REPORT STAT CARDS
  ========================================================= */

  const premiumStats = [
    {
      title: "Total Projects",
      value: statistics.totalProjects,
      description: "Projects in your workspace",
      icon: FaFolderOpen,
      className: "blue",
    },
    {
      title: "Total Tasks",
      value: statistics.totalTasks,
      description: "Tasks across all projects",
      icon: FaClipboardList,
      className: "purple",
    },
    {
      title: "Completed",
      value: statistics.completedTasks,
      description: `${statistics.completionRate}% task completion`,
      icon: FaCheckCircle,
      className: "green",
    },
    {
      title: "Pending",
      value: statistics.pendingTasks,
      description: "Tasks still requiring action",
      icon: FaLayerGroup,
      className: "orange",
    },
  ];

  return (
    <MainLayout>
      <div className="reports-page">

        {/* =====================================================
            PREMIUM BACKGROUND
        ===================================================== */}

        <div
          className="reports-background"
          aria-hidden="true"
        >
          <div className="reports-bg-grid" />

          <div className="reports-bg-orb reports-bg-orb-1" />
          <div className="reports-bg-orb reports-bg-orb-2" />
          <div className="reports-bg-orb reports-bg-orb-3" />

          <div className="reports-bg-glow reports-bg-glow-1" />
          <div className="reports-bg-glow reports-bg-glow-2" />

          <span className="reports-particle reports-particle-1" />
          <span className="reports-particle reports-particle-2" />
          <span className="reports-particle reports-particle-3" />
          <span className="reports-particle reports-particle-4" />
          <span className="reports-particle reports-particle-5" />
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="reports-container">

          {/* ===================================================
              HEADER
          =================================================== */}

          <section className="reports-hero">

            <div className="reports-hero-content">

              <div className="reports-hero-icon">
                <FaChartLine />
              </div>

              <div>
                <div className="reports-eyebrow">
                  <span>WORKSPACE</span>
                  <i />
                  <strong>ANALYTICS</strong>
                </div>

                <h1>
                  Reports &amp; Analytics
                </h1>

                <p>
                  Track project performance, task
                  completion, productivity and
                  workspace activity.
                </p>
              </div>

            </div>

            <div className="reports-hero-status">

              <div className="reports-live-dot" />

              <span>LIVE DATA</span>

              <div className="reports-hero-divider" />

              <FaShieldAlt />

              <span>SECURE</span>

            </div>

          </section>

          {/* ===================================================
              EXISTING REPORT HEADER
          =================================================== */}

          <div className="reports-component-wrapper">
            <ReportsHeader />
          </div>

          {/* ===================================================
              PREMIUM OVERVIEW
          =================================================== */}

          <section className="reports-overview">

            <div className="reports-section-heading">

              <div>
                <span>PERFORMANCE OVERVIEW</span>

                <h2>
                  Workspace at a glance
                </h2>

                <p>
                  A real-time summary of your
                  projects and task performance.
                </p>
              </div>

              <div className="reports-heading-badge">
                <FaArrowUp />
                <strong>
                  {statistics.completionRate}%
                </strong>
                <span>completion</span>
              </div>

            </div>

            <div className="premium-stat-grid">

              {premiumStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    className={`premium-stat-card ${stat.className}`}
                    key={stat.title}
                  >
                    <div className="premium-stat-glow" />

                    <div className="premium-stat-top">

                      <div className="premium-stat-icon">
                        <Icon />
                      </div>

                      <div className="premium-stat-arrow">
                        <FaArrowUp />
                      </div>

                    </div>

                    <div className="premium-stat-value">
                      {stat.value}
                    </div>

                    <div className="premium-stat-title">
                      {stat.title}
                    </div>

                    <div className="premium-stat-description">
                      {stat.description}
                    </div>

                  </div>
                );
              })}

            </div>

          </section>

          {/* ===================================================
              EXISTING REPORT CARDS
          =================================================== */}

          <section className="reports-component-section">

            <div className="reports-component-title">

              <div>
                <span>SUMMARY</span>

                <h2>
                  Performance metrics
                </h2>
              </div>

              <div className="reports-component-line" />

            </div>

            <div className="reports-existing-cards">
              <ReportCards
                projects={projects}
                tasks={tasks}
              />
            </div>

          </section>

          {/* ===================================================
              PERFORMANCE HIGHLIGHTS
          =================================================== */}

          <section className="reports-highlight-grid">

            <div className="reports-highlight-card">

              <div className="reports-highlight-icon blue">
                <FaChartLine />
              </div>

              <div>
                <span>AVERAGE PROJECT PROGRESS</span>

                <strong>
                  {statistics.averageProjectProgress}%
                </strong>

                <p>
                  Overall progress across your
                  active workspace projects.
                </p>
              </div>

            </div>

            <div className="reports-highlight-card">

              <div className="reports-highlight-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <span>PROJECT COMPLETION</span>

                <strong>
                  {statistics.projectCompletionRate}%
                </strong>

                <p>
                  {statistics.completedProjects} of{" "}
                  {statistics.totalProjects} projects
                  completed.
                </p>
              </div>

            </div>

            <div className="reports-highlight-card">

              <div className="reports-highlight-icon purple">
                <FaArrowUp />
              </div>

              <div>
                <span>ACTIVE PROJECTS</span>

                <strong>
                  {statistics.activeProjects}
                </strong>

                <p>
                  Projects currently in active
                  development or execution.
                </p>
              </div>

            </div>

          </section>

          {/* ===================================================
              CHARTS
          =================================================== */}

          <section className="reports-charts-section">

            <div className="reports-section-heading">

              <div>
                <span>DATA VISUALIZATION</span>

                <h2>
                  Performance analytics
                </h2>

                <p>
                  Visual insights into task status,
                  project progress and priorities.
                </p>
              </div>

            </div>

            <div className="reports-grid">

              <div className="reports-chart-wrapper reports-chart-large">
                <TaskStatusChart
                  tasks={tasks}
                />
              </div>

              <div className="reports-chart-wrapper reports-chart-large">
                <ProjectProgressChart
                  projects={projects}
                />
              </div>

              <div className="reports-chart-wrapper reports-chart-full">
                <PriorityChart
                  tasks={tasks}
                />
              </div>

            </div>

          </section>

          {/* ===================================================
              EXPORT
          =================================================== */}

          <section className="reports-export-section">

            <div className="reports-export-header">

              <div className="reports-export-icon">
                <FaClipboardList />
              </div>

              <div>
                <span>REPORT CENTER</span>

                <h2>
                  Export your analytics
                </h2>

                <p>
                  Download your project and task
                  performance data for further analysis.
                </p>
              </div>

            </div>

            <div className="reports-export-content">

              <ExportButtons
                projects={projects}
                tasks={tasks}
              />

            </div>

          </section>

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="reports-footer">

            <div className="reports-footer-left">

              <div className="reports-footer-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>
                  TaskFlow Analytics
                </strong>

                <span>
                  Your workspace performance is
                  continuously monitored.
                </span>
              </div>

            </div>

            <div className="reports-footer-secure">
              <FaCheckCircle />
              <span>
                Data synchronized
              </span>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;