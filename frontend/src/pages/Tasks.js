import { useState, useEffect } from "react";
import axios from "axios";

function Tasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    try {
      const res = API.get("/api/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/tasks`, {
        title,
        description,
      });

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (err) {
      console.error("Create task error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Task</h2>

      <form onSubmit={handleCreateTask}>
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create Task</button>
      </form>

      <h3>All Tasks</h3>

      {tasks.map((t) => (
        <div key={t._id}>
          <h4>{t.title}</h4>
          <p>{t.description}</p>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Tasks;