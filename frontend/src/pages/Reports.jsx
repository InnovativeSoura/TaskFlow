import { useMemo } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaFolderOpen,
  FaCheckCircle,
  FaClock,
  FaLayerGroup,
  FaBullseye,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";

import { useProjects } from "../context/ProjectContext";
import { useTasks } from "../context/TaskContext";

import "../styles/Reports.css";

/* ============================================================
   HELPERS
============================================================ */

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

/* ============================================================
   REPORTS PAGE
============================================================ */

const Reports = () => {
  const { projects = [] } = useProjects();
  const { tasks = [] } = useTasks();

  /* ==========================================================
     TASK STATUS
  ========================================================== */

  const statusData = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter((task) => {
      const status = normalize(task.status);

      return [
        "completed",
        "complete",
        "done",
        "finished",
      ].includes(status);
    }).length;

    const inProgress = tasks.filter((task) => {
      const status = normalize(task.status);

      return [
        "in-progress",
        "inprogress",
        "in_progress",
        "active",
        "working",
      ].includes(status);
    }).length;

    const review = tasks.filter((task) => {
      const status = normalize(task.status);

      return [
        "review",
        "in-review",
        "in_review",
      ].includes(status);
    }).length;

    const pending = Math.max(
      total - completed - inProgress - review,
      0
    );

    return {
      total,
      completed,
      inProgress,
      review,
      pending,
    };
  }, [tasks]);

  /* ==========================================================
     PROJECT PROGRESS
  ========================================================== */

  const projectProgress = useMemo(() => {
    if (!projects.length) {
      return {
        average: 0,
        completed: 0,
        active: 0,
      };
    }

    const values = projects.map((project) => {
      const value =
        project.progress ??
        project.completion ??
        project.completionPercentage ??
        project.percentage ??
        0;

      const numericValue = Number(value);

      return Math.min(
        100,
        Math.max(
          0,
          Number.isFinite(numericValue)
            ? numericValue
            : 0
        )
      );
    });

    const average = Math.round(
      values.reduce((sum, value) => sum + value, 0) /
        values.length
    );

    const completed = values.filter(
      (value) => value >= 100
    ).length;

    const active = values.filter(
      (value) => value > 0 && value < 100
    ).length;

    return {
      average,
      completed,
      active,
    };
  }, [projects]);

  /* ==========================================================
     TASK PRIORITY
  ========================================================== */

  const priorityData = useMemo(() => {
    const high = tasks.filter((task) => {
      const priority = normalize(task.priority);

      return [
        "high",
        "urgent",
        "critical",
      ].includes(priority);
    }).length;

    const medium = tasks.filter((task) => {
      const priority = normalize(task.priority);

      return [
        "medium",
        "moderate",
        "normal",
      ].includes(priority);
    }).length;

    const low = tasks.filter((task) => {
      const priority = normalize(task.priority);

      return [
        "low",
        "minor",
      ].includes(priority);
    }).length;

    /*
      If some tasks do not have a recognized priority,
      keep them out of the three priority buckets rather
      than incorrectly assigning them.
    */

    const total = high + medium + low;

    const highPercent =
      total > 0 ? Math.round((high / total) * 100) : 0;

    const mediumPercent =
      total > 0 ? Math.round((medium / total) * 100) : 0;

    const lowPercent =
      total > 0
        ? Math.max(
            0,
            100 - highPercent - mediumPercent
          )
        : 0;

    return {
      high,
      medium,
      low,
      total,
      highPercent,
      mediumPercent,
      lowPercent,
    };
  }, [tasks]);

  /* ==========================================================
     COMPLETION
  ========================================================== */

  const completionPercent = useMemo(() => {
    if (!tasks.length) return 0;

    return Math.round(
      (statusData.completed / tasks.length) * 100
    );
  }, [tasks, statusData.completed]);

  /* ==========================================================
     DONUT STYLE
  ========================================================== */

  const priorityDonutStyle = useMemo(() => {
    const {
      highPercent,
      mediumPercent,
      lowPercent,
    } = priorityData;

    if (priorityData.total === 0) {
      return {
        background:
          "conic-gradient(#273451 0deg 360deg)",
      };
    }

    const highEnd = highPercent * 3.6;

    const mediumEnd =
      highEnd + mediumPercent * 3.6;

    return {
      background: `conic-gradient(
        #ff4d4d 0deg ${highEnd}deg,
        #f5a623 ${highEnd}deg ${mediumEnd}deg,
        #35c878 ${mediumEnd}deg 360deg
      )`,
    };
  }, [priorityData]);

  /* ==========================================================
     STATUS BAR WIDTH
  ========================================================== */

  const getStatusWidth = (value) => {
    if (!statusData.total) return "0%";

    return `${Math.round(
      (value / statusData.total) * 100
    )}%`;
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <MainLayout>
      <div className="reports-page">

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <header className="reports-page-header">

          <div className="reports-header-copy">

            <div className="reports-eyebrow">
              <span className="eyebrow-line" />
              VISUAL ANALYTICS
            </div>

            <h1>
              Performance intelligence
            </h1>

            <p>
              Understand task distribution, project progress,
              and priority across your workspace.
            </p>

          </div>

          <div className="reports-header-badge">
            <FaChartLine />
            <span>Analytics dashboard</span>
          </div>

        </header>

        {/* ====================================================
            TASK STATUS
        ==================================================== */}

        <section className="analytics-card analytics-card-status">

          <div className="analytics-card-header">

            <div>
              <div className="analytics-label">
                01 / TASK ANALYTICS
              </div>

              <h2>Task Status</h2>

              <p>
                Current distribution of workspace tasks.
              </p>
            </div>

            <div className="analytics-icon">
              <FaClipboardList />
            </div>

          </div>

          <div className="status-content">

            <div className="status-overview">

              <div className="status-total">
                <span>
                  Total Tasks
                </span>

                <strong>
                  {statusData.total}
                </strong>
              </div>

              <div className="status-completion">
                <FaArrowUp />

                <strong>
                  {completionPercent}%
                </strong>

                <span>
                  completion
                </span>
              </div>

            </div>

            <div className="status-bars">

              <StatusBar
                label="Completed"
                value={statusData.completed}
                width={getStatusWidth(
                  statusData.completed
                )}
                type="completed"
              />

              <StatusBar
                label="In Progress"
                value={statusData.inProgress}
                width={getStatusWidth(
                  statusData.inProgress
                )}
                type="progress"
              />

              <StatusBar
                label="Review"
                value={statusData.review}
                width={getStatusWidth(
                  statusData.review
                )}
                type="review"
              />

              <StatusBar
                label="Pending"
                value={statusData.pending}
                width={getStatusWidth(
                  statusData.pending
                )}
                type="pending"
              />

            </div>

          </div>

        </section>

        {/* ====================================================
            LOWER ANALYTICS GRID
        ==================================================== */}

        <div className="analytics-grid">

          {/* ==================================================
              PROJECT PROGRESS
          ================================================== */}

          <section className="analytics-card project-progress-card">

            <div className="analytics-card-header">

              <div>
                <div className="analytics-label">
                  02 / PROJECT ANALYTICS
                </div>

                <h2>
                  Project Progress
                </h2>

                <p>
                  Progress overview across all projects.
                </p>
              </div>

              <div className="analytics-icon">
                <FaChartLine />
              </div>

            </div>

            <div className="project-progress-body">

              {projects.length === 0 ? (
                <div className="analytics-empty-state">

                  <div className="empty-icon">
                    <FaFolderOpen />
                  </div>

                  <h3>
                    No project data available
                  </h3>

                  <p>
                    Create projects to see progress
                    analytics here.
                  </p>

                </div>
              ) : (
                <>
                  <div className="progress-ring">

                    <svg
                      viewBox="0 0 120 120"
                      className="progress-ring-svg"
                    >
                      <circle
                        className="progress-ring-track"
                        cx="60"
                        cy="60"
                        r="48"
                      />

                      <circle
                        className="progress-ring-value"
                        cx="60"
                        cy="60"
                        r="48"
                        style={{
                          strokeDashoffset:
                            301 -
                            (301 *
                              projectProgress.average) /
                              100,
                        }}
                      />
                    </svg>

                    <div className="progress-ring-content">
                      <strong>
                        {projectProgress.average}%
                      </strong>

                      <span>
                        Average
                      </span>
                    </div>

                  </div>

                  <div className="project-progress-stats">

                    <div>
                      <strong>
                        {projects.length}
                      </strong>

                      <span>
                        Total Projects
                      </span>
                    </div>

                    <div>
                      <strong>
                        {projectProgress.active}
                      </strong>

                      <span>
                        Active Projects
                      </span>
                    </div>

                    <div>
                      <strong>
                        {projectProgress.completed}
                      </strong>

                      <span>
                        Completed
                      </span>
                    </div>

                  </div>
                </>
              )}

            </div>

          </section>

          {/* ==================================================
              TASK PRIORITY
          ================================================== */}

          <section className="analytics-card priority-card">

            <div className="analytics-card-header">

              <div>
                <div className="analytics-label">
                  03 / PRIORITY ANALYTICS
                </div>

                <h2>
                  Task Priority
                </h2>

                <p>
                  Priority distribution across tasks.
                </p>
              </div>

              <div className="analytics-icon">
                <FaBullseye />
              </div>

            </div>

            {/* ================================================
                PRIORITY MAIN CONTENT
            ================================================= */}

            <div className="priority-main">

              {/* DONUT */}

              <div className="priority-donut-area">

                <div
                  className="priority-donut"
                  style={priorityDonutStyle}
                >

                  <div className="priority-donut-inner">

                    <FaLayerGroup />

                    <span>
                      Total Tasks
                    </span>

                    <strong>
                      {priorityData.total}
                    </strong>

                  </div>

                </div>

              </div>

              {/* LEGEND */}

              <div className="priority-legend">

                <PriorityLegend
                  label="High Priority"
                  value={priorityData.high}
                  percent={
                    priorityData.highPercent
                  }
                  type="high"
                />

                <PriorityLegend
                  label="Medium Priority"
                  value={priorityData.medium}
                  percent={
                    priorityData.mediumPercent
                  }
                  type="medium"
                />

                <PriorityLegend
                  label="Low Priority"
                  value={priorityData.low}
                  percent={
                    priorityData.lowPercent
                  }
                  type="low"
                />

              </div>

            </div>

            {/* ================================================
                PRIORITY SUMMARY CARDS
            ================================================= */}

            <div className="priority-summary">

              <PrioritySummary
                icon={<FaArrowUp />}
                value={priorityData.high}
                label="High Priority"
                percent={
                  priorityData.highPercent
                }
                type="high"
              />

              <PrioritySummary
                icon={<FaMinus />}
                value={priorityData.medium}
                label="Medium Priority"
                percent={
                  priorityData.mediumPercent
                }
                type="medium"
              />

              <PrioritySummary
                icon={<FaArrowDown />}
                value={priorityData.low}
                label="Low Priority"
                percent={
                  priorityData.lowPercent
                }
                type="low"
              />

            </div>

          </section>

        </div>

        {/* ====================================================
            BOTTOM INFORMATION BAR
        ==================================================== */}

        <section className="reports-info-bar">

          <div className="reports-info-icon">
            <FaChartPie />
          </div>

          <div className="reports-info-copy">

            <strong>
              {tasks.length
                ? "Analytics are ready"
                : "Your analytics are waiting"}
            </strong>

            <span>
              {tasks.length
                ? "Your workspace activity is being reflected in the analytics above."
                : "Create projects and tasks to start generating meaningful workspace reports."}
            </span>

          </div>

          <div className="reports-live-status">
            <span className="live-dot" />
            TaskFlow Analytics Engine
          </div>

        </section>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="reports-footer">

          <div>
            <FaShieldAlt />
            Secure workspace analytics
          </div>

          <span>
            Metrics update automatically with workspace activity.
          </span>

        </footer>

      </div>
    </MainLayout>
  );
};

/* ============================================================
   STATUS BAR COMPONENT
============================================================ */

const StatusBar = ({
  label,
  value,
  width,
  type,
}) => {
  return (
    <div className="status-row">

      <div className="status-row-top">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <div className="status-track">

        <div
          className={`status-fill ${type}`}
          style={{
            width,
          }}
        />

      </div>

    </div>
  );
};

/* ============================================================
   PRIORITY LEGEND
============================================================ */

const PriorityLegend = ({
  label,
  value,
  percent,
  type,
}) => {
  return (
    <div className="priority-legend-item">

      <div className="priority-legend-left">

        <span
          className={`priority-dot ${type}`}
        />

        <span>
          {label}
        </span>

      </div>

      <div className="priority-legend-value">

        <strong>
          {value}
        </strong>

        <span>
          ({percent}%)
        </span>

      </div>

    </div>
  );
};

/* ============================================================
   PRIORITY SUMMARY
============================================================ */

const PrioritySummary = ({
  icon,
  value,
  label,
  percent,
  type,
}) => {
  return (
    <div
      className={`priority-summary-card ${type}`}
    >

      <div className="priority-summary-icon">
        {icon}
      </div>

      <div className="priority-summary-content">

        <div className="priority-summary-value">
          {value}
        </div>

        <div className="priority-summary-label">
          {label}
        </div>

      </div>

      <div className="priority-summary-percent">
        {percent}%
      </div>

    </div>
  );
};

export default Reports;