import { useEffect, useState } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/KanbanBoard.css";



function KanbanBoard() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    dueDate: "",
    project: "",
    assignee: "",
  });

  //--------------------------------------------------
  // FETCH TASKS
  //--------------------------------------------------

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const [taskRes, projectRes] = await Promise.all([
        axios.get(`${API_URL}/api/tasks`),
        axios.get(`${API_URL}/api/projects`),
      ]);

      setTasks(taskRes.data);
      setProjects(projectRes.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //--------------------------------------------------
  // FILTERS
  //--------------------------------------------------

  const filteredTasks = tasks.filter((task) => {
    const searchMatch = task.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const priorityMatch =
      priorityFilter === "All"
        ? true
        : task.priority === priorityFilter;

    const statusMatch =
      statusFilter === "All"
        ? true
        : task.status === statusFilter;

    return (
      searchMatch &&
      priorityMatch &&
      statusMatch
    );
  });

  const todo = filteredTasks.filter(
    (task) => task.status === "Todo"
  );

  const progress = filteredTasks.filter(
    (task) => task.status === "In Progress"
  );

  const review = filteredTasks.filter(
    (task) => task.status === "Review"
  );

  const completed = filteredTasks.filter(
    (task) => task.status === "Completed"
  );

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
  // CREATE / UPDATE
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
  // DELETE
  //--------------------------------------------------

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?"))
      return;

    try {
      await axios.delete(
        `${API_URL}/api/tasks/${id}`
      );

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  //--------------------------------------------------
  // DRAG & DROP
  //--------------------------------------------------

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const source =
      result.source.droppableId;

    const destination =
      result.destination.droppableId;

    if (source === destination) return;

    const movedTask = tasks.find(
      (task) =>
        task._id === result.draggableId
    );

    if (!movedTask) return;

    try {
      await axios.put(
        `${API_URL}/api/tasks/${movedTask._id}`,
        {
          ...movedTask,
          status: destination,
        }
      );

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  //--------------------------------------------------

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading Kanban Board...</h2>
      </div>
    );
  }

  return (
    <div className="kanban-page">

      <Sidebar />

      <div className="kanban-main">

        <Navbar />

        <div className="kanban-container">

          {/* Header */}

          <div className="kanban-header">

            <div>

              <h1>Kanban Board</h1>

              <p>
                Manage your project tasks visually
              </p>

            </div>

            <button
              className="create-btn"
              onClick={openCreateModal}
            >
              + Create Task
            </button>

          </div>

          {/* Filters */}

          <div className="kanban-toolbar">

            <input
              type="text"
              placeholder="Search Task..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option>All</option>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Review</option>
              <option>Completed</option>
            </select>

          </div>

          <DragDropContext
            onDragEnd={onDragEnd}
          >

            <div className="board-columns">
            {/* ================= TODO ================= */}

<Droppable droppableId="Todo">
  {(provided) => (
    <div
      className="board-column"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <div className="column-header todo">
        <h2>Todo</h2>
        <span>{todo.length}</span>
      </div>

      {todo.map((task, index) => (
        <Draggable
          key={task._id}
          draggableId={task._id}
          index={index}
        >
          {(provided) => (
            <div
              className="task-card"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <div className="task-project">
                📁 {task.project?.name || "General"}
              </div>

              <div className="task-footer">
                <span
                  className={`priority ${task.priority?.toLowerCase()}`}
                >
                  {task.priority}
                </span>

                <span className="due-date">
                  📅{" "}
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "No Date"}
                </span>
              </div>

              <div className="task-user">
                👤{" "}
                {task.assignee?.name ||
                  "Unassigned"}
              </div>

              <div className="task-actions">
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
          )}
        </Draggable>
      ))}

      {provided.placeholder}
    </div>
  )}
</Droppable>

{/* ================= IN PROGRESS ================= */}

<Droppable droppableId="In Progress">
  {(provided) => (
    <div
      className="board-column"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <div className="column-header progress">
        <h2>In Progress</h2>
        <span>{progress.length}</span>
      </div>

      {progress.map((task, index) => (
        <Draggable
          key={task._id}
          draggableId={task._id}
          index={index}
        >
          {(provided) => (
            <div
              className="task-card"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <div className="task-project">
                📁 {task.project?.name || "General"}
              </div>

              <div className="task-footer">
                <span
                  className={`priority ${task.priority?.toLowerCase()}`}
                >
                  {task.priority}
                </span>

                <span className="due-date">
                  📅{" "}
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "No Date"}
                </span>
              </div>

              <div className="task-user">
                👤{" "}
                {task.assignee?.name ||
                  "Unassigned"}
              </div>

              <div className="task-actions">
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
          )}
        </Draggable>
      ))}

      {provided.placeholder}
    </div>
  )}
</Droppable>
{/* ================= REVIEW ================= */}

<Droppable droppableId="Review">
  {(provided) => (
    <div
      className="board-column"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <div className="column-header review">
        <h2>Review</h2>
        <span>{review.length}</span>
      </div>

      {review.map((task, index) => (
        <Draggable
          key={task._id}
          draggableId={task._id}
          index={index}
        >
          {(provided) => (
            <div
              className="task-card"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <div className="task-project">
                📁 {task.project?.name || "General"}
              </div>

              <div className="task-footer">
                <span
                  className={`priority ${task.priority?.toLowerCase()}`}
                >
                  {task.priority}
                </span>

                <span className="due-date">
                  📅{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No Date"}
                </span>
              </div>

              <div className="task-user">
                👤 {task.assignee?.name || "Unassigned"}
              </div>

              <div className="task-actions">
                <button
                  className="edit-btn"
                  onClick={() => openEditModal(task)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Draggable>
      ))}

      {provided.placeholder}
    </div>
  )}
</Droppable>

{/* ================= COMPLETED ================= */}

<Droppable droppableId="Completed">
  {(provided) => (
    <div
      className="board-column"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <div className="column-header completed">
        <h2>Completed</h2>
        <span>{completed.length}</span>
      </div>

      {completed.map((task, index) => (
        <Draggable
          key={task._id}
          draggableId={task._id}
          index={index}
        >
          {(provided) => (
            <div
              className="task-card"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <div className="task-project">
                📁 {task.project?.name || "General"}
              </div>

              <div className="task-footer">
                <span
                  className={`priority ${task.priority?.toLowerCase()}`}
                >
                  {task.priority}
                </span>

                <span className="due-date">
                  📅{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No Date"}
                </span>
              </div>

              <div className="task-user">
                👤 {task.assignee?.name || "Unassigned"}
              </div>

              <div className="task-actions">
                <button
                  className="edit-btn"
                  onClick={() => openEditModal(task)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Draggable>
      ))}

      {provided.placeholder}
    </div>
  )}
</Droppable>

</div>

</DragDropContext>
      {/* ================= CREATE / EDIT TASK MODAL ================= */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <div
            className="task-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              {editingTask
                ? "Edit Task"
                : "Create New Task"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Title</label>

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
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  rows="4"
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Priority</label>

                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    value={taskForm.status}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Completed</option>
                  </select>
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Project</label>

                  <select
                    value={taskForm.project}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        project: e.target.value,
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
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="form-group">
                <label>Assignee ID</label>

                <input
                  type="text"
                  placeholder="Enter User ID"
                  value={taskForm.assignee}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      assignee: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-actions">

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

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingTask
                    ? "Update Task"
                    : "Create Task"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  </div>
</div>
);
}

export default KanbanBoard;