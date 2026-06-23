import { useState, useEffect } from "react";
import axios from "axios";

function Projects() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/projects`, {
        title,
        description,
      });

      setTitle("");
      setDescription("");

      fetchProjects();
    } catch (err) {
      console.error("Create project error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Project</h2>

      <form onSubmit={handleCreateProject}>
        <input
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>

      <h3>All Projects</h3>

      {projects.map((p) => (
        <div key={p._id}>
          <h4>{p.title}</h4>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Projects;

