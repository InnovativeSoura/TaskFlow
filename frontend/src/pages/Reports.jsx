import { useMemo } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaFolderOpen,
  FaLayerGroup,
  FaShieldAlt,
  FaArrowUp,
  FaArrowDown,
  FaTasks,
  FaClock,
  FaBolt,
  FaBullseye,
  FaChartPie,
} from "react-icons/fa";

import { useProjects } from "../context/ProjectContext";
import { useTasks } from "../context/TaskContext";

import TaskStatusChart from "../components/reports/TaskStatusChart";
import ProjectProgressChart from "../components/reports/ProjectProgressChart";
import PriorityChart from "../components/reports/PriorityChart";

import "../styles/Reports.css";

const Reports = () => {
  const { projects = [] } = useProjects();
  const { tasks = [] } = useTasks();

  const stats = useMemo(() => {
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

    const activeProjects = projects.filter((project) => {
      const status = String(project?.status || "").toLowerCase();

      return (
        status === "active" ||
        status === "in progress" ||
        status === "ongoing"
      );
    }).length;

    const projectProgress =
      totalProjects > 0
        ? Math.round(
            projects.reduce((sum, project) => {
              const progress = Number(project?.progress || 0);
              return sum + Math.min(Math.max(progress, 0), 100);
            }, 0) / totalProjects
          )
        : 0;

    const highPriority = tasks.filter((task) => {
      const priority = String(task?.priority || "").toLowerCase();

      return priority === "high" || priority === "urgent";
    }).length;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      activeProjects,
      projectProgress,
      highPriority,
    };
  }, [projects, tasks]);

  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      description: "Projects in workspace",
      icon: FaFolderOpen,
      className: "purple",
      trend: "Workspace",
      trendType: "neutral",
    },
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      description: "Tasks across projects",
      icon: FaClipboardList,
      className: "blue",
      trend: "Tracked",
      trendType: "up",
    },
    {
      label: "Completed",
      value: stats.completedTasks,
      description: `${stats.completionRate}% completion rate`,
      icon: FaCheckCircle,
      className: "green",
      trend: `${stats.completionRate}%`,
      trendType: "up",
    },
    {
      label: "Pending",
      value: stats.pendingTasks,
      description: "Tasks requiring action",
      icon: FaClock,
      className: "orange",
      trend: stats.pendingTasks > 0 ? "Action needed" : "Clear",
      trendType: stats.pendingTasks > 0 ? "down" : "up",
    },
  ];

  return (
    <MainLayout>
      <div className="reports-page">
        <div className="reports-shell">

          {/* =====================================================
              HERO
          ===================================================== */}
          <section className="reports-hero">

            <div className="reports-hero-glow reports-glow-one" />
            <div className="reports-hero-glow reports-glow-two" />

            <div className="reports-hero-content">

              <div className="reports-eyebrow">
                <span className="eyebrow-icon">
                  <FaChartLine />
                </span>

                <span>WORKSPACE ANALYTICS</span>

                <span className="live-indicator">
                  <span />
                  LIVE DATA
                </span>
              </div>

              <h1>
                Reports &amp;
                <span> Analytics</span>
              </h1>

              <p>
                Track project performance, task completion, productivity,
                and workspace activity from one central dashboard.
              </p>

              <div className="reports-hero-meta">
                <div className="hero-meta-item">
                  <FaShieldAlt />
                  <span>Secure workspace data</span>
                </div>

                <div className="hero-meta-divider" />

                <div className="hero-meta-item">
                  <FaBolt />
                  <span>Real-time metrics</span>
                </div>
              </div>

            </div>

            <div className="reports-hero-visual">

              <div className="hero-chart-orbit orbit-one" />
              <div className="hero-chart-orbit orbit-two" />

              <div className="hero-chart-card">

                <div className="hero-chart-top">
                  <div>
                    <span>COMPLETION</span>
                    <strong>{stats.completionRate}%</strong>
                  </div>

                  <div className="hero-chart-icon">
                    <FaChartLine />
                  </div>
                </div>

                <div className="hero-mini-bars">
                  <span style={{ height: "34%" }} />
                  <span style={{ height: "48%" }} />
                  <span style={{ height: "42%" }} />
                  <span style={{ height: "64%" }} />
                  <span style={{ height: "58%" }} />
                  <span style={{ height: "76%" }} />
                  <span style={{ height: `${Math.max(stats.completionRate, 10)}%` }} />
                </div>

                <div className="hero-chart-footer">
                  <span>Workspace performance</span>
                  <FaArrowUp />
                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              OVERVIEW HEADER
          ===================================================== */}
          <section className="reports-section-heading">

            <div>
              <span className="section-kicker">
                PERFORMANCE OVERVIEW
              </span>

              <h2>Workspace at a glance</h2>

              <p>
                A real-time summary of your projects and task performance.
              </p>
            </div>

            <div className="completion-summary">
              <div className="completion-ring">
                <span>{stats.completionRate}%</span>
              </div>

              <div>
                <strong>Overall completion</strong>
                <span>Task completion rate</span>
              </div>
            </div>

          </section>

          {/* =====================================================
              STAT CARDS
          ===================================================== */}
          <section className="reports-stat-grid">

            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  className={`reports-stat-card ${card.className}`}
                  key={card.label}
                >
                  <div className="stat-card-top">

                    <div className="stat-icon">
                      <Icon />
                    </div>

                    <span className={`stat-trend ${card.trendType}`}>
                      {card.trendType === "up" && <FaArrowUp />}
                      {card.trendType === "down" && <FaArrowDown />}
                      {card.trend}
                    </span>

                  </div>

                  <div className="stat-card-value">
                    {card.value}
                  </div>

                  <div className="stat-card-label">
                    {card.label}
                  </div>

                  <p>{card.description}</p>

                  <div className="stat-card-shine" />
                </article>
              );
            })}

          </section>

          {/* =====================================================
              INSIGHT STRIP
          ===================================================== */}
          <section className="insight-strip">

            <div className="insight-item">
              <div className="insight-icon purple">
                <FaLayerGroup />
              </div>

              <div>
                <span>ACTIVE PROJECTS</span>
                <strong>{stats.activeProjects}</strong>
              </div>
            </div>

            <div className="insight-divider" />

            <div className="insight-item">
              <div className="insight-icon blue">
                <FaTasks />
              </div>

              <div>
                <span>AVERAGE PROJECT PROGRESS</span>
                <strong>{stats.projectProgress}%</strong>
              </div>
            </div>

            <div className="insight-divider" />

            <div className="insight-item">
              <div className="insight-icon orange">
                <FaBullseye />
              </div>

              <div>
                <span>HIGH PRIORITY TASKS</span>
                <strong>{stats.highPriority}</strong>
              </div>
            </div>

            <div className="insight-divider" />

            <div className="insight-item">
              <div className="insight-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <span>COMPLETION RATE</span>
                <strong>{stats.completionRate}%</strong>
              </div>
            </div>

          </section>

          {/* =====================================================
              ANALYTICS HEADER
          ===================================================== */}
          <section className="analytics-heading">

            <div>
              <span className="section-kicker">
                VISUAL ANALYTICS
              </span>

              <h2>Performance intelligence</h2>

              <p>
                Understand task distribution, project progress,
                and priority across your workspace.
              </p>
            </div>

            <div className="analytics-badge">
              <FaChartPie />
              <span>Analytics dashboard</span>
            </div>

          </section>

          {/* =====================================================
              MAIN CHARTS
          ===================================================== */}
          <section className="reports-chart-grid">

            <div className="analytics-card analytics-card-large">
              <div className="analytics-card-header">
                <div>
                  <span>01 / TASK ANALYTICS</span>
                  <h3>Task Status</h3>
                  <p>Current distribution of workspace tasks.</p>
                </div>

                <div className="analytics-card-icon">
                  <FaClipboardList />
                </div>
              </div>

              <div className="analytics-chart-content">
                <TaskStatusChart tasks={tasks} />
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <span>02 / PROJECT ANALYTICS</span>
                  <h3>Project Progress</h3>
                  <p>Progress across active projects.</p>
                </div>

                <div className="analytics-card-icon">
                  <FaChartLine />
                </div>
              </div>

              <div className="analytics-chart-content">
                <ProjectProgressChart projects={projects} />
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <span>03 / PRIORITY ANALYTICS</span>
                  <h3>Task Priority</h3>
                  <p>Priority distribution across tasks.</p>
                </div>

                <div className="analytics-card-icon">
                  <FaBullseye />
                </div>
              </div>

              <div className="analytics-chart-content">
                <PriorityChart tasks={tasks} />
              </div>
            </div>

          </section>

          {/* =====================================================
              EMPTY / DATA MESSAGE
          ===================================================== */}
          {projects.length === 0 && tasks.length === 0 && (
            <section className="reports-empty-state">

              <div className="empty-icon">
                <FaChartLine />
              </div>

              <div>
                <h3>Your analytics are waiting</h3>

                <p>
                  Create projects and tasks to start generating
                  meaningful workspace reports.
                </p>
              </div>

            </section>
          )}

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <footer className="reports-footer">

            <div>
              <span className="footer-dot" />
              <span>TaskFlow Analytics Engine</span>
            </div>

            <span>
              Metrics update automatically with workspace activity.
            </span>

          </footer>

        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;