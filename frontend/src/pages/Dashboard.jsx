import { useEffect, useState } from "react";
import { getUsers } from "../api/dashboardApi";
import { getProjects } from "../api/dashboardApi";
import { getTasks } from "../api/dashboardApi";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [usersCount, setUsersCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [users, projects, tasks] = await Promise.all([
        getUsers(),
        getProjects(),
        getTasks(),
      ]);

      setUsersCount(users.count || users.users?.length || 0);
      setProjectsCount(projects.count || projects.projects?.length || 0);
      setTasksCount(tasks.count || tasks.tasks?.length || 0);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{ width: "250px", background: "#111", color: "#fff", padding: "20px" }}>
        <h2>Project Manager</h2>

        <p>Dashboard</p>
        <p>Users</p>
        <p>Projects</p>
        <p>Tasks</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Welcome, {user?.name}</h1>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div style={{ marginTop: "20px" }}>

            <div style={{ padding: "15px", background: "#eee", marginBottom: "10px" }}>
              👤 Total Users: {usersCount}
            </div>

            <div style={{ padding: "15px", background: "#eee", marginBottom: "10px" }}>
              📦 Total Projects: {projectsCount}
            </div>

            <div style={{ padding: "15px", background: "#eee" }}>
              ✅ Total Tasks: {tasksCount}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;