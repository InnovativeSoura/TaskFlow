import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./Dashboard.css";

function Dashboard() {

  const API_URL = import.meta.env.VITE_API_URL;

  //----------------------------------------------------
  // STATES
  //----------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [lastUpdated, setLastUpdated] =
    useState("");

  const [statistics, setStatistics] =
    useState({

      totalProjects: 0,

      activeProjects: 0,

      completedProjects: 0,

      totalTasks: 0,

      completedTasks: 0,

      inProgressTasks: 0,

      todoTasks: 0,

      completionRate: 0,

    });

  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [upcomingTasks, setUpcomingTasks] =
    useState([]);

  //----------------------------------------------------
  // FETCH DASHBOARD
  //----------------------------------------------------

  const fetchDashboard = async () => {

    try {

      if (!refreshing) {

        setLoading(true);

      }

      setRefreshing(true);

      const res = await axios.get(
        `${API_URL}/api/dashboard`
      );

      setStatistics(res.data.statistics);

      setProjects(res.data.recentProjects);

      setTasks(res.data.recentTasks);

      setUpcomingTasks(
        res.data.upcomingTasks
      );

      setLastUpdated(
        new Date().toLocaleString()
      );

    } catch (err) {

      console.error(err);

      alert(
        "Unable to load dashboard."
      );

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  };

  //----------------------------------------------------
  // LOAD DATA
  //----------------------------------------------------

  useEffect(() => {

    fetchDashboard();

  }, []);

  //----------------------------------------------------
  // SEARCH FILTERS
  //----------------------------------------------------

  const filteredProjects =
    projects.filter((project) =>
      project.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const filteredTasks =
    tasks.filter((task) =>
      task.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  //----------------------------------------------------
  // HELPER
  //----------------------------------------------------

  const greeting = () => {

    const hour =
      new Date().getHours();

    if (hour < 12)
      return "Good Morning";

    if (hour < 17)
      return "Good Afternoon";

    return "Good Evening";

  };

  //----------------------------------------------------
  // CALCULATED VALUES
  //----------------------------------------------------

  const completedPercentage =
    statistics.totalTasks === 0
      ? 0
      : Math.round(
          (statistics.completedTasks /
            statistics.totalTasks) *
            100
        );

  //----------------------------------------------------
  // LOADING SCREEN
  //----------------------------------------------------

  if (loading) {

    return (

      <div className="loading-screen">

        <div className="loading-card">

          <div className="loader"></div>

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Please wait while we fetch
            your dashboard.
          </p>

        </div>

      </div>

    );

  }

  //----------------------------------------------------
  // RETURN STARTS HERE
  //----------------------------------------------------

  return (

    <div className="dashboard-page">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <div className="dashboard-container">
         {/* HEADER */}
          <div className="dashboard-header">

            <div>

              <h1>
                {greeting()}, Welcome 👋
              </h1>

              <p>
                TaskFlow Project Management Dashboard
              </p>

              <small>
                Last Updated :{" "}
                {lastUpdated || "Just Now"}
              </small>

            </div>

            <div className="dashboard-actions">

              <input
                type="text"
                placeholder="Search projects or tasks..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <button
                className="refresh-btn"
                onClick={fetchDashboard}
                disabled={refreshing}
              >
                {refreshing
                  ? "Refreshing..."
                  : "🔄 Refresh"}
              </button>

            </div>

          </div>

          {/* ==========================================
                  STATISTICS CARDS
          ========================================== */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <div className="stat-icon">
                📁
              </div>

              <div>

                <h2>
                  {statistics.totalProjects}
                </h2>

                <p>Total Projects</p>

                <small>
                  Active :
                  {" "}
                  {statistics.activeProjects}
                </small>

              </div>

            </div>

            <div className="stat-card purple">

              <div className="stat-icon">
                📝
              </div>

              <div>

                <h2>
                  {statistics.totalTasks}
                </h2>

                <p>Total Tasks</p>

                <small>
                  Across all projects
                </small>

              </div>

            </div>

            <div className="stat-card green">

              <div className="stat-icon">
                ✅
              </div>

              <div>

                <h2>
                  {statistics.completedTasks}
                </h2>

                <p>Completed Tasks</p>

                <small>
                  Successfully finished
                </small>

              </div>

            </div>

            <div className="stat-card orange">

              <div className="stat-icon">
                🚀
              </div>

              <div>

                <h2>
                  {statistics.inProgressTasks}
                </h2>

                <p>In Progress</p>

                <small>
                  Currently running
                </small>

              </div>

            </div>

            <div className="stat-card red">

              <div className="stat-icon">
                ⏳
              </div>

              <div>

                <h2>
                  {statistics.todoTasks}
                </h2>

                <p>Pending Tasks</p>

                <small>
                  Waiting to start
                </small>

              </div>

            </div>

            <div className="stat-card dark">

              <div className="stat-icon">
                📊
              </div>

              <div>

                <h2>
                  {completedPercentage}%
                </h2>

                <p>Completion Rate</p>

                <div className="mini-progress">

                  <div
                    className="mini-progress-fill"
                    style={{
                      width: `${completedPercentage}%`,
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
                  MAIN CONTENT STARTS
          ========================================== */}

          <div className="dashboard-sections">
           {/* RECENT PROJECTS*/}

            <div className="dashboard-card">

              <div className="card-header">

                <h2>📁 Recent Projects</h2>

                <button className="view-btn">
                  View All
                </button>

              </div>

              {filteredProjects.length === 0 ? (

                <div className="empty-state">

                  <h3>No Projects Found</h3>

                  <p>
                    Create your first project to get started.
                  </p>

                </div>

              ) : (

                filteredProjects.map((project) => (

                  <div
                    className="list-item"
                    key={project._id}
                  >

                    <div className="list-content">

                      <h3>{project.title}</h3>

                      <p>
                        {project.description ||
                          "No description available"}
                      </p>

                      <small>

                        📅{" "}

                        {project.createdAt
                          ? new Date(
                              project.createdAt
                            ).toLocaleDateString()
                          : "Recently"}

                      </small>

                    </div>

                    <span
                      className={`badge ${project.status
                        ?.replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {project.status}
                    </span>

                  </div>

                ))

              )}

            </div>

            {/* ==========================================
                    RECENT TASKS
            ========================================== */}

            <div className="dashboard-card">

              <div className="card-header">

                <h2>📝 Recent Tasks</h2>

              </div>

              {filteredTasks.length === 0 ? (

                <div className="empty-state">

                  <h3>No Tasks Found</h3>

                  <p>
                    No recent tasks available.
                  </p>

                </div>

              ) : (

                filteredTasks.map((task) => (

                  <div
                    className="list-item"
                    key={task._id}
                  >

                    <div className="list-content">

                      <h3>{task.title}</h3>

                      <p>
                        {task.description ||
                          "No description"}
                      </p>

                      <small>

                        👤{" "}

                        {task.assignee?.name ||
                          "Unassigned"}

                      </small>

                    </div>

                    <div
                      className="task-right"
                    >

                      <span
                        className={`badge ${task.status
                          ?.replace(/\s/g, "")
                          .toLowerCase()}`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`priority ${task.priority?.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>
          {/* END dashboard-sections */}
                    {/* ==========================================
                  UPCOMING DEADLINES
          ========================================== */}

          <div className="dashboard-card deadline-card">

            <div className="card-header">

              <h2>⏰ Upcoming Deadlines</h2>

            </div>

            {upcomingTasks.length === 0 ? (

              <div className="empty-state">

                <h3>No Upcoming Deadlines</h3>

                <p>
                  Everything is on schedule.
                </p>

              </div>

            ) : (

              upcomingTasks.map((task) => (

                <div
                  className="deadline-item"
                  key={task._id}
                >

                  <div>

                    <h3>{task.title}</h3>

                    <p>

                      📅{" "}

                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "No Deadline"}

                    </p>

                    <small>

                      📁{" "}

                      {task.project?.title ||
                        task.project?.name ||
                        "General"}

                    </small>

                  </div>

                  <span
                    className={`badge ${task.priority?.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                </div>

              ))

            )}

          </div>

          {/* ==========================================
                  OVERALL PROGRESS
          ========================================== */}

          <div className="dashboard-card">

            <div className="card-header">

              <h2>📊 Overall Progress</h2>

            </div>

            <div className="progress-container">

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${completedPercentage}%`,
                  }}
                ></div>

              </div>

              <div className="progress-details">

                <h2>{completedPercentage}%</h2>

                <p>

                  {statistics.completedTasks}

                  {" "}of{" "}

                  {statistics.totalTasks}

                  {" "}tasks completed

                </p>

              </div>

            </div>

          </div>

          {/*QUICK SUMMARY*/}

          <div className="dashboard-card">

            <div className="card-header">

              <h2>📋 Quick Summary</h2>

            </div>

            <div className="summary-grid">

              <div className="summary-item">

                <h3>
                  {statistics.activeProjects}
                </h3>

                <p>Active Projects</p>

              </div>

              <div className="summary-item">

                <h3>
                  {statistics.completedProjects}
                </h3>

                <p>Completed Projects</p>

              </div>

              <div className="summary-item">

                <h3>
                  {statistics.todoTasks}
                </h3>

                <p>Pending Tasks</p>

              </div>

              <div className="summary-item">

                <h3>
                  {statistics.inProgressTasks}
                </h3>

                <p>Running Tasks</p>

              </div>

              <div className="summary-item">

                <h3>
                  {statistics.completedTasks}
                </h3>

                <p>Finished Tasks</p>

              </div>

              <div className="summary-item">

                <h3>
                  {statistics.totalProjects}
                </h3>

                <p>Total Projects</p>

              </div>

            </div>

          </div>
          {/* ==========================================
                    DASHBOARD FOOTER
          ========================================== */}

          <div className="dashboard-footer">

            <div className="footer-left">

              <h3>
                TaskFlow Project Management System
              </h3>

              <p>
                Manage projects, organize tasks,
                track progress, and collaborate
                efficiently from one centralized
                dashboard.
              </p>

            </div>

            <div className="footer-right">

              <div className="footer-card">

                <h4>Total Projects</h4>

                <span>
                  {statistics.totalProjects}
                </span>

              </div>

              <div className="footer-card">

                <h4>Total Tasks</h4>

                <span>
                  {statistics.totalTasks}
                </span>

              </div>

              <div className="footer-card">

                <h4>Completed</h4>

                <span>
                  {statistics.completedTasks}
                </span>

              </div>

              <div className="footer-card">

                <h4>Completion</h4>

                <span>
                  {completedPercentage}%
                </span>

              </div>

            </div>

          </div>

        </div>
        {/* dashboard-container */}
      </div>
      {/* dashboard-main */}

    </div>
    

  );

}

export default Dashboard;