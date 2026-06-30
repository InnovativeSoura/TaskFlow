import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./TaskList.css";

function TaskList() {

  const API_URL = import.meta.env.VITE_API_URL;

  //--------------------------------------------------
  // STATES
  //--------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [taskForm, setTaskForm] =
    useState({

      title: "",

      description: "",

      priority: "Medium",

      status: "Todo",

      dueDate: "",

      project: "",

      assignee: "",

    });

  //--------------------------------------------------
  // FETCH DATA
  //--------------------------------------------------

  const fetchTasks = async () => {

    try {

      if (!refreshing) {

        setLoading(true);

      }

      setRefreshing(true);

      const taskRes = await axios.get(
        `${API_URL}/api/tasks`
      );

      const projectRes = await axios.get(
        `${API_URL}/api/projects`
      );

      setTasks(taskRes.data);

      setProjects(projectRes.data);

    } catch (err) {

      console.error(err);

      alert("Failed to fetch tasks.");

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  };

  //--------------------------------------------------
  // INITIAL LOAD
  //--------------------------------------------------

  useEffect(() => {

    fetchTasks();

  }, []);

  //--------------------------------------------------
  // FILTER TASKS
  //--------------------------------------------------

  const filteredTasks =
    tasks.filter((task) => {

      const searchMatch =
        task.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const statusMatch =
        statusFilter === "All"
          ? true
          : task.status === statusFilter;

      const priorityMatch =
        priorityFilter === "All"
          ? true
          : task.priority === priorityFilter;

      return (
        searchMatch &&
        statusMatch &&
        priorityMatch
      );

    });

  //--------------------------------------------------
  // STATISTICS
  //--------------------------------------------------

  const totalTasks = tasks.length;

  const todoTasks =
    tasks.filter(
      (t) => t.status === "Todo"
    ).length;

  const progressTasks =
    tasks.filter(
      (t) => t.status === "In Progress"
    ).length;

  const completedTasks =
    tasks.filter(
      (t) => t.status === "Completed"
    ).length;

  //--------------------------------------------------
  // RESET FORM
  //--------------------------------------------------

  const resetForm = () => {

    setEditingTask(null);

    setTaskForm({

      title: "",

      description: "",

      priority: "Medium",

      status: "Todo",

      dueDate: "",

      project: "",

      assignee: "",

    });

  };

  //--------------------------------------------------
  // OPEN MODALS
  //--------------------------------------------------

  const openCreateModal = () => {

    resetForm();

    setShowModal(true);

  };

  const openEditModal = (task) => {

    setEditingTask(task);

    setTaskForm({

      title: task.title,

      description: task.description,

      priority: task.priority,

      status: task.status,

      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : "",

      project: task.project?._id || "",

      assignee: task.assignee?._id || "",

    });

    setShowModal(true);

  };

  //--------------------------------------------------
  // CREATE / UPDATE TASK
  //--------------------------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingTask) {

        await axios.put(

          `${API_URL}/api/tasks/${editingTask._id}`,

          taskForm

        );

      } else {

        await axios.post(

          `${API_URL}/api/tasks`,

          taskForm

        );

      }

      setShowModal(false);

      resetForm();

      fetchTasks();

    } catch (err) {

      console.error(err);

      alert("Failed to save task.");

    }

  };

  //--------------------------------------------------
  // DELETE TASK
  //--------------------------------------------------

  const deleteTask = async (id) => {

    if (
      !window.confirm(
        "Delete this task?"
      )
    )
      return;

    try {

      await axios.delete(

        `${API_URL}/api/tasks/${id}`

      );

      fetchTasks();

    } catch (err) {

      console.error(err);

      alert("Failed to delete task.");

    }

  };
    //--------------------------------------------------
  // LOADING
  //--------------------------------------------------

  if (loading) {

    return (

      <div className="loading-screen">

        <h2>Loading Tasks...</h2>

      </div>

    );

  }

  //--------------------------------------------------
  // JSX
  //--------------------------------------------------

  return (

    <div className="task-page">

      <Sidebar />

      <div className="task-main">

        <Navbar />

        <div className="task-container">

{/* =======================================
                      HEADER
======================================= */}

          <div className="task-header">

            <div>

              <h1>Task Management</h1>

              <p>
                Manage all project tasks from one place
              </p>

            </div>

            <button
              className="create-btn"
              onClick={openCreateModal}
            >
              + Create Task
            </button>

          </div>

{/* =======================================
          TOOLBAR
  ======================================= */}

          <div className="task-toolbar">

            <input
              type="text"
              placeholder="Search task..."
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

              <option value="Todo">
                Todo
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Review">
                Review
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Priority
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </select>

            <button
              className="refresh-btn"
              onClick={fetchTasks}
            >
              Refresh
            </button>

          </div>

{/* =======================================
                    STATISTICS
======================================= */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <h2>{totalTasks}</h2>

              <p>Total Tasks</p>

            </div>

            <div className="stat-card orange">

              <h2>{todoTasks}</h2>

              <p>Todo</p>

            </div>

            <div className="stat-card purple">

              <h2>{progressTasks}</h2>

              <p>In Progress</p>

            </div>

            <div className="stat-card green">

              <h2>{completedTasks}</h2>

              <p>Completed</p>

            </div>

          </div>

{/* =======================================
        TASK GRID
======================================= */}

          <div className="task-grid">
            {filteredTasks.length === 0 ? (

              <div className="empty-state">

                <h2>No Tasks Found</h2>

                <p>
                  Try changing the search or filters,
                  or create a new task.
                </p>

              </div>

            ) : (

              filteredTasks.map((task) => (

                <div
                  className="task-card"
                  key={task._id}
                >

{/* CARD HEADER */}

                    <div className="task-card-header">

                            <h2>{task.title}</h2>

                        <span
                            className={`status-badge ${task.status
                                ?.replace(/\s/g, "")
                                .toLowerCase()}`}
                        >
                            {task.status}
                        </span>

                    </div>

{/* DESCRIPTION */}

                    <p className="task-description">

                        {task.description ||
                        "No description provided."}

                    </p>

{/* PROJECT */}

                    <div className="task-project">

                        <strong>Project:</strong>{" "}

                        {task.project?.title ||
                            task.project?.name ||
                        "General"}

                    </div>
{/* ASSIGNEE */}

                    <div className="task-assignee">

                        <strong>Assignee:</strong>{" "}

                        {task.assignee?.name ||
                            "Unassigned"}

                    </div>

{/* DUE DATE */}

                    <div className="task-date">

                        <strong>Due Date:</strong>{" "}

                        {task.dueDate
                            ? new Date(
                                task.dueDate
                            ).toLocaleDateString()
                        : "No Deadline"}

                    </div>

{/* PRIORITY */}

                    <div className="task-priority">

                        <span
                            className={`priority-badge ${task.priority?.toLowerCase()}`}
                        >
                            {task.priority}
                        </span>

                    </div>

{/* ACTIONS */}

                    <div className="task-footer">

                        <button
                            className="edit-btn"
                            onClick={() =>
                                openEditModal(task)
                            }   
                        >
                            Edit
                        </button>

                        <button
                            className="delete-btn"
                                onClick={() =>
                                    deleteTask(task._id)
                                }
                        >
                            Delete
                        </button>

                    </div>

                </div>

              ))

            )}

        </div>

{/* END TASK GRID */}
{/* =======================================
            CREATE / EDIT MODAL
======================================= */}

        {showModal && (

            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">

                    <h2>

                        {editingTask
                            ? "Edit Task"
                            : "Create Task"}

                    </h2>

                    <button
                        className="close-btn"
                        onClick={() => {

                            setShowModal(false);

                            resetForm();

                        }}
                    >
                        ×
                    </button>

                </div>

                    <form
                        className="task-form"
                        onSubmit={handleSubmit}
                    >

                        <label>

                            Task Title

                        <input
                            type="text"
                            required
                            value={taskForm.title}
                            onChange={(e) =>
                                setTaskForm({
                                ...taskForm,
                                title: e.target.value,
                            })
                        }
                    />

                    </label>

                    <label>

                        Description

                        <textarea
                            rows="4"
                            value={taskForm.description}
                            onChange={(e) =>
                            setTaskForm({
                                ...taskForm,
                                description:
                                e.target.value,
                            })
                        }
                        />

                    </label>

                    <label>

                        Project

                        <select
                            value={taskForm.project}
                                onChange={(e) =>
                                setTaskForm({
                                    ...taskForm,
                                    project:
                                    e.target.value,
                                })
                            }
                        >

                            <option value="">
                                Select Project
                            </option>

                            {projects.map((project) => (

                                <option
                                    key={project._id}
                                    value={project._id}
                                >
                                    {project.title ||
                                        project.name}
                                </option>

                            ))}

                        </select>

                    </label>

                    <div className="form-row">

                        <label>

                            Priority

                            <select
                                value={taskForm.priority}
                                    onChange={(e) =>
                                    setTaskForm({
                                        ...taskForm,
                                        priority:
                                        e.target.value,
                                    })
                                }
                            >

                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>

                            </select>

                        </label>

                    <label>

                      Status

                        <select
                            value={taskForm.status}
                            onChange={(e) =>
                            setTaskForm({
                                ...taskForm,
                                status:
                                e.target.value,
                            })
                            }
                        >

                            <option value="Todo">
                                Todo
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Review">
                                Review
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                        </select>

                    </label>

                </div>

                <label>

                    Due Date

                    <input
                      type="date"
                        value={taskForm.dueDate}
                            onChange={(e) =>
                                setTaskForm({
                                ...taskForm,
                                dueDate:
                                e.target.value,
                            })
                        }
                    />

                    </label>

                    <label>

                        Assignee

                        <input
                            type="text"
                            placeholder="Enter assignee ID or name"
                            value={taskForm.assignee}
                                onChange={(e) =>
                                    setTaskForm({
                                        ...taskForm,
                                        assignee:
                                        e.target.value,
                                    })
                                }
                        />

                        </label>

                    <div className="modal-actions">

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            {editingTask
                                ? "Update Task"
                                : "Create Task"}
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
{/* task-container */}

    </div>
{/* task-main */}

</div>
/* task-page */

  );

}

export default TaskList;        
