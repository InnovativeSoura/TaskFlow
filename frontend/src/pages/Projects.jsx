import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Projects.css";

function Projects() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Planning",
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/projects`, form);

      setForm({
        title: "",
        description: "",
        status: "Planning",
      });

      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await axios.delete(`${API_URL}/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="projects-page">

      <Sidebar />

      <div className="projects-main">

        <Navbar />

        <div className="projects-content">

          <div className="projects-header">

            <h1>Projects</h1>

            <input
              type="text"
              placeholder="Search Project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <form
            className="project-form"
            onSubmit={createProject}
          >

            <input
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Planning</option>
              <option>Active</option>
              <option>Completed</option>
            </select>

            <button>Create Project</button>

          </form>

          <div className="project-grid">

            {filteredProjects.length === 0 ? (
              <p>No Projects Found</p>
            ) : (
              filteredProjects.map((project) => (
                <div
                  className="project-card"
                  key={project._id}
                >

                  <h2>{project.title}</h2>

                  <p>{project.description}</p>

                  <span
                    className={`badge ${project.status.toLowerCase()}`}
                  >
                    {project.status}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteProject(project._id)
                    }
                  >
                    Delete
                  </button>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Projects;