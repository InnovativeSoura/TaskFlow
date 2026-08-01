import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FaArrowUp,
  FaArrowRight,
  FaPlus,
  FaTasks,
  FaProjectDiagram,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaBolt,
  FaCalendarAlt,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import DashboardOverviewChart from "../components/dashboard/DashboardOverviewChart";
import ProjectProgressChart from "../components/projects/ProjectProgressChart";
import TaskStatusChart from "../components/tasks/TaskStatusChart";

import { useAuth } from "../context/AuthContext";

import {
  getDashboardStats,
} from "../services/dashboardService";

import "../styles/Dashboard.css";

/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [projects, setProjects] = useState([]);

  const [tasks, setTasks] = useState([]);

  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    tasks: 0,
    completed: 0,
    pending: 0,
    active: 0,
  });

  /* =========================================================
      LOAD DASHBOARD
  ========================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const data = await getDashboardStats();

      const usersData =
        data?.users?.users ||
        data?.users ||
        [];

      const projectsData =
        data?.projects?.projects ||
        data?.projects ||
        [];

      const tasksData =
        data?.tasks?.tasks ||
        data?.tasks ||
        [];

      const safeUsers = Array.isArray(usersData)
        ? usersData
        : [];

      const safeProjects = Array.isArray(projectsData)
        ? projectsData
        : [];

      const safeTasks = Array.isArray(tasksData)
        ? tasksData
        : [];

      setUsers(safeUsers);

      setProjects(safeProjects);

      setTasks(safeTasks);

      const completed =
        safeTasks.filter(
          (task) => task.status === "Completed"
        ).length;

      const pending =
        safeTasks.filter(
          (task) =>
            task.status === "Pending" ||
            task.status === "To Do"
        ).length;

      const active =
        safeProjects.filter(
          (project) =>
            project.status === "Active"
        ).length;

      setStats({
        users: safeUsers.length,
        projects: safeProjects.length,
        tasks: safeTasks.length,
        completed,
        pending,
        active,
      });

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

      setUsers([]);

      setProjects([]);

      setTasks([]);

      setStats({
        users: 0,
        projects: 0,
        tasks: 0,
        completed: 0,
        pending: 0,
        active: 0,
      });

    } finally {

      setLoading(false);

    }

  };

  /* =========================================================
      SEARCH
  ========================================================= */

  const searchQuery =
    search.trim().toLowerCase();

  const filteredProjects = useMemo(() => {

    if (!searchQuery) return projects;

    return projects.filter((project) => {

      const title =
        project.title ||
        project.name ||
        "";

      const description =
        project.description ||
        "";

      return (
        title
          .toLowerCase()
          .includes(searchQuery) ||

        description
          .toLowerCase()
          .includes(searchQuery)
      );

    });

  }, [projects, searchQuery]);

  const filteredTasks = useMemo(() => {

    if (!searchQuery) return tasks;

    return tasks.filter((task) => {

      const title =
        task.title ||
        task.name ||
        "";

      const description =
        task.description ||
        "";

      return (
        title
          .toLowerCase()
          .includes(searchQuery) ||

        description
          .toLowerCase()
          .includes(searchQuery)
      );

    });

  }, [tasks, searchQuery]);

  /* =========================================================
      PRODUCTIVITY
  ========================================================= */

  const completion =
    stats.tasks > 0
      ? Math.round(
          (stats.completed /
            stats.tasks) *
            100
        )
      : 0;

  /* =========================================================
      USER
  ========================================================= */

  const firstName =
    user?.name
      ?.trim()
      ?.split(/\s+/)?.[0] ||
    "there";

  /* =========================================================
      LOADING
  ========================================================= */

  if (loading) {

    return <Loader />;

  }

  return (

    <MainLayout>

      <div className="dashboard-page">
                {/* ===================================================
            HERO
        =================================================== */}

        <motion.section
          className="dashboard-hero"
          initial={{
            opacity: 0,
            y: -18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
        >

          <div className="dashboard-hero-content">

            <div className="dashboard-hero-text">

              <div className="dashboard-eyebrow">

                <span className="eyebrow-dot">

                  <FaCircle />

                </span>

                WORKSPACE OVERVIEW

              </div>

              <h1>

                Welcome back,

                <span>

                  {" "}{firstName}

                </span>

                👋

              </h1>

              <p>

                Here's everything happening across
                your workspace today. Monitor
                projects, manage tasks, collaborate
                with teammates and keep everything
                moving from one place.

              </p>

            </div>

            <div className="dashboard-header-actions">

              <motion.button
                type="button"
                className="dashboard-secondary-action"
                onClick={() => navigate("/tasks")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >

                <FaTasks />

                <span>

                  View Tasks

                </span>

              </motion.button>

              <motion.button
                type="button"
                className="dashboard-primary-action"
                onClick={() => navigate("/projects")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >

                <FaPlus />

                <span>

                  New Project

                </span>

              </motion.button>

            </div>

          </div>

        </motion.section>



        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <motion.section
          className="dashboard-toolbar premium-toolbar"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.08,
          }}
        >

          <div className="dashboard-search-wrapper">

            <SearchBar
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search projects, tasks or members..."
            />

          </div>

          <div className="toolbar-status">

            <span className="status-live-dot"></span>

            Workspace Live

          </div>

        </motion.section>



        {/* ===================================================
            STATISTICS
        =================================================== */}

        <motion.section
          className="premium-stats-grid"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.12,
          }}
        >

          {/* Projects */}

          <motion.div
            className="premium-stat-card"
            whileHover={{ y: -5 }}
          >

            <div className="stat-card-top">

              <div className="stat-icon blue">

                <FaProjectDiagram />

              </div>

              <span className="stat-trend">

                <FaArrowUp />

                Active

              </span>

            </div>

            <div className="stat-card-value">

              {stats.projects}

            </div>

            <div className="stat-card-label">

              Total Projects

            </div>

            <div className="stat-card-footer">

              {stats.active} Active Workspace Projects

            </div>

          </motion.div>

          {/* Tasks */}

          <motion.div
            className="premium-stat-card"
            whileHover={{ y: -5 }}
          >

            <div className="stat-card-top">

              <div className="stat-icon orange">

                <FaTasks />

              </div>

              <span className="stat-trend">

                <FaBolt />

                Workload

              </span>

            </div>

            <div className="stat-card-value">

              {stats.tasks}

            </div>

            <div className="stat-card-label">

              Total Tasks

            </div>

            <div className="stat-card-footer">

              {stats.pending} Pending Tasks

            </div>

          </motion.div>

          {/* Completed */}

          <motion.div
            className="premium-stat-card"
            whileHover={{ y: -5 }}
          >

            <div className="stat-card-top">

              <div className="stat-icon green">

                <FaCheckCircle />

              </div>

              <span className="stat-trend positive">

                <FaArrowUp />

                Progress

              </span>

            </div>

            <div className="stat-card-value">

              {stats.completed}

            </div>

            <div className="stat-card-label">

              Completed Tasks

            </div>

            <div className="stat-card-footer">

              {completion}% Workspace Completion

            </div>

          </motion.div>

          {/* Team */}

          <motion.div
            className="premium-stat-card"
            whileHover={{ y: -5 }}
          >

            <div className="stat-card-top">

              <div className="stat-icon purple">

                <FaUsers />

              </div>

              <span className="stat-trend">

                <FaUsers />

                Team

              </span>

            </div>

            <div className="stat-card-value">

              {stats.users}

            </div>

            <div className="stat-card-label">

              Team Members

            </div>

            <div className="stat-card-footer">

              Collaborating Across Workspace

            </div>

          </motion.div>

        </motion.section>



        {/* ===================================================
            PRODUCTIVITY
        =================================================== */}

        <motion.section
          className="productivity-banner"
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <div className="productivity-left">

            <div className="productivity-icon">

              <FaChartLine />

            </div>

            <div>

              <span>

                WORKSPACE PRODUCTIVITY

              </span>

              <h2>

                {completion}% Complete

              </h2>

              <p>

                Keep the momentum going.
                Every completed task moves your
                workspace one step closer to success.

              </p>

            </div>

          </div>

          <div className="productivity-progress-area">

            <div className="productivity-progress-header">

              <span>

                Overall Completion

              </span>

              <strong>

                {completion}%

              </strong>

            </div>

            <div className="productivity-progress">

              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${completion}%`,
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                }}
              />

            </div>

          </div>

        </motion.section>
                {/* ===================================================
            ANALYTICS
        =================================================== */}

        <section className="dashboard-analytics premium-analytics">

          {/* ================================
              WORKSPACE OVERVIEW
          ================================= */}

          <motion.div
            className="analytics-card large-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="card-header premium-card-header">

              <div>

                <span className="card-kicker">

                  PERFORMANCE

                </span>

                <h2>

                  Workspace Overview

                </h2>

              </div>

              <span className="live-badge">

                <span />

                Live

              </span>

            </div>

            <DashboardOverviewChart
              projects={projects}
              tasks={tasks}
            />

          </motion.div>

          {/* ================================
              TASK STATUS
          ================================= */}

          <motion.div
            className="analytics-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="card-header premium-card-header">

              <div>

                <span className="card-kicker">

                  TASKS

                </span>

                <h2>

                  Task Status

                </h2>

              </div>

              <FaTasks className="header-card-icon" />

            </div>

            <TaskStatusChart
              tasks={tasks}
            />

          </motion.div>

          {/* ================================
              PROJECT PROGRESS
          ================================= */}

          <motion.div
            className="analytics-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="card-header premium-card-header">

              <div>

                <span className="card-kicker">

                  PROJECTS

                </span>

                <h2>

                  Project Progress

                </h2>

              </div>

              <FaProjectDiagram className="header-card-icon" />

            </div>

            <ProjectProgressChart
              projects={projects}
            />

          </motion.div>

        </section>
                {/* ===================================================
            RECENT PROJECTS / TASKS
        =================================================== */}

        <section className="dashboard-sections premium-two-column">

          {/* =========================================
              RECENT PROJECTS
          ========================================= */}

          <motion.div
            className="dashboard-card premium-list-card"
            initial={{
              opacity: 0,
              x: -15,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="card-header premium-card-header">

              <div>

                <span className="card-kicker">

                  WORKSPACE

                </span>

                <h2>

                  Recent Projects

                </h2>

              </div>

              <button
                type="button"
                className="view-all-btn"
                onClick={() => navigate("/projects")}
              >

                View All

                <FaArrowRight />

              </button>

            </div>

            {filteredProjects.length === 0 ? (

              <div className="premium-empty-state">

                <EmptyState
                  title={
                    search
                      ? "No Projects Found"
                      : "No Projects Found"
                  }
                />

              </div>

            ) : (

              <div className="premium-list">

                {filteredProjects
                  .slice(0, 5)
                  .map((project) => (

                    <motion.div
                      key={project._id}
                      className="premium-list-item"
                      whileHover={{
                        x: 4,
                      }}
                    >

                      <div className="list-item-icon project">

                        <FaProjectDiagram />

                      </div>

                      <div className="list-item-content">

                        <h3>

                          {project.title ||
                            project.name ||
                            "Untitled Project"}

                        </h3>

                        <p>

                          {project.description
                            ? project.description.substring(0, 70)
                            : "No description available"}

                        </p>

                      </div>

                      <span
                        className={`badge ${(
                          project.status || "Planning"
                        )
                          .toLowerCase()
                          .replace(/\s/g, "")}`}
                      >

                        {project.status || "Planning"}

                      </span>

                    </motion.div>

                  ))}

              </div>

            )}

          </motion.div>



          {/* =========================================
              RECENT TASKS
          ========================================= */}

          <motion.div
            className="dashboard-card premium-list-card"
            initial={{
              opacity: 0,
              x: 15,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="card-header premium-card-header">

              <div>

                <span className="card-kicker">

                  WORKLOAD

                </span>

                <h2>

                  Recent Tasks

                </h2>

              </div>

              <button
                type="button"
                className="view-all-btn"
                onClick={() => navigate("/tasks")}
              >

                View All

                <FaArrowRight />

              </button>

            </div>

            {filteredTasks.length === 0 ? (

              <div className="premium-empty-state">

                <EmptyState
                  title="No Tasks Found"
                />

              </div>

            ) : (

              <div className="premium-list">

                {filteredTasks
                  .slice(0, 5)
                  .map((task) => (

                    <motion.div
                      key={task._id}
                      className="premium-list-item"
                      whileHover={{
                        x: 4,
                      }}
                    >

                      <div className="list-item-icon task">

                        <FaTasks />

                      </div>

                      <div className="list-item-content">

                        <h3>

                          {task.title ||
                            task.name ||
                            "Untitled Task"}

                        </h3>

                        <p>

                          <FaCalendarAlt />

                          {" "}

                          {task.dueDate
                            ? new Date(
                                task.dueDate
                              ).toLocaleDateString()
                            : "No due date"}

                        </p>

                      </div>

                      <span
                        className={`badge ${(
                          task.priority || "medium"
                        ).toLowerCase()}`}
                      >

                        {task.priority || "Medium"}

                      </span>

                    </motion.div>

                  ))}

              </div>

            )}

          </motion.div>

        </section>
                {/* ===================================================
            TEAM + SUMMARY
        =================================================== */}

        <section className="dashboard-bottom premium-two-column">

          {/* ===========================
              TEAM MEMBERS
          ============================ */}

          <motion.div
            className="dashboard-card premium-list-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            <div className="card-header premium-card-header">

              <div>

                <span className="card-kicker">

                  COLLABORATION

                </span>

                <h2>

                  Team Members

                </h2>

              </div>

              <span className="member-count">

                {users.length} Members

              </span>

            </div>

            {users.length === 0 ? (

              <div className="premium-empty-state">

                <EmptyState
                  title="No Team Members Found"
                />

              </div>

            ) : (

              <div className="premium-list">

                {users.slice(0, 5).map((member) => {

                  const memberInitials =
                    member.name
                      ?.trim()
                      ?.split(/\s+/)
                      ?.map((word) => word[0])
                      ?.join("")
                      ?.substring(0, 2)
                      ?.toUpperCase() || "U";

                  return (

                    <motion.div
                      key={member._id}
                      className="premium-list-item member-row"
                      whileHover={{ x: 4 }}
                    >

                      <div className="member-avatar premium-avatar">

                        {member.avatar ? (

                          <img
                            src={member.avatar}
                            alt={member.name}
                          />

                        ) : (

                          memberInitials

                        )}

                      </div>

                      <div className="list-item-content">

                        <h3>

                          {member.name || "Unknown"}

                        </h3>

                        <p>

                          {member.email ||
                            "No email available"}

                        </p>

                      </div>

                      <span className="member-online">

                        <span />

                        {member.status || "Active"}

                      </span>

                    </motion.div>

                  );

                })}

              </div>

            )}

          </motion.div>



          {/* ===========================
              WORKSPACE SUMMARY
          ============================ */}

          <motion.div
            className="dashboard-card summary-premium-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            <div className="card-header premium-card-header">

              <div>

                <span className="card-kicker">

                  AT A GLANCE

                </span>

                <h2>

                  Workspace Summary

                </h2>

              </div>

            </div>

            <div className="summary-grid premium-summary-grid">

              <div className="summary-box">

                <div className="summary-icon blue">

                  <FaProjectDiagram />

                </div>

                <h1>{stats.projects}</h1>

                <span>Projects</span>

              </div>

              <div className="summary-box">

                <div className="summary-icon orange">

                  <FaTasks />

                </div>

                <h1>{stats.tasks}</h1>

                <span>Tasks</span>

              </div>

              <div className="summary-box">

                <div className="summary-icon green">

                  <FaCheckCircle />

                </div>

                <h1>{stats.completed}</h1>

                <span>Completed</span>

              </div>

              <div className="summary-box">

                <div className="summary-icon red">

                  <FaClock />

                </div>

                <h1>{stats.pending}</h1>

                <span>Pending</span>

              </div>

              <div className="summary-box">

                <div className="summary-icon purple">

                  <FaUsers />

                </div>

                <h1>{stats.users}</h1>

                <span>Members</span>

              </div>

              <div className="summary-box">

                <div className="summary-icon dark">

                  <FaChartLine />

                </div>

                <h1>{completion}%</h1>

                <span>Efficiency</span>

              </div>

            </div>

          </motion.div>

        </section>



        {/* ===================================================
            RECENT ACTIVITY
        =================================================== */}

        <motion.section
          className="dashboard-card activity-premium-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >

          <div className="card-header premium-card-header">

            <div>

              <span className="card-kicker">

                WORKSPACE PULSE

              </span>

              <h2>

                Recent Activity

              </h2>

            </div>

            <div className="activity-live">

              <span />

              Live Updates

            </div>

          </div>

          <div className="activity-list premium-activity-list">

            <div className="activity-item">

              <div className="activity-icon blue">

                <FaProjectDiagram />

              </div>

              <div>

                <h4>Projects Created</h4>

                <p>

                  {stats.projects} project(s) currently
                  available in your workspace.

                </p>

              </div>

            </div>

            <div className="activity-item">

              <div className="activity-icon green">

                <FaCheckCircle />

              </div>

              <div>

                <h4>Completed Tasks</h4>

                <p>

                  {stats.completed} task(s)
                  completed successfully.

                </p>

              </div>

            </div>

            <div className="activity-item">

              <div className="activity-icon orange">

                <FaClock />

              </div>

              <div>

                <h4>Pending Tasks</h4>

                <p>

                  {stats.pending} task(s)
                  waiting for completion.

                </p>

              </div>

            </div>

            <div className="activity-item">

              <div className="activity-icon purple">

                <FaUsers />

              </div>

              <div>

                <h4>Workspace Members</h4>

                <p>

                  {stats.users} active member(s)
                  collaborating together.

                </p>

              </div>

            </div>

          </div>

        </motion.section>
                {/* ===================================================
            PREMIUM WORKSPACE CTA
        =================================================== */}

        <motion.section
          className="dashboard-final-cta premium-workspace-cta"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >

          {/* ==========================
              LEFT CONTENT
          ========================== */}

          <div className="workspace-cta-left">

            <div className="workspace-badge">

              <FaBolt />

              <span>

                READY TO MOVE FORWARD?

              </span>

            </div>

            <h2>

              Keep your workspace moving 🚀

            </h2>

            <p>

              Create projects, organize tasks,
              invite teammates and monitor progress
              from one beautiful workspace.

            </p>

            <div className="workspace-feature-list">

              <div className="feature-chip">

                <FaProjectDiagram />

                <span>

                  Create Projects

                </span>

              </div>

              <div className="feature-chip">

                <FaTasks />

                <span>

                  Assign Tasks

                </span>

              </div>

              <div className="feature-chip">

                <FaUsers />

                <span>

                  Invite Team

                </span>

              </div>

            </div>

          </div>



          {/* ==========================
              RIGHT SIDE
          ========================== */}

          <div className="workspace-cta-right">

            <motion.button
              className="workspace-create-btn"
              type="button"
              onClick={() => navigate("/projects")}
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >

              <FaPlus />

              <span>

                New Project

              </span>

            </motion.button>

            <div className="workspace-progress-card">

              <div className="workspace-progress-header">

                <span>

                  Workspace Health

                </span>

                <strong>

                  {completion}%

                </strong>

              </div>

              <div className="workspace-progress">

                <motion.div
                  className="workspace-progress-fill"
                  initial={{
                    width: 0,
                  }}
                  whileInView={{
                    width: `${completion}%`,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                />

              </div>

              <small>

                {completion >= 90
                  ? "Excellent! Your workspace is performing exceptionally well."
                  : completion >= 70
                  ? "Great progress. Keep completing tasks to reach your goals."
                  : completion >= 40
                  ? "You're making steady progress. Stay consistent."
                  : "Create projects and complete tasks to improve workspace health."}

              </small>

            </div>

          </div>

        </motion.section>

      </div>

    </MainLayout>

  );

};

export default Dashboard;