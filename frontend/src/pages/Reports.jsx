import { useMemo } from "react";
import {
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaFolderOpen,
  FaLayerGroup,
  FaArrowTrendUp,
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
     SAFE DATA CALCULATIONS
  ========================================================= */

  const reportStats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((task) => {
      const status = String(task?.status || "").toLowerCase();

      return (
        status === "completed" ||
        status === "done" ||
        status === "complete"
      );
    }).length;

    const pendingTasks = Math.max(
      totalTasks - completedTasks,
      0
    );

    const completionRate =
      totalTasks > 0
        ? Math.round(
            (completedTasks / totalTasks) * 100
          )
        : 0;

    const projectProgress =
      projects.length > 0
        ? Math.round(
            projects.reduce((total, project) => {
              const progress = Number(
                project?.progress ?? 0
              );

              return total + progress;
            }, 0) / projects.length
          )
        : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      projectProgress,
    };
  }, [projects, tasks]);

  return (
    <MainLayout>
      <div className="reports-page">

        {/* =====================================================
            PREMIUM BACKGROUND
        ===================================================== */}

        <div className="reports-background">
          <div className="reports-bg-grid" />

          <div className="reports-orb reports-orb-one" />
          <div className="reports-orb reports-orb-two" />
          <div className="reports-orb reports-orb-three" />

          <div className="reports-glow reports-glow-one" />
          <div className="reports-glow reports-glow-two" />
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main className="reports-container">

          {/* ===================================================
              PAGE HEADER
          =================================================== */}

          <section className="reports-hero">

            <div className="reports-hero-left">

              <div className="reports-hero-icon">
                <FaChartLine />
                <span />
              </div>

              <div className="reports-hero-content">

                <div className="reports-eyebrow">
                  <FaArrowTrendUp />
                  TASKFLOW ANALYTICS
                  <span />
                  LIVE OVERVIEW
                </div>

                <h1>
                  Reports &{" "}
                  <span>Analytics</span>
                </h1>

                <p>
                  Track project performance, task completion,
                  priorities and overall workspace productivity.
                </p>

              </div>

            </div>

            <div className="reports-hero-status">

              <div className="reports-status-dot" />

              <div>
                <strong>Workspace Active</strong>
                <span>Analytics are up to date</span>
              </div>

            </div>

          </section>

          {/* ===================================================
              QUICK INSIGHT STRIP
          =================================================== */}

          <section className="reports-insight-strip">

            <div className="reports-insight-item">

              <div className="reports-insight-icon blue">
                <FaFolderOpen />
              </div>

              <div>
                <span>Projects</span>
                <strong>
                  {reportStats.totalProjects}
                </strong>
              </div>

            </div>

            <div className="reports-insight-divider" />

            <div className="reports-insight-item">

              <div className="reports-insight-icon purple">
                <FaClipboardList />
              </div>

              <div>
                <span>Total Tasks</span>
                <strong>
                  {reportStats.totalTasks}
                </strong>
              </div>

            </div>

            <div className="reports-insight-divider" />

            <div className="reports-insight-item">

              <div className="reports-insight-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <span>Completed</span>
                <strong>
                  {reportStats.completedTasks}
                </strong>
              </div>

            </div>

            <div className="reports-insight-divider" />

            <div className="reports-insight-item">

              <div className="reports-insight-icon orange">
                <FaLayerGroup />
              </div>

              <div>
                <span>Completion Rate</span>
                <strong>
                  {reportStats.completionRate}%
                </strong>
              </div>

            </div>

            <div className="reports-productivity">

              <div className="reports-productivity-ring">
                <span>
                  {reportStats.projectProgress}%
                </span>
              </div>

              <div>
                <span>Project Progress</span>
                <strong>
                  Overall progress
                </strong>
              </div>

            </div>

          </section>

          {/* ===================================================
              EXISTING REPORT HEADER
          =================================================== */}

          <div className="reports-section reports-header-section">
            <ReportsHeader />
          </div>

          {/* ===================================================
              STATISTICS
          =================================================== */}

          <section className="reports-section">

            <div className="reports-section-heading">

              <div>
                <span className="reports-section-kicker">
                  PERFORMANCE
                </span>

                <h2>
                  Workspace Overview
                </h2>

                <p>
                  A high-level summary of your current
                  TaskFlow workspace.
                </p>
              </div>

              <div className="reports-section-badge">
                <FaShieldAlt />
                Data Overview
              </div>

            </div>

            <div className="reports-cards-wrapper">
              <ReportCards
                projects={projects}
                tasks={tasks}
              />
            </div>

          </section>

          {/* ===================================================
              CHARTS
          =================================================== */}

          <section className="reports-section charts-section">

            <div className="reports-section-heading">

              <div>
                <span className="reports-section-kicker">
                  ANALYTICS
                </span>

                <h2>
                  Performance Insights
                </h2>

                <p>
                  Understand task distribution, project
                  progress and workload priorities.
                </p>
              </div>

              <div className="reports-chart-live">
                <span />
                Live Analytics
              </div>

            </div>

            <div className="reports-grid">

              <div className="reports-chart-item reports-chart-large">
                <TaskStatusChart
                  tasks={tasks}
                />
              </div>

              <div className="reports-chart-item reports-chart-large">
                <ProjectProgressChart
                  projects={projects}
                />
              </div>

              <div className="reports-chart-item reports-chart-full">
                <PriorityChart
                  tasks={tasks}
                />
              </div>

            </div>

          </section>

          {/* ===================================================
              EXPORT SECTION
          =================================================== */}

          <section className="reports-export-section">

            <div className="reports-export-left">

              <div className="reports-export-icon">
                <FaChartLine />
              </div>

              <div>
                <span>
                  REPORT CENTER
                </span>

                <h3>
                  Export your analytics
                </h3>

                <p>
                  Generate a downloadable report from
                  your current project and task data.
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
          =================================================== */}

          <footer className="reports-footer">

            <div className="reports-footer-left">

              <div className="reports-footer-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>
                  TaskFlow Analytics
                </strong>

                <span>
                  Your workspace performance data is
                  securely processed.
                </span>
              </div>

            </div>

            <div className="reports-footer-status">
              <span />
              System Operational
            </div>

          </footer>

        </main>
      </div>
    </MainLayout>
  );
};

export default Reports;