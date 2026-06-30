import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./Reports.css";

function Reports() {

  const API_URL = import.meta.env.VITE_API_URL;

  //-------------------------------------
  // STATES
  //-------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [report, setReport] =
    useState({});

  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  //-------------------------------------
  // FETCH REPORT DATA
  //-------------------------------------

  const fetchReports = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/reports`
      );

      setReport(res.data.summary);

      setProjects(
        res.data.projects || []
      );

      setTasks(
        res.data.tasks || []
      );

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  };

  useEffect(() => {

    fetchReports();

  }, []);

  //-------------------------------------
  // FILTERS
  //-------------------------------------

  const filteredProjects =
    projects.filter((project) => {

      const searchMatch =
        project.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const statusMatch =
        statusFilter === "All"
          ? true
          : project.status ===
            statusFilter;

      return (
        searchMatch &&
        statusMatch
      );

    });

  //-------------------------------------
  // LOADING
  //-------------------------------------

  if (loading) {

    return (

      <div className="loading-screen">

        <h2>
          Loading Reports...
        </h2>

      </div>

    );

  }

  //-------------------------------------
  // JSX
  //-------------------------------------

  return (

    <div className="report-page">

      <Sidebar />

      <div className="report-main">

        <Navbar />

        <div className="report-container">

          {/* HEADER */}

          <div className="report-header">

            <div>

              <h1>
                Reports & Analytics
              </h1>

              <p>

                Monitor project
                performance and
                productivity.

              </p>

            </div>

            <button
              className="export-btn"
            >
              Export Report
            </button>

          </div>

          {/* TOOLBAR */}

          <div className="report-toolbar">

            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option>
                All
              </option>

              <option>
                Active
              </option>

              <option>
                Completed
              </option>

              <option>
                On Hold
              </option>

            </select>

          </div>
                    {/* =====================================
                    SUMMARY CARDS
          ===================================== */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <h2>
                {report.totalProjects || 0}
              </h2>

              <p>Total Projects</p>

            </div>

            <div className="stat-card purple">

              <h2>
                {report.totalTasks || 0}
              </h2>

              <p>Total Tasks</p>

            </div>

            <div className="stat-card green">

              <h2>
                {report.completedTasks || 0}
              </h2>

              <p>Completed Tasks</p>

            </div>

            <div className="stat-card orange">

              <h2>
                {report.activeProjects || 0}
              </h2>

              <p>Active Projects</p>

            </div>

            <div className="stat-card red">

              <h2>
                {report.pendingTasks || 0}
              </h2>

              <p>Pending Tasks</p>

            </div>

            <div className="stat-card dark">

              <h2>
                {report.completionRate || 0}%
              </h2>

              <p>Completion Rate</p>

            </div>

          </div>

          {/* =====================================
                    PROJECT LIST
          ===================================== */}

          <div className="report-card">

            <div className="card-header">

              <h2>
                Project Summary
              </h2>

            </div>

            {

              filteredProjects.length === 0 ? (

                <p className="empty">

                  No Projects Found

                </p>

              ) : (

                filteredProjects.map((project) => (

                  <div
                    key={project._id}
                    className="list-item"
                  >

                    <div>

                      <h3>

                        {project.title}

                      </h3>

                      <p>

                        {project.description ||
                          "No description available."}

                      </p>

                    </div>

                    <div
                      className="project-report-info"
                    >

                      <span
                        className={`badge ${project.status
                          ?.replace(/\s/g, "")
                          .toLowerCase()}`}
                      >

                        {project.status}

                      </span>

                    </div>

                  </div>

                ))

              )

            }

          </div>

          {/* =====================================
                  TASK STATISTICS
          ===================================== */}

          <div className="report-card">

            <div className="card-header">

              <h2>

                Task Statistics

              </h2>

            </div>

            <div className="task-stats-grid">

              <div className="mini-card">

                <h3>

                  {

                    tasks.filter(
                      (t) =>
                        t.status === "Todo"
                    ).length

                  }

                </h3>

                <p>Todo</p>

              </div>

              <div className="mini-card">

                <h3>

                  {

                    tasks.filter(
                      (t) =>
                        t.status ===
                        "In Progress"
                    ).length

                  }

                </h3>

                <p>In Progress</p>

              </div>

              <div className="mini-card">

                <h3>

                  {

                    tasks.filter(
                      (t) =>
                        t.status ===
                        "Review"
                    ).length

                  }

                </h3>

                <p>Review</p>

              </div>

              <div className="mini-card">

                <h3>

                  {

                    tasks.filter(
                      (t) =>
                        t.status ===
                        "Completed"
                    ).length

                  }

                </h3>

                <p>Completed</p>

              </div>

            </div>

          </div>
                    {/* =====================================
                PRIORITY DISTRIBUTION
          ===================================== */}

          <div className="report-card">

            <div className="card-header">

              <h2>
                Priority Distribution
              </h2>

            </div>

            <div className="task-stats-grid">

              <div className="mini-card low">

                <h3>
                  {
                    tasks.filter(
                      (task) =>
                        task.priority === "Low"
                    ).length
                  }
                </h3>

                <p>Low Priority</p>

              </div>

              <div className="mini-card medium">

                <h3>
                  {
                    tasks.filter(
                      (task) =>
                        task.priority === "Medium"
                    ).length
                  }
                </h3>

                <p>Medium Priority</p>

              </div>

              <div className="mini-card high">

                <h3>
                  {
                    tasks.filter(
                      (task) =>
                        task.priority === "High"
                    ).length
                  }
                </h3>

                <p>High Priority</p>

              </div>

            </div>

          </div>

          {/* =====================================
                RECENT TASKS
          ===================================== */}

          <div className="report-card">

            <div className="card-header">

              <h2>
                Recent Tasks
              </h2>

            </div>

            {

              tasks.length === 0 ? (

                <p className="empty">

                  No Tasks Available

                </p>

              ) : (

                tasks.slice(0, 8).map((task) => (

                  <div
                    className="list-item"
                    key={task._id}
                  >

                    <div>

                      <h3>

                        {task.title}

                      </h3>

                      <p>

                        {task.project?.title ||
                          "General Project"}

                      </p>

                    </div>

                    <div>

                      <span
                        className={`badge ${task.status
                          ?.replace(/\s/g, "")
                          .toLowerCase()}`}
                      >

                        {task.status}

                      </span>

                    </div>

                  </div>

                ))

              )

            }

          </div>

          {/* =====================================
                MONTHLY SUMMARY
          ===================================== */}

          <div className="report-card">

            <div className="card-header">

              <h2>
                Monthly Summary
              </h2>

            </div>

            <div className="summary-grid">

              <div className="summary-item">

                <h3>
                  {report.totalProjects || 0}
                </h3>

                <p>
                  Projects
                </p>

              </div>

              <div className="summary-item">

                <h3>
                  {report.totalTasks || 0}
                </h3>

                <p>
                  Tasks
                </p>

              </div>

              <div className="summary-item">

                <h3>
                  {report.completedTasks || 0}
                </h3>

                <p>
                  Completed
                </p>

              </div>

              <div className="summary-item">

                <h3>
                  {report.pendingTasks || 0}
                </h3>

                <p>
                  Pending
                </p>

              </div>

            </div>

          </div>
                    {/* =====================================
                OVERALL PROGRESS
          ===================================== */}

          <div className="report-card">

            <div className="card-header">

              <h2>
                Overall Progress
              </h2>

            </div>

            <div className="progress-section">

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${report.completionRate || 0}%`,
                  }}
                ></div>

              </div>

              <div className="progress-info">

                <h2>
                  {report.completionRate || 0}%
                </h2>

                <p>
                  Overall Task Completion
                </p>

              </div>

            </div>

          </div>

          {/* =====================================
                PRODUCTIVITY SCORE
          ===================================== */}

          <div className="report-card">

            <div className="card-header">

              <h2>
                Productivity Score
              </h2>

            </div>

            <div className="summary-grid">

              <div className="summary-item">

                <h3>
                  {report.activeProjects || 0}
                </h3>

                <p>
                  Active Projects
                </p>

              </div>

              <div className="summary-item">

                <h3>
                  {report.completedTasks || 0}
                </h3>

                <p>
                  Completed Tasks
                </p>

              </div>

              <div className="summary-item">

                <h3>
                  {tasks.length}
                </h3>

                <p>
                  Total Tasks
                </p>

              </div>

              <div className="summary-item">

                <h3>
                  {report.totalProjects || 0}
                </h3>

                <p>
                  Total Projects
                </p>

              </div>

            </div>

          </div>

        </div>
        {/* report-container */}

      </div>
      {/* report-main */}

    </div>
    // report-page 

  );

}

export default Reports;