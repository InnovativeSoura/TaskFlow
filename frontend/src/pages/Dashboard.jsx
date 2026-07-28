// src/pages/Dashboard.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

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

import {
  useNavigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import PageHeader from "../components/PageHeader";
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

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [stats, setStats] =
    useState({
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

      const data =
        await getDashboardStats();

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

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );

      setProjects(
        Array.isArray(projectsData)
          ? projectsData
          : []
      );

      setTasks(
        Array.isArray(tasksData)
          ? tasksData
          : []
      );


      /* =====================================================
         CALCULATE STATISTICS
      ===================================================== */

      const completed =
        tasksData.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length;


      const pending =
        tasksData.filter(
          (task) =>
            task.status ===
              "Pending" ||
            task.status ===
              "To Do"
        ).length;


      const active =
        projectsData.filter(
          (project) =>
            project.status ===
            "Active"
        ).length;


      setStats({
        users:
          usersData.length,

        projects:
          projectsData.length,

        tasks:
          tasksData.length,

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
     SEARCH PROJECTS
  ========================================================= */

  const filteredProjects =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return projects;
      }

      return projects.filter(
        (project) => {

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
              .includes(query) ||

            description
              .toLowerCase()
              .includes(query)
          );
        }
      );

    }, [
      projects,
      search,
    ]);


  /* =========================================================
     SEARCH TASKS
  ========================================================= */

  const filteredTasks =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return tasks;
      }

      return tasks.filter(
        (task) => {

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
              .includes(query) ||

            description
              .toLowerCase()
              .includes(query)
          );
        }
      );

    }, [
      tasks,
      search,
    ]);


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
     GREETING
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


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <MainLayout>

      {/* =====================================================
          PREMIUM DASHBOARD HEADER
      ===================================================== */}

      <motion.section
        className="dashboard-hero"
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <div className="dashboard-hero-content">

          <div>

            <div className="dashboard-eyebrow">

              <span className="eyebrow-dot">
                <FaCircle />
              </span>

              WORKSPACE OVERVIEW

            </div>


            <h1>
              Welcome back,{" "}
              <span>
                {firstName}
              </span>{" "}
              👋
            </h1>


            <p>
              Here's what's happening
              across your workspace today.
            </p>

          </div>


          {/* HEADER ACTIONS */}

          <div className="dashboard-header-actions">

            <motion.button
              type="button"
              className="dashboard-secondary-action"
              onClick={() =>
                navigate("/tasks")
              }
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <FaTasks />

              <span>
                View Tasks
              </span>
            </motion.button>


            <motion.button
              type="button"
              className="dashboard-primary-action"
              onClick={() =>
                navigate("/projects")
              }
              whileHover={{
                y: -2,
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

          </div>

        </div>

      </motion.section>


      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      <motion.section
        className="dashboard-toolbar premium-toolbar"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
      >

        <div className="dashboard-search-wrapper">

          <SearchBar
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search projects or tasks..."
          />

        </div>


        <div className="toolbar-status">

          <span className="status-live-dot" />

          <span>
            Workspace Live
          </span>

        </div>

      </motion.section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <motion.section
        className="premium-stats-grid"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.15,
        }}
      >

        {/* PROJECTS */}

        <motion.div
          className="premium-stat-card"
          whileHover={{
            y: -5,
          }}
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
            {stats.active} active workspace projects
          </div>

        </motion.div>


        {/* TASKS */}

        <motion.div
          className="premium-stat-card"
          whileHover={{
            y: -5,
          }}
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
            {stats.pending} tasks need attention
          </div>

        </motion.div>


        {/* COMPLETED */}

        <motion.div
          className="premium-stat-card"
          whileHover={{
            y: -5,
          }}
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
            {completion}% workspace completion
          </div>

        </motion.div>


        {/* MEMBERS */}

        <motion.div
          className="premium-stat-card"
          whileHover={{
            y: -5,
          }}
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
            Collaborators in workspace
          </div>

        </motion.div>

      </motion.section>


      {/* =====================================================
          PRODUCTIVITY OVERVIEW
      ===================================================== */}

      <motion.section
        className="productivity-banner"
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

        <div className="productivity-left">

          <div className="productivity-icon">
            <FaChartLine />
          </div>


          <div>

            <span>
              WORKSPACE PRODUCTIVITY
            </span>

            <h2>
              {completion}% complete
            </h2>

            <p>
              Keep the momentum going.
              Your workspace is making progress.
            </p>

          </div>

        </div>


        <div className="productivity-progress-area">

          <div className="productivity-progress-header">

            <span>
              Overall completion
            </span>

            <strong>
              {completion}%
            </strong>

          </div>


          <div className="productivity-progress">

            <motion.div
              initial={{
                width: 0,
              }}
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


      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <section className="dashboard-analytics premium-analytics">

        {/* OVERVIEW */}

        <motion.div
          className="analytics-card large-card"
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


        {/* TASK STATUS */}

        <motion.div
          className="analytics-card"
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


        {/* PROJECT PROGRESS */}

        <motion.div
          className="analytics-card"
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


      {/* =====================================================
          RECENT PROJECTS + RECENT TASKS
      ===================================================== */}

      <section className="dashboard-sections premium-two-column">

        {/* =================================================
            RECENT PROJECTS
        ================================================= */}

        <motion.div
          className="dashboard-card premium-list-card"
          initial={{
            opacity: 0,
            x: -20,
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
              onClick={() =>
                navigate("/projects")
              }
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
                          ? project.description.substring(
                              0,
                              70
                            )
                          : "No description available"}
                      </p>

                    </div>


                    <span
                      className={`badge ${(
                        project.status ||
                        "Planning"
                      )
                        .toLowerCase()
                        .replace(
                          /\s/g,
                          ""
                        )}`}
                    >
                      {project.status ||
                        "Planning"}
                    </span>

                  </motion.div>

                ))}

            </div>

          )}

        </motion.div>


        {/* =================================================
            RECENT TASKS
        ================================================= */}

        <motion.div
          className="dashboard-card premium-list-card"
          initial={{
            opacity: 0,
            x: 20,
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
              onClick={() =>
                navigate("/tasks")
              }
            >
              View All
              <FaArrowRight />
            </button>

          </div>


          {filteredTasks.length === 0 ? (

            <div className="premium-empty-state">
              <EmptyState
                title={
                  search
                    ? "No Tasks Found"
                    : "No Tasks Found"
                }
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

                        {task.dueDate
                          ? new Date(
                              task.dueDate
                            ).toLocaleDateString()
                          : "No due date"}

                      </p>

                    </div>


                    <span
                      className={`badge ${(
                        task.priority ||
                        "medium"
                      ).toLowerCase()}`}
                    >
                      {task.priority ||
                        "Medium"}
                    </span>

                  </motion.div>

                ))}

            </div>

          )}

        </motion.div>

      </section>


      {/* =====================================================
          TEAM + SUMMARY
      ===================================================== */}

      <section className="dashboard-bottom premium-two-column">

        {/* =================================================
            TEAM MEMBERS
        ================================================= */}

        <motion.div
          className="dashboard-card premium-list-card"
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

              {users
                .slice(0, 5)
                .map((member) => {

                  const memberInitials =
                    member.name
                      ?.trim()
                      ?.split(/\s+/)
                      ?.map(
                        (name) =>
                          name?.[0] ||
                          ""
                      )
                      ?.join("")
                      ?.substring(
                        0,
                        2
                      )
                      ?.toUpperCase() ||
                    "U";


                  return (
                    <motion.div
                      key={member._id}
                      className="premium-list-item member-row"
                      whileHover={{
                        x: 4,
                      }}
                    >

                      <div className="member-avatar premium-avatar">

                        {member.avatar ? (

                          <img
                            src={
                              member.avatar
                            }
                            alt={
                              member.name ||
                              "Member"
                            }
                          />

                        ) : (

                          memberInitials

                        )}

                      </div>


                      <div className="list-item-content">

                        <h3>
                          {member.name ||
                            "Unknown Member"}
                        </h3>

                        <p>
                          {member.email ||
                            "No email available"}
                        </p>

                      </div>


                      <span className="member-online">
                        <span />
                        {member.status ||
                          "Active"}
                      </span>

                    </motion.div>
                  );
                })}

            </div>

          )}

        </motion.div>


        {/* =================================================
            WORKSPACE SUMMARY
        ================================================= */}

        <motion.div
          className="dashboard-card summary-premium-card"
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

              <h1>
                {stats.projects}
              </h1>

              <span>
                Projects
              </span>

            </div>


            <div className="summary-box">

              <div className="summary-icon orange">
                <FaTasks />
              </div>

              <h1>
                {stats.tasks}
              </h1>

              <span>
                Tasks
              </span>

            </div>


            <div className="summary-box">

              <div className="summary-icon green">
                <FaCheckCircle />
              </div>

              <h1>
                {stats.completed}
              </h1>

              <span>
                Completed
              </span>

            </div>


            <div className="summary-box">

              <div className="summary-icon red">
                <FaClock />
              </div>

              <h1>
                {stats.pending}
              </h1>

              <span>
                Pending
              </span>

            </div>


            <div className="summary-box">

              <div className="summary-icon purple">
                <FaUsers />
              </div>

              <h1>
                {stats.users}
              </h1>

              <span>
                Members
              </span>

            </div>


            <div className="summary-box">

              <div className="summary-icon dark">
                <FaChartLine />
              </div>

              <h1>
                {completion}%
              </h1>

              <span>
                Efficiency
              </span>

            </div>

          </div>

        </motion.div>

      </section>


      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <motion.section
        className="dashboard-card activity-premium-card"
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
            Live updates
          </div>

        </div>


        <div className="activity-list premium-activity-list">

          {/* PROJECTS */}

          <div className="activity-item">

            <div className="activity-icon blue">
              <FaProjectDiagram />
            </div>

            <div>

              <h4>
                Projects Created
              </h4>

              <p>
                {stats.projects} project(s)
                currently available in your
                workspace.
              </p>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="activity-item">

            <div className="activity-icon green">
              <FaCheckCircle />
            </div>

            <div>

              <h4>
                Completed Tasks
              </h4>

              <p>
                {stats.completed} task(s)
                have been completed
                successfully.
              </p>

            </div>

          </div>


          {/* PENDING */}

          <div className="activity-item">

            <div className="activity-icon orange">
              <FaClock />
            </div>

            <div>

              <h4>
                Pending Tasks
              </h4>

              <p>
                {stats.pending} task(s)
                are waiting for completion.
              </p>

            </div>

          </div>


          {/* TEAM */}

          <div className="activity-item">

            <div className="activity-icon purple">
              <FaUsers />
            </div>

            <div>

              <h4>
                Workspace Members
              </h4>

              <p>
                {stats.users} member(s)
                are collaborating in your
                workspace.
              </p>

            </div>

          </div>

        </div>

      </motion.section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <motion.section
        className="dashboard-final-cta"
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
      >

        <div>

          <span>
            READY TO MOVE FORWARD?
          </span>

          <h2>
            Keep your workspace moving.
          </h2>

          <p>
            Create a project, assign tasks,
            and keep your team aligned.
          </p>

        </div>


        <motion.button
          type="button"
          onClick={() =>
            navigate("/projects")
          }
          whileHover={{
            x: 4,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >

          <span>
            Open Projects
          </span>

          <FaChevronRight />

        </motion.button>

      </motion.section>

    </MainLayout>
  );
};


export default Dashboard;