import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./Tasks.css";

function Tasks() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/tasks`, form);

      setForm({
        title: "",
        description: "",
        status: "Todo",
        priority: "Medium",
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="tasks-page">

      <Sidebar />

      <div className="tasks-main">

        <Navbar />

        <div className="tasks-content">

          <div className="tasks-header">

            <h1>Tasks</h1>

            <div className="task-filters">

              <input
                type="text"
                placeholder="Search Task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option>All</option>
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

            </div>

          </div>

          <form
            className="task-form"
            onSubmit={createTask}
          >

            <input
              name="title"
              placeholder="Task Title"
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
              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button>Create Task</button>

          </form>

          <div className="task-grid">

            {filteredTasks.length === 0 ? (
              <p>No Tasks Found</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  className="task-card"
                  key={task._id}
                >

                  <h2>{task.title}</h2>

                  <p>{task.description}</p>

                  <div className="task-tags">

                    <span
                      className={`status ${task.status
                        .replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {task.status}
                    </span>

                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteTask(task._id)
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

export default Tasks;