import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket/socket";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardData();

    socket.on("taskCreated", () => {
      fetchDashboardData();
    });

    socket.on("taskUpdated", () => {
      fetchDashboardData();
    });

    socket.on("taskDeleted", () => {
      fetchDashboardData();
    });

    socket.on("taskStatusChanged", () => {
      fetchDashboardData();
    });

    socket.on("newComment", (data) => {
      console.log("💬 New Comment:", data);
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("taskStatusChanged");
      socket.off("newComment");
    };
  }, []);

  
const fetchDashboardData = async () => {
  try {
    const projectRes = await axios.get(
      `${API_URL}/api/projects`
    );

    const taskRes = await axios.get(
      `${API_URL}/api/tasks`
    );

    const projectData =
      projectRes.data.projects || projectRes.data || [];

    const taskData =
      taskRes.data.tasks || taskRes.data || [];

    setProjects(projectData);
    setTasks(taskData);

    setStats({
      totalProjects: projectData.length,

      totalTasks: taskData.length,

      completedTasks: taskData.filter(
        (task) => task.status === "Completed"
      ).length,

      inProgressTasks: taskData.filter(
        (task) => task.status === "In Progress"
      ).length,
    });
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error.response?.data || error.message
    );
  }
};



  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>
          Welcome to TaskFlow Project
          Management System
        </p>

        <button
          onClick={() => navigate("/pricing")}
          className="upgrade-btn"
        >
          Upgrade to Pro 🚀
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <h2>{stats.totalProjects}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <h2>{stats.totalTasks}</h2>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <h2>{stats.completedTasks}</h2>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <h2>{stats.inProgressTasks}</h2>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="dashboard-section">
        <h2>Recent Tasks</h2>

        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.slice(0, 5).map((task) => (
              <div
                className="task-item"
                key={task._id}
              >
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>

                <span
                  className={`status ${task.status
                    ?.toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {task.status}
                </span>
              </div>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
      </div>

      {/* Active Projects */}
      <div className="dashboard-section">
        <h2>Active Projects</h2>

        <div className="project-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="project-card"
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

