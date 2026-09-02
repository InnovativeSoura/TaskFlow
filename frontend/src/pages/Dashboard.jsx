import { useEffect, useMemo, useState } from "react";

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

  /* Premium CTA Icons */
  FaRocket,
  FaLayerGroup,
  FaShieldAlt,
} from "react-icons/fa";

import { FaArrowTrendUp } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import DashboardOverviewChart from "../components/dashboard/DashboardOverviewChart";
import ProjectProgressChart from "../components/projects/ProjectProgressChart";
import TaskStatusChart from "../components/tasks/TaskStatus";

import { useAuth } from "../context/AuthContext";

import { getDashboardStats } from "../services/dashboardService";

import "../styles/Dashboard.css";

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

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboardStats();

      const usersData = data?.users?.users || data?.users || [];

      const projectsData = data?.projects?.projects || data?.projects || [];

      const tasksData = data?.tasks?.tasks || data?.tasks || [];

      const safeUsers = Array.isArray(usersData) ? usersData : [];

      const safeProjects = Array.isArray(projectsData) ? projectsData : [];

      const safeTasks = Array.isArray(tasksData) ? tasksData : [];

      setUsers(safeUsers);

      setProjects(safeProjects);

      setTasks(safeTasks);

      const completed = safeTasks.filter(
        (task) => task.status === "Completed",
      ).length;

      const pending = safeTasks.filter(
        (task) => task.status === "Pending" || task.status === "To Do",
      ).length;

      const active = safeProjects.filter(
        (project) => project.status === "Active",
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
      console.error("Dashboard loading error:", error);

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

  const searchQuery = search.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    if (!searchQuery) {
      return projects;
    }

    return projects.filter((project) => {
      const title = project.title || project.name || "";

      const description = project.description || "";

      return (
        title.toLowerCase().includes(searchQuery) ||
        description.toLowerCase().includes(searchQuery)
      );
    });
  }, [projects, searchQuery]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery) {
      return tasks;
    }

    return tasks.filter((task) => {
      const title = task.title || task.name || "";

      const description = task.description || "";

      return (
        title.toLowerCase().includes(searchQuery) ||
        description.toLowerCase().includes(searchQuery)
      );
    });
  }, [tasks, searchQuery]);

  const completion =
    stats.tasks > 0 ? Math.round((stats.completed / stats.tasks) * 100) : 0;

  const firstName = user?.name?.trim()?.split(/\s+/)?.[0] || "there";

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="dashboard-page">
        <motion.section
          className="dashboard-hero premium-hero"
          initial={{
            opacity: 0,
            y: -25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="hero-left">
            <div className="hero-badge">
              <FaBolt />

              <span>WORKSPACE OVERVIEW</span>
            </div>

            <h1>
              Welcome back,
              <span> {firstName}</span>
              👋
            </h1>

            <p>
              Track projects, monitor team performance and manage your workflow
              from one premium dashboard.
            </p>
          </div>

          <div className="hero-right">
            <motion.button
              className="hero-secondary-btn"
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => navigate("/tasks")}
            >
              <FaTasks />

              <span>View Tasks</span>
            </motion.button>

            <motion.button
              className="hero-primary-btn"
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => navigate("/projects")}
            >
              <FaPlus />

              <span>New Project</span>
            </motion.button>
          </div>
        </motion.section>

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
            delay: 0.15,
          }}
        >
          <div className="toolbar-search">
            <SearchBar
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, tasks or members..."
            />
          </div>

          <div className="toolbar-right">
            <div className="workspace-status">
              <span className="status-dot" />
              Workspace Live
            </div>
          </div>
        </motion.section>

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
            delay: 0.2,
          }}
        >
          <motion.div
            className="premium-stat-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="stat-header">
              <div className="stat-icon blue">
                <FaProjectDiagram />
              </div>

              <div className="stat-trend positive">
                <FaArrowTrendUp />

                <span>12%</span>
              </div>
            </div>

            <div className="stat-body">
              <span className="stat-title">Total Projects</span>

              <h2>{stats.projects}</h2>
            </div>

            <div className="stat-footer">
              <span>{stats.active} Active Projects</span>

              <div className="mini-chart blue-chart">
                <span />

                <span />

                <span />

                <span />

                <span />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="premium-stat-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="stat-header">
              <div className="stat-icon cyan">
                <FaTasks />
              </div>

              <div className="stat-trend positive">
                <FaArrowTrendUp />

                <span>8%</span>
              </div>
            </div>

            <div className="stat-body">
              <span className="stat-title">Total Tasks</span>

              <h2>{stats.tasks}</h2>
            </div>

            <div className="stat-footer">
              <span>{stats.pending} Pending</span>

              <div className="mini-chart cyan-chart">
                <span />

                <span />

                <span />

                <span />

                <span />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="premium-stat-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="stat-header">
              <div className="stat-icon green">
                <FaCheckCircle />
              </div>

              <div className="stat-trend positive">
                <FaArrowTrendUp />

                <span>16%</span>
              </div>
            </div>

            <div className="stat-body">
              <span className="stat-title">Completed Tasks</span>

              <h2>{stats.completed}</h2>
            </div>

            <div className="stat-footer">
              <span>{completion}% Completed</span>

              <div className="mini-chart green-chart">
                <span />

                <span />

                <span />

                <span />

                <span />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="premium-stat-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="stat-header">
              <div className="stat-icon orange">
                <FaClock />
              </div>

              <div className="stat-trend negative">
                <FaArrowUp
                  style={{
                    transform: "rotate(180deg)",
                  }}
                />

                <span>4%</span>
              </div>
            </div>

            <div className="stat-body">
              <span className="stat-title">Pending Tasks</span>

              <h2>{stats.pending}</h2>
            </div>

            <div className="stat-footer">
              <span>Need Attention</span>

              <div className="mini-chart orange-chart">
                <span />

                <span />

                <span />

                <span />

                <span />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="premium-stat-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="stat-header">
              <div className="stat-icon purple">
                <FaUsers />
              </div>

              <div className="stat-trend positive">
                <FaArrowTrendUp />

                <span>2%</span>
              </div>
            </div>

            <div className="stat-body">
              <span className="stat-title">Team Members</span>

              <h2>{stats.users}</h2>
            </div>

            <div className="stat-footer">
              <span>Active Members</span>

              <div className="mini-chart purple-chart">
                <span />

                <span />

                <span />

                <span />

                <span />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="premium-stat-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="stat-header">
              <div className="stat-icon sky">
                <FaChartLine />
              </div>

              <div className="stat-trend positive">
                <FaArrowTrendUp />

                <span>10%</span>
              </div>
            </div>

            <div className="stat-body">
              <span className="stat-title">Workspace Efficiency</span>

              <h2>{completion}%</h2>
            </div>

            <div className="stat-footer">
              <span>Overall Performance</span>

              <div className="mini-chart sky-chart">
                <span />

                <span />

                <span />

                <span />

                <span />
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="premium-productivity-banner"
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
            duration: 0.6,
          }}
        >
          <div className="productivity-content">
            <div className="productivity-badge">
              <FaRocket />

              <span>PERFORMANCE REPORT</span>
            </div>

            <h2>
              Great Progress
              <span> This Week 🚀</span>
            </h2>

            <p>
              Your workspace is performing better than last week. Keep assigning
              tasks, completing milestones, and collaborating with your team.
            </p>

            <div className="productivity-tags">
              <div className="productivity-tag">
                <FaCheckCircle />

                <span>{stats.completed} Completed</span>
              </div>

              <div className="productivity-tag">
                <FaTasks />

                <span>{stats.pending} Pending</span>
              </div>

              <div className="productivity-tag">
                <FaUsers />

                <span>{stats.users} Members</span>
              </div>
            </div>
          </div>

          <motion.div
            className="productivity-score-card"
            whileHover={{
              y: -6,
            }}
          >
            <div className="score-card-header">
              <div>
                <span>Workspace Score</span>

                <h2>{completion}%</h2>
              </div>

              <div className="score-icon">
                <FaChartLine />
              </div>
            </div>

            <div className="score-progress">
              <motion.div
                className="score-progress-fill"
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: `${completion}%`,
                }}
                transition={{
                  duration: 1.4,
                  ease: "easeOut",
                }}
              />
            </div>

            <div className="score-labels">
              <span>Overall Completion</span>

              <strong>{completion}%</strong>
            </div>

            <div className="score-stats">
              <div className="score-stat">
                <strong>{stats.projects}</strong>

                <span>Projects</span>
              </div>

              <div className="score-stat">
                <strong>{stats.tasks}</strong>

                <span>Tasks</span>
              </div>

              <div className="score-stat">
                <strong>{stats.users}</strong>

                <span>Members</span>
              </div>
            </div>

            <div className="score-footer">
              <FaArrowTrendUp />

              <span>Productivity increased this week</span>
            </div>
          </motion.div>
        </motion.section>

        <section className="dashboard-analytics premium-analytics">
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
                <span className="card-kicker">ANALYTICS</span>

                <h2>Workspace Overview</h2>
              </div>

              <div className="header-icon">
                <FaChartLine />
              </div>
            </div>

            <DashboardOverviewChart projects={projects} tasks={tasks} />
          </motion.div>

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
                <span className="card-kicker">TASKS</span>

                <h2>Task Distribution</h2>
              </div>

              <div className="header-icon">
                <FaTasks />
              </div>
            </div>

            <TaskStatusChart tasks={tasks} />
          </motion.div>

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
                <span className="card-kicker">PROJECTS</span>

                <h2>Project Progress</h2>
              </div>

              <div className="header-icon">
                <FaProjectDiagram />
              </div>
            </div>

            <ProjectProgressChart projects={projects} />
          </motion.div>
        </section>

        <section className="dashboard-sections premium-two-column">
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
                <span className="card-kicker">RECENT PROJECTS</span>

                <h2>Active Workspace</h2>
              </div>

              <motion.button
                className="view-all-btn"
                whileHover={{
                  x: 4,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => navigate("/projects")}
              >
                View All
                <FaArrowRight />
              </motion.button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="premium-empty-state">
                <EmptyState title="No Projects Found" />
              </div>
            ) : (
              <div className="premium-list">
                {filteredProjects.slice(0, 5).map((project) => (
                  <motion.div
                    key={project._id}
                    className="premium-list-item"
                    whileHover={{
                      y: -3,
                      x: 3,
                    }}
                  >
                    <div className="list-item-icon project">
                      <FaProjectDiagram />
                    </div>

                    <div className="list-item-content">
                      <h3>
                        {project.title || project.name || "Untitled Project"}
                      </h3>

                      <p>
                        {project.description
                          ? project.description.substring(0, 75)
                          : "No description available"}
                      </p>
                    </div>

                    <div className="list-item-right">
                      <span
                        className={`badge ${(project.status || "Planning")
                          .toLowerCase()
                          .replace(/\s/g, "")}`}
                      >
                        {project.status || "Planning"}
                      </span>

                      <FaChevronRight />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

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
                <span className="card-kicker">RECENT TASKS</span>

                <h2>Today's Work</h2>
              </div>

              <motion.button
                className="view-all-btn"
                whileHover={{
                  x: 4,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => navigate("/tasks")}
              >
                View All
                <FaArrowRight />
              </motion.button>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="premium-empty-state">
                <EmptyState title="No Tasks Found" />
              </div>
            ) : (
              <div className="premium-list">
                {filteredTasks.slice(0, 5).map((task) => (
                  <motion.div
                    key={task._id}
                    className="premium-list-item"
                    whileHover={{
                      y: -3,
                      x: 3,
                    }}
                  >
                    <div className="list-item-icon task">
                      <FaTasks />
                    </div>

                    <div className="list-item-content">
                      <h3>{task.title || task.name || "Untitled Task"}</h3>

                      <p>
                        <FaCalendarAlt />{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No Due Date"}
                      </p>
                    </div>

                    <div className="list-item-right">
                      <span
                        className={`badge ${(
                          task.priority || "medium"
                        ).toLowerCase()}`}
                      >
                        {task.priority || "Medium"}
                      </span>

                      <FaChevronRight />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </section>

        <section className="dashboard-bottom premium-two-column">
          <motion.div
            className="dashboard-card premium-list-card"
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
                <span className="card-kicker">TEAM</span>

                <h2>Team Members</h2>
              </div>

              <span className="member-count">{users.length} Members</span>
            </div>

            {users.length === 0 ? (
              <div className="premium-empty-state">
                <EmptyState title="No Team Members Found" />
              </div>
            ) : (
              <div className="premium-list">
                {users.slice(0, 5).map((member) => {
                  const initials =
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
                      whileHover={{
                        y: -3,
                        x: 3,
                      }}
                    >
                      <div className="member-avatar premium-avatar">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="list-item-content">
                        <h3>{member.name || "Unknown User"}</h3>

                        <p>{member.email}</p>
                      </div>

                      <span className="member-online">
                        <span />

                        {member.status || "Online"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            className="dashboard-card summary-premium-card"
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
                <span className="card-kicker">SUMMARY</span>

                <h2>Workspace Summary</h2>
              </div>
            </div>

            <div className="summary-grid premium-summary-grid">
              <div className="summary-box">
                <div className="summary-icon blue">
                  <FaProjectDiagram />
                </div>

                <h2>{stats.projects}</h2>

                <span>Projects</span>
              </div>

              <div className="summary-box">
                <div className="summary-icon orange">
                  <FaTasks />
                </div>

                <h2>{stats.tasks}</h2>

                <span>Tasks</span>
              </div>

              <div className="summary-box">
                <div className="summary-icon green">
                  <FaCheckCircle />
                </div>

                <h2>{stats.completed}</h2>

                <span>Completed</span>
              </div>

              <div className="summary-box">
                <div className="summary-icon red">
                  <FaClock />
                </div>

                <h2>{stats.pending}</h2>

                <span>Pending</span>
              </div>

              <div className="summary-box">
                <div className="summary-icon purple">
                  <FaUsers />
                </div>

                <h2>{stats.users}</h2>

                <span>Members</span>
              </div>

              <div className="summary-box">
                <div className="summary-icon cyan">
                  <FaChartLine />
                </div>

                <h2>{completion}%</h2>

                <span>Efficiency</span>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section
          className="dashboard-card activity-premium-card"
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
              <span className="card-kicker">LIVE ACTIVITY</span>

              <h2>Workspace Timeline</h2>
            </div>

            <div className="activity-live">
              <span />
              Live
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon blue">
                <FaProjectDiagram />
              </div>

              <div>
                <h4>Projects Created</h4>

                <p>
                  {stats.projects} active projects are available in your
                  workspace.
                </p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <h4>Completed Tasks</h4>

                <p>{stats.completed} tasks have been successfully completed.</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon orange">
                <FaClock />
              </div>

              <div>
                <h4>Pending Tasks</h4>

                <p>{stats.pending} tasks are waiting to be completed.</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon purple">
                <FaUsers />
              </div>

              <div>
                <h4>Team Collaboration</h4>

                <p>{stats.users} members are actively collaborating.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="dashboard-premium-cta"
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
            duration: 0.7,
          }}
        >
          {/* Background Effects */}

          <div className="cta-background">
            <div className="cta-glow glow-purple"></div>

            <div className="cta-glow glow-blue"></div>

            <div className="cta-grid"></div>
          </div>

          <div className="cta-left">
            <div className="cta-pill">
              <FaRocket />

              <span>READY TO BUILD</span>
            </div>

            <h2>
              Create your next
              <span> successful project.</span>
            </h2>

            <p>
              Plan projects, assign tasks, monitor progress and collaborate with
              your team using one modern, intelligent workspace.
            </p>

            <div className="cta-features">
              <div className="cta-chip">
                <FaProjectDiagram />

                <span>Unlimited Projects</span>
              </div>

              <div className="cta-chip">
                <FaTasks />

                <span>Smart Task Tracking</span>
              </div>

              <div className="cta-chip">
                <FaUsers />

                <span>Team Collaboration</span>
              </div>

              <div className="cta-chip">
                <FaShieldAlt />

                <span>Secure Workspace</span>
              </div>
            </div>

            <div className="cta-buttons">
              <motion.button
                className="cta-primary-btn"
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => navigate("/projects")}
              >
                <FaPlus />

                <span>New Project</span>
              </motion.button>

              <motion.button
                className="cta-secondary-btn"
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => navigate("/tasks")}
              >
                <span>View Tasks</span>

                <FaArrowRight />
              </motion.button>
            </div>
          </div>

          <motion.div
            className="workspace-health-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="health-header">
              <div>
                <span>Workspace Health</span>

                <h2>{completion}%</h2>
              </div>

              <div className="health-icon">
                <FaArrowTrendUp />
              </div>
            </div>

            <div className="health-progress">
              <motion.div
                className="health-progress-fill"
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: `${completion}%`,
                }}
                transition={{
                  duration: 1.4,
                }}
              />
            </div>

            <div className="health-status">
              {completion >= 90
                ? "Excellent Performance"
                : completion >= 70
                  ? "Great Progress"
                  : completion >= 40
                    ? "Good Progress"
                    : "Getting Started"}
            </div>

            <div className="health-items">
              <div className="health-item">
                <div className="health-item-icon blue">
                  <FaProjectDiagram />
                </div>

                <div>
                  <strong>{stats.projects}</strong>

                  <span>Projects</span>
                </div>
              </div>

              <div className="health-item">
                <div className="health-item-icon green">
                  <FaTasks />
                </div>

                <div>
                  <strong>{stats.tasks}</strong>

                  <span>Tasks</span>
                </div>
              </div>

              <div className="health-item">
                <div className="health-item-icon purple">
                  <FaUsers />
                </div>

                <div>
                  <strong>{stats.users}</strong>

                  <span>Members</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
