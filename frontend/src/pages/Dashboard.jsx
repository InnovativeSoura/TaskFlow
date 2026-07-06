import { useEffect, useMemo, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";

import { useAuth } from "../context/AuthContext";

import { getDashboardStats } from "../services/dashboardService";

import "../styles/Dashboard.css";

const Dashboard = () => {
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

      const usersData = data.users.users || [];
      const projectsData = data.projects.projects || [];
      const tasksData = data.tasks.tasks || [];

      setUsers(usersData);
      setProjects(projectsData);
      setTasks(tasksData);

      const completed = tasksData.filter(
        (task) =>
          task.status === "Completed"
      ).length;

      const pending = tasksData.filter(
        (task) =>
          task.status === "To Do" ||
          task.status === "Pending"
      ).length;

      const active = projectsData.filter(
        (project) =>
          project.status === "Active"
      ).length;

      setStats({
        users: usersData.length,
        projects: projectsData.length,
        tasks: tasksData.length,
        completed,
        pending,
        active,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {

    return projects.filter((project) => {

      const title =
        project.title ||
        project.name ||
        "";

      return title
        .toLowerCase()
        .includes(search.toLowerCase());

    });

  }, [projects, search]);

  const filteredTasks = useMemo(() => {

    return tasks.filter((task) => {

      const title =
        task.title ||
        task.name ||
        "";

      return title
        .toLowerCase()
        .includes(search.toLowerCase());

    });

  }, [tasks, search]);

  const completion = stats.tasks
    ? Math.round(
        (stats.completed / stats.tasks) * 100
      )
    : 0;

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>

      <PageHeader
        title={`Welcome, ${user?.name || "User"}`}
        subtitle={`Role : ${user?.role || "Team Member"}`}
      />

      <div className="dashboard-actions">

        <SearchBar
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search Projects or Tasks..."
        />

        <button>
          + New Project
        </button>

      </div>

      <div className="stats-grid">

        <StatCard
          title="Users"
          value={stats.users}
          color="blue"
        />

        <StatCard
          title="Projects"
          value={stats.projects}
          color="green"
        />

        <StatCard
          title="Tasks"
          value={stats.tasks}
          color="orange"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          color="purple"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          color="red"
        />

        <StatCard
          title="Active"
          value={stats.active}
          color="dark"
        />

      </div>
            {/* ==========================
          DASHBOARD SECTIONS
      ========================== */}

      <div className="dashboard-sections">

        {/* ==========================
            RECENT PROJECTS
        ========================== */}

        <div className="dashboard-card">

          <div className="card-header">

            <h2>Recent Projects</h2>

            <button>
              View All
            </button>

          </div>

          {filteredProjects.length === 0 ? (

            <EmptyState title="No Projects Found" />

          ) : (

            filteredProjects
              .slice(0, 5)
              .map((project) => (

                <div
                  key={project._id}
                  className="list-item"
                >

                  <div>

                    <h3>

                      {project.title || project.name}

                    </h3>

                    <p>

                      {project.description
                        ? project.description.substring(
                            0,
                            80
                          )
                        : "No description"}

                    </p>

                  </div>

                  <span
                    className={`badge ${(
                      project.status || ""
                    )
                      .toLowerCase()
                      .replace(/\s/g, "")}`}
                  >

                    {project.status || "Planning"}

                  </span>

                </div>

              ))

          )}

        </div>

        {/* ==========================
            RECENT TASKS
        ========================== */}

        <div className="dashboard-card">

          <div className="card-header">

            <h2>Recent Tasks</h2>

            <button>

              View All

            </button>

          </div>

          {filteredTasks.length === 0 ? (

            <EmptyState title="No Tasks Found" />

          ) : (

            filteredTasks
              .slice(0, 5)
              .map((task) => (

                <div
                  key={task._id}
                  className="deadline-item"
                >

                  <div>

                    <h3>

                      {task.title || task.name}

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
                      task.priority || "medium"
                    ).toLowerCase()}`}
                  >

                    {task.priority || "Medium"}

                  </span>

                </div>

              ))

          )}

        </div>

      </div>

      {/* ==========================
          OVERALL PROGRESS
      ========================== */}

      <div className="dashboard-card">

        <div className="card-header">

          <h2>

            Overall Project Progress

          </h2>

        </div>

        <div className="progress-container">

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${completion}%`,
              }}
            />

          </div>

          <h2>

            {completion}% Completed

          </h2>

        </div>

      </div>

      {/* ==========================
          QUICK SUMMARY
      ========================== */}

      <div className="dashboard-card">

        <div className="card-header">

          <h2>

            Quick Summary

          </h2>

        </div>

        <div className="summary-grid">

          <div className="summary-item">

            <h3>

              {stats.projects}

            </h3>

            <p>

              Total Projects

            </p>

          </div>

          <div className="summary-item">

            <h3>

              {stats.tasks}

            </h3>

            <p>

              Total Tasks

            </p>

          </div>

          <div className="summary-item">

            <h3>

              {stats.completed}

            </h3>

            <p>

              Completed Tasks

            </p>

          </div>

          <div className="summary-item">

            <h3>

              {users.length}

            </h3>

            <p>

              Team Members

            </p>

          </div>

        </div>

      </div>
            {/* ==========================
          TEAM OVERVIEW
      ========================== */}

      <div className="dashboard-card">

        <div className="card-header">

          <h2>Team Members</h2>

        </div>

        {users.length === 0 ? (

          <EmptyState title="No Team Members Found" />

        ) : (

          users.slice(0, 5).map((member) => (

            <div
              key={member._id}
              className="list-item"
            >

              <div>

                <h3>{member.name}</h3>

                <p>{member.email}</p>

              </div>

              <span
                className={`badge ${
                  member.status === "Active"
                    ? "completed"
                    : "archived"
                }`}
              >
                {member.status || "Active"}
              </span>

            </div>

          ))

        )}

      </div>

      {/* ==========================
          RECENT ACTIVITY
      ========================== */}

      <div className="dashboard-card">

        <div className="card-header">

          <h2>Recent Activity</h2>

        </div>

        <div className="list-item">

          <div>

            <h3>Projects Created</h3>

            <p>
              {stats.projects} project(s) currently available.
            </p>

          </div>

        </div>

        <div className="list-item">

          <div>

            <h3>Tasks Assigned</h3>

            <p>
              {stats.tasks} task(s) available in the workspace.
            </p>

          </div>

        </div>

        <div className="list-item">

          <div>

            <h3>Completed Tasks</h3>

            <p>
              {stats.completed} task(s) completed successfully.
            </p>

          </div>

        </div>

        <div className="list-item">

          <div>

            <h3>Pending Tasks</h3>

            <p>
              {stats.pending} task(s) awaiting completion.
            </p>

          </div>

        </div>

      </div>

    </MainLayout>

  );

};

export default Dashboard;