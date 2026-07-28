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
  FaPlus,
  FaTasks,
  FaProjectDiagram,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";

import DashboardOverviewChart from "../components/dashboard/DashboardOverviewChart";
import ProjectProgressChart from "../components/projects/ProjectProgressChart";
import TaskStatusChart from "../components/tasks/TaskStatusChart";

import { useAuth } from "../context/AuthContext";
import {
  getDashboardStats,
} from "../services/dashboardService";

import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(true);

  /* =========================================================
     DASHBOARD SEARCH

     This is now the ONLY global search input.
     It appears below the welcome message.
  ========================================================= */

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

      setUsers(usersData);
      setProjects(projectsData);
      setTasks(tasksData);

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
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
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
    }, [projects, search]);

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
    }, [tasks, search]);

  /* =========================================================
     PRODUCTIVITY
  ========================================================= */

  const completion =
    stats.tasks
      ? Math.round(
          (stats.completed /
            stats.tasks) *
            100
        )
      : 0;

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
          PAGE HEADER
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <PageHeader
          title={`Welcome back, ${
            user?.name ||
            "User"
          } 👋`}
          subtitle="Here's what's happening across your workspace today."
        />

      </motion.div>

      {/* =====================================================
          SEARCH + QUICK ACTIONS

          Search is now located directly under
          the welcome heading.

          Layout:

          [ 🔍 Search projects or tasks... ]
                         [ + New Project ]
                         [ + New Task ]
      ===================================================== */}

      <motion.div
        className="dashboard-toolbar"
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

        {/* DASHBOARD SEARCH */}

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

        {/* QUICK ACTIONS */}

        <div className="quick-actions">

          {/* NEW PROJECT */}

          <motion.button
            type="button"
            className="primary-btn"
            onClick={() =>
              navigate(
                "/projects"
              )
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

          {/* NEW TASK */}

          <motion.button
            type="button"
            className="secondary-btn"
            onClick={() =>
              navigate(
                "/tasks"
              )
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
              New Task
            </span>
          </motion.button>

        </div>

      </motion.div>

      {/* =====================================================
          STATS GRID
      ===================================================== */}

      <motion.div
        className="stats-grid"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.3,
        }}
      >

        <StatCard
          title="Projects"
          value={stats.projects}
          color="blue"
          icon={
            <FaProjectDiagram />
          }
        />

        <StatCard
          title="Tasks"
          value={stats.tasks}
          color="orange"
          icon={
            <FaTasks />
          }
        />

        <StatCard
          title="Completed"
          value={
            stats.completed
          }
          color="green"
          icon={
            <FaCheckCircle />
          }
        />

        <StatCard
          title="Pending"
          value={
            stats.pending
          }
          color="red"
          icon={
            <FaClock />
          }
        />

        <StatCard
          title="Members"
          value={
            stats.users
          }
          color="purple"
          icon={
            <FaUsers />
          }
        />

        <StatCard
          title="Productivity"
          value={`${completion}%`}
          color="dark"
          icon={
            <FaChartLine />
          }
        />

      </motion.div>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <motion.div
        className="dashboard-analytics"
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
        transition={{
          duration: 0.5,
        }}
      >

        {/* WORKSPACE OVERVIEW */}

        <div className="analytics-card large-card">

          <div className="card-header">

            <h2>
              Workspace Overview
            </h2>

            <span className="live-badge">
              Live
            </span>

          </div>

          <DashboardOverviewChart
            projects={
              projects
            }
            tasks={tasks}
          />

        </div>

        {/* TASK STATUS */}

        <div className="analytics-card">

          <div className="card-header">

            <h2>
              Task Status
            </h2>

          </div>

          <TaskStatusChart
            tasks={tasks}
          />

        </div>

        {/* PROJECT PROGRESS */}

        <div className="analytics-card">

          <div className="card-header">

            <h2>
              Project Progress
            </h2>

          </div>

          <ProjectProgressChart
            projects={
              projects
            }
          />

        </div>

      </motion.div>

      {/* =====================================================
          RECENT PROJECTS + RECENT TASKS
      ===================================================== */}

      <div className="dashboard-sections">

        {/* =================================================
            RECENT PROJECTS
        ================================================= */}

        <motion.div
          className="dashboard-card"
          initial={{
            opacity: 0,
            x: -25,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <div className="card-header">

            <h2>
              Recent Projects
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/projects"
                )
              }
            >
              View All
            </button>

          </div>

          {filteredProjects.length ===
          0 ? (

            <EmptyState
              title={
                search
                  ? "No Projects Found"
                  : "No Projects Found"
              }
            />

          ) : (

            filteredProjects
              .slice(0, 6)
              .map(
                (project) => (

                  <motion.div
                    whileHover={{
                      scale: 1.02,
                    }}
                    key={
                      project._id
                    }
                    className="list-item"
                  >

                    <div>

                      <h3>
                        {project.title ||
                          project.name}
                      </h3>

                      <p>
                        {project.description
                          ? project.description.substring(
                              0,
                              90
                            )
                          : "No description"}
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

                )
              )

          )}

        </motion.div>

        {/* =================================================
            RECENT TASKS
        ================================================= */}

        <motion.div
          className="dashboard-card"
          initial={{
            opacity: 0,
            x: 25,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <div className="card-header">

            <h2>
              Recent Tasks
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/tasks"
                )
              }
            >
              View All
            </button>

          </div>

          {filteredTasks.length ===
          0 ? (

            <EmptyState
              title={
                search
                  ? "No Tasks Found"
                  : "No Tasks Found"
              }
            />

          ) : (

            filteredTasks
              .slice(0, 6)
              .map(
                (task) => (

                  <motion.div
                    key={
                      task._id
                    }
                    whileHover={{
                      scale: 1.02,
                    }}
                    className="deadline-item"
                  >

                    <div>

                      <h3>
                        {task.title ||
                          task.name}
                      </h3>

                      <p>

                        Due :

                        {" "}

                        {task.dueDate
                          ? new Date(
                              task.dueDate
                            ).toLocaleDateString()
                          : "No Due Date"}

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

                )
              )

          )}

        </motion.div>

      </div>

      {/* =====================================================
          PROGRESS CARD
      ===================================================== */}

      <motion.div
        className="dashboard-card"
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

        <div className="card-header">

          <h2>
            Workspace Completion
          </h2>

          <FaArrowUp />

        </div>

        <div className="progress-wrapper">

          <div className="progress-bar">

            <motion.div
              className="progress-fill"
              initial={{
                width: 0,
              }}
              animate={{
                width: `${completion}%`,
              }}
              transition={{
                duration: 1.4,
              }}
            />

          </div>

          <h2>
            {completion}%
            {" "}
            Completed
          </h2>

        </div>

      </motion.div>

      {/* =====================================================
          TEAM OVERVIEW
      ===================================================== */}

      <div className="dashboard-bottom">

        {/* TEAM MEMBERS */}

        <motion.div
          className="dashboard-card"
          initial={{
            opacity: 0,
            x: -25,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <div className="card-header">

            <h2>
              Team Members
            </h2>

            <span>
              {users.length}
              {" "}
              Members
            </span>

          </div>

          {users.length ===
          0 ? (

            <EmptyState
              title="No Team Members Found"
            />

          ) : (

            users
              .slice(0, 6)
              .map(
                (member) => (

                  <motion.div
                    key={
                      member._id
                    }
                    whileHover={{
                      scale: 1.02,
                    }}
                    className="member-item"
                  >

                    <div className="member-left">

                      <div className="member-avatar">

                        {member.name
                          ?.substring(
                            0,
                            2
                          )
                          .toUpperCase()}

                      </div>

                      <div>

                        <h3>
                          {member.name}
                        </h3>

                        <p>
                          {member.email}
                        </p>

                      </div>

                    </div>

                    <span className="badge completed">
                      {member.status ||
                        "Active"}
                    </span>

                  </motion.div>

                )
              )

          )}

        </motion.div>

        {/* =================================================
            QUICK SUMMARY
        ================================================= */}

        <motion.div
          className="dashboard-card"
          initial={{
            opacity: 0,
            x: 25,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <div className="card-header">

            <h2>
              Workspace Summary
            </h2>

          </div>

          <div className="summary-grid">

            <div className="summary-box">

              <h1>
                {stats.projects}
              </h1>

              <span>
                Projects
              </span>

            </div>

            <div className="summary-box">

              <h1>
                {stats.tasks}
              </h1>

              <span>
                Tasks
              </span>

            </div>

            <div className="summary-box">

              <h1>
                {stats.completed}
              </h1>

              <span>
                Completed
              </span>

            </div>

            <div className="summary-box">

              <h1>
                {stats.pending}
              </h1>

              <span>
                Pending
              </span>

            </div>

            <div className="summary-box">

              <h1>
                {stats.users}
              </h1>

              <span>
                Members
              </span>

            </div>

            <div className="summary-box">

              <h1>
                {completion}%
              </h1>

              <span>
                Efficiency
              </span>

            </div>

          </div>

        </motion.div>

      </div>

      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <motion.div
        className="dashboard-card"
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
      >

        <div className="card-header">

          <h2>
            Recent Activity
          </h2>

        </div>

        <div className="activity-list">

          {/* PROJECT ACTIVITY */}

          <div className="activity-item">

            <div className="activity-dot blue" />

            <div>

              <h4>
                Projects Created
              </h4>

              <p>
                {stats.projects}
                {" "}
                active project(s)
                {" "}
                available.
              </p>

            </div>

          </div>

          {/* COMPLETED TASKS */}

          <div className="activity-item">

            <div className="activity-dot green" />

            <div>

              <h4>
                Completed Tasks
              </h4>

              <p>
                {stats.completed}
                {" "}
                task(s) have been
                completed successfully.
              </p>

            </div>

          </div>

          {/* PENDING TASKS */}

          <div className="activity-item">

            <div className="activity-dot orange" />

            <div>

              <h4>
                Pending Tasks
              </h4>

              <p>
                {stats.pending}
                {" "}
                task(s) are waiting
                for completion.
              </p>

            </div>

          </div>

          {/* TEAM MEMBERS */}

          <div className="activity-item">

            <div className="activity-dot purple" />

            <div>

              <h4>
                Workspace Members
              </h4>

              <p>
                {stats.users}
                {" "}
                member(s) are working
                together.
              </p>

            </div>

          </div>

        </div>

      </motion.div>

    </MainLayout>
  );
};

export default Dashboard;