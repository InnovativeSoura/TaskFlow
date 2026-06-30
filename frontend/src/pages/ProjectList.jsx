import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./ProjectList.css";

function ProjectList() {

  const API_URL = import.meta.env.VITE_API_URL;

  //--------------------------------------------------
  // STATES
  //--------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState(null);

  const [projectForm, setProjectForm] =
    useState({

      title: "",

      description: "",

      status: "Planning",

      startDate: "",

      endDate: "",

    });

  //--------------------------------------------------
  // FETCH PROJECTS
  //--------------------------------------------------

  const fetchProjects = async () => {

    try {

      if (!refreshing) {

        setLoading(true);

      }

      setRefreshing(true);

      const res = await axios.get(
        `${API_URL}/api/projects`
      );

      setProjects(res.data);

    } catch (err) {

      console.error(err);

      alert("Failed to fetch projects.");

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  };

  //--------------------------------------------------
  // INITIAL LOAD
  //--------------------------------------------------

  useEffect(() => {

    fetchProjects();

  }, []);

  //--------------------------------------------------
  // FILTER PROJECTS
  //--------------------------------------------------

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
          : project.status === statusFilter;

      return (
        searchMatch &&
        statusMatch
      );

    });

  //--------------------------------------------------
  // STATISTICS
  //--------------------------------------------------

  const totalProjects =
    projects.length;

  const planningProjects =
    projects.filter(
      (p) => p.status === "Planning"
    ).length;

  const activeProjects =
    projects.filter(
      (p) => p.status === "Active"
    ).length;

  const completedProjects =
    projects.filter(
      (p) => p.status === "Completed"
    ).length;

  //--------------------------------------------------
  // RESET FORM
  //--------------------------------------------------

  const resetForm = () => {

    setEditingProject(null);

    setProjectForm({

      title: "",

      description: "",

      status: "Planning",

      startDate: "",

      endDate: "",

    });

  };

  //--------------------------------------------------
  // OPEN CREATE MODAL
  //--------------------------------------------------

  const openCreateModal = () => {

    resetForm();

    setShowModal(true);

  };

  //--------------------------------------------------
  // OPEN EDIT MODAL
  //--------------------------------------------------

  const openEditModal = (project) => {

    setEditingProject(project);

    setProjectForm({

      title: project.title,

      description:
        project.description,

      status: project.status,

      startDate: project.startDate
        ? project.startDate.substring(0, 10)
        : "",

      endDate: project.endDate
        ? project.endDate.substring(0, 10)
        : "",

    });

    setShowModal(true);

  };

  //--------------------------------------------------
  // CREATE / UPDATE PROJECT
  //--------------------------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingProject) {

        await axios.put(

          `${API_URL}/api/projects/${editingProject._id}`,

          projectForm

        );

      } else {

        await axios.post(

          `${API_URL}/api/projects`,

          projectForm

        );

      }

      setShowModal(false);

      resetForm();

      fetchProjects();

    } catch (err) {

      console.error(err);

      alert("Failed to save project.");

    }

  };

  //--------------------------------------------------
  // DELETE PROJECT
  //--------------------------------------------------

  const deleteProject = async (id) => {

    if (
      !window.confirm(
        "Delete this project?"
      )
    )
      return;

    try {

      await axios.delete(

        `${API_URL}/api/projects/${id}`

      );

      fetchProjects();

    } catch (err) {

      console.error(err);

      alert("Failed to delete project.");

    }

  };
//--------------------------------------------------
// LOADING
//--------------------------------------------------
   if (loading) {

    return (

      <div className="loading-screen">

        <h2>Loading Projects...</h2>

      </div>

    );

  }
//--------------------------------------------------
// JSX
//--------------------------------------------------
  return (

    <div className="project-page">
  
      <Sidebar />

      <div className="project-main">

        <Navbar />

        <div className="project-container">

{/* =======================================
              HEADER
======================================= */}

          <div className="project-header">

            <div>

              <h1>Project Management</h1>

              <p>
                Create, organize and manage your projects
              </p>

            </div>

            <button
              className="create-btn"
              onClick={openCreateModal}
            >
              + Create Project
            </button>

          </div>

{/* =======================================
            TOOLBAR
======================================= */}

          <div className="project-toolbar">

            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
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
              <option value="All">
                All Status
              </option>

              <option value="Planning">
                Planning
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

            <button
              className="refresh-btn"
              onClick={fetchProjects}
            >
              Refresh
            </button>

          </div>

{/* =======================================
            STATISTICS
======================================= */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <h2>{totalProjects}</h2>

              <p>Total Projects</p>

            </div>

            <div className="stat-card orange">

              <h2>{planningProjects}</h2>

              <p>Planning</p>

            </div>

            <div className="stat-card green">

              <h2>{activeProjects}</h2>

              <p>Active</p>

            </div>

            <div className="stat-card purple">

              <h2>{completedProjects}</h2>

              <p>Completed</p>

            </div>

          </div>

{/* =======================================
            PROJECT GRID
======================================= */}

          <div className="project-grid">
                        {filteredProjects.length === 0 ? (

              <div className="empty-state">

                <h2>No Projects Found</h2>

                <p>
                  Create your first project to get started.
                </p>

              </div>

            ) : (

              filteredProjects.map((project) => (

                <div
                  className="project-card"
                  key={project._id}
                >

                  {/* Project Header */}

                  <div className="project-card-header">

                    <h2>
                      {project.title}
                    </h2>

                    <span
                      className={`status-badge ${project.status
                        ?.replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {project.status}
                    </span>

                  </div>

                  {/* Description */}

                  <p className="project-description">

                    {project.description ||
                      "No description available."}

                  </p>

                  {/* Project Dates */}

                  <div className="project-dates">

                    <div>

                      <strong>Start</strong>

                      <span>

                        {project.startDate
                          ? new Date(
                              project.startDate
                            ).toLocaleDateString()
                          : "Not Set"}

                      </span>

                    </div>

                    <div>

                      <strong>End</strong>

                      <span>

                        {project.endDate
                          ? new Date(
                              project.endDate
                            ).toLocaleDateString()
                          : "Not Set"}

                      </span>

                    </div>

                  </div>

                  {/* Footer */}

                  <div className="project-footer">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditModal(project)
                      }
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteProject(project._id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              ))

            )}
                    {/* =======================================
                  CREATE / EDIT MODAL
          ======================================= */}

          {showModal && (

            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">

                  <h2>

                    {editingProject
                      ? "Edit Project"
                      : "Create Project"}

                  </h2>

                  <button
                    className="close-btn"
                    onClick={() => {

                      setShowModal(false);

                      resetForm();

                    }}
                  >
                    ✕
                  </button>

                </div>

                <form
                  className="project-form"
                  onSubmit={handleSubmit}
                >

                  <label>
                    Project Title
                  </label>

                  <input
                    type="text"
                    placeholder="Enter project title"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({

                        ...projectForm,

                        title: e.target.value,

                      })
                    }
                    required
                  />

                  <label>
                    Description
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Enter description..."
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({

                        ...projectForm,

                        description:
                          e.target.value,

                      })
                    }
                  />

                  <label>
                    Status
                  </label>

                  <select
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({

                        ...projectForm,

                        status:
                          e.target.value,

                      })
                    }
                  >

                    <option value="Planning">
                      Planning
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                  <div className="date-grid">

                    <div>

                      <label>
                        Start Date
                      </label>

                      <input
                        type="date"
                        value={projectForm.startDate}
                        onChange={(e) =>
                          setProjectForm({

                            ...projectForm,

                            startDate:
                              e.target.value,

                          })
                        }
                      />

                    </div>

                    <div>

                      <label>
                        End Date
                      </label>

                      <input
                        type="date"
                        value={projectForm.endDate}
                        onChange={(e) =>
                          setProjectForm({

                            ...projectForm,

                            endDate:
                              e.target.value,

                          })
                        }
                      />

                    </div>

                  </div>

                  <div className="modal-actions">

                    <button
                      type="submit"
                      className="save-btn"
                    >

                      {editingProject
                        ? "Update Project"
                        : "Create Project"}

                    </button>

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {

                        setShowModal(false);

                        resetForm();

                      }}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}
          
        </div>

{/* End Project Grid */}
      </div>
{/* project-container */}
    </div>
{/* project-main */}

  </div>
/* project-page */
  );

}

export default ProjectList; 