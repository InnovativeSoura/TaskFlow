import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Analytics.css";

import {
  Bar,
  Pie,
  Line,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

function Analytics() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    completionRate: 0,
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const dashboardRes = await axios.get(
        `${API_URL}/api/dashboard`
      );

      setStats(dashboardRes.data.statistics);

      setProjects(dashboardRes.data.recentProjects);

      setTasks(dashboardRes.data.recentTasks);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        Loading Analytics...
      </div>
    );
  }

  const taskStatusData = {
    labels: [
      "Completed",
      "In Progress",
      "Todo",
    ],

    datasets: [
      {
        label: "Tasks",

        data: [
          stats.completedTasks,
          stats.inProgressTasks,
          stats.todoTasks,
        ],

        backgroundColor: [
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  const projectBarData = {
    labels: [
      "Projects",
      "Tasks",
    ],

    datasets: [
      {
        label: "Overview",

        data: [
          stats.totalProjects,
          stats.totalTasks,
        ],

        backgroundColor: [
          "#2563eb",
          "#8b5cf6",
        ],
      },
    ],
  };

  const completionLineData = {
    labels: [
      "Completed",
      "In Progress",
      "Todo",
    ],

    datasets: [
      {
        label: "Tasks",

        data: [
          stats.completedTasks,
          stats.inProgressTasks,
          stats.todoTasks,
        ],

        borderColor: "#2563eb",

        backgroundColor: "#2563eb",

        tension: 0.4,
      },
    ],
  };

  return (
    <div className="analytics-page">

      <Sidebar />

      <div className="analytics-main">

        <Navbar />

        <div className="analytics-container">

          <div className="analytics-header">

            <div>

              <h1>Analytics Dashboard</h1>

              <p>
                Project Insights & Productivity Reports
              </p>

            </div>

            <button onClick={fetchAnalytics}>
              Refresh
            </button>

          </div>

          <div className="analytics-stats">

            <div className="analytics-card blue">
              <h2>{stats.totalProjects}</h2>
              <p>Total Projects</p>
            </div>

            <div className="analytics-card purple">
              <h2>{stats.totalTasks}</h2>
              <p>Total Tasks</p>
            </div>

            <div className="analytics-card green">
              <h2>{stats.completedTasks}</h2>
              <p>Completed Tasks</p>
            </div>

            <div className="analytics-card orange">
              <h2>{stats.completionRate}%</h2>
              <p>Completion Rate</p>
            </div>

          </div>
                    {/* Charts */}

          <div className="charts-grid">

            {/* Project Overview */}

            <div className="chart-card">

              <div className="chart-header">
                <h2>Project Overview</h2>
              </div>

              <Bar
                data={projectBarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />

            </div>

            {/* Task Distribution */}

            <div className="chart-card">

              <div className="chart-header">
                <h2>Task Distribution</h2>
              </div>

              <Pie
                data={taskStatusData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />

            </div>

          </div>

          {/* Productivity Chart */}

          <div className="chart-card">

            <div className="chart-header">

              <h2>
                Productivity Overview
              </h2>

            </div>

            <Line
              data={completionLineData}
              options={{
                responsive: true,

                plugins: {
                  legend: {
                    position: "top",
                  },
                },

                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />

          </div>

          {/* Recent Projects */}

          <div className="analytics-section">

            <div className="chart-card">

              <div className="chart-header">

                <h2>
                  Recent Projects
                </h2>

              </div>

              {projects.length === 0 ? (

                <p className="empty">
                  No projects available.
                </p>

              ) : (

                projects.map((project) => (

                  <div
                    key={project._id}
                    className="analytics-item"
                  >

                    <div>

                      <h3>{project.title}</h3>

                      <p>
                        {project.description ||
                          "No description"}
                      </p>

                    </div>

                    <span
                      className={`status ${project.status
                        ?.replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {project.status}
                    </span>

                  </div>

                ))

              )}

            </div>

            {/* Recent Tasks */}

            <div className="chart-card">

              <div className="chart-header">

                <h2>
                  Recent Tasks
                </h2>

              </div>

              {tasks.length === 0 ? (

                <p className="empty">
                  No tasks available.
                </p>

              ) : (

                tasks.map((task) => (

                  <div
                    key={task._id}
                    className="analytics-item"
                  >

                    <div>

                      <h3>{task.title}</h3>

                      <p>
                        {task.description}
                      </p>

                    </div>

                    <span
                      className={`status ${task.status
                        ?.replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {task.status}
                    </span>

                  </div>

                ))

              )}

            </div>

          </div>
                    {/* KPI Summary */}

          <div className="analytics-summary">

            <div className="summary-card">

              <h3>Completion Rate</h3>

              <h1>{stats.completionRate}%</h1>

              <div className="progress">

                <div
                  className="progress-fill"
                  style={{
                    width: `${stats.completionRate}%`,
                  }}
                ></div>

              </div>

            </div>

            <div className="summary-card">

              <h3>Completed Tasks</h3>

              <h1>{stats.completedTasks}</h1>

              <p>
                Successfully finished tasks
              </p>

            </div>

            <div className="summary-card">

              <h3>In Progress</h3>

              <h1>{stats.inProgressTasks}</h1>

              <p>
                Currently being worked on
              </p>

            </div>

            <div className="summary-card">

              <h3>Pending Tasks</h3>

              <h1>{stats.todoTasks}</h1>

              <p>
                Waiting to be started
              </p>

            </div>

          </div>

          {/* Activity Overview */}

          <div className="chart-card">

            <div className="chart-header">

              <h2>Performance Overview</h2>

            </div>

            <table className="analytics-table">

              <thead>

                <tr>

                  <th>Metric</th>

                  <th>Value</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>Total Projects</td>

                  <td>{stats.totalProjects}</td>

                </tr>

                <tr>

                  <td>Total Tasks</td>

                  <td>{stats.totalTasks}</td>

                </tr>

                <tr>

                  <td>Completed Tasks</td>

                  <td>{stats.completedTasks}</td>

                </tr>

                <tr>

                  <td>In Progress</td>

                  <td>{stats.inProgressTasks}</td>

                </tr>

                <tr>

                  <td>Todo Tasks</td>

                  <td>{stats.todoTasks}</td>

                </tr>

                <tr>

                  <td>Completion Rate</td>

                  <td>{stats.completionRate}%</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Analytics;