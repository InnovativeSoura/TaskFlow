import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaTasks,
  FaSpinner,
  FaEllipsisV,
  FaCalendarAlt,
  FaFolderOpen,
  FaUser,
  FaPen,
  FaTrashAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaArrowRight,
  FaLayerGroup,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/KanbanBoard.css";

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS = {
  TODO: "Todo",
  PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "Medium",
  status: STATUS.TODO,
  dueDate: "",
  project: "",
  assignee: "",
};

/* ============================================================
   HELPERS
============================================================ */

const getProjectName = (task) =>
  task?.project?.name ||
  task?.project?.title ||
  "General";

const getAssigneeName = (task) =>
  task?.assignee?.name ||
  "Unassigned";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

const getPriorityClass = (priority = "Medium") =>
  priority.toLowerCase().replace(/\s+/g, "-");

const formatDueDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ============================================================
   TASK CARD
============================================================ */

function TaskCard({ task, index, onEdit, onDelete }) {
  const priority = task?.priority || "Medium";
  const projectName = getProjectName(task);
  const assigneeName = getAssigneeName(task);
  const dueDate = formatDueDate(task?.dueDate);
  const initials = getInitials(assigneeName);

  const progress = Math.min(
    Math.max(Number(task?.progress ?? 0), 0),
    100
  );

  return (
    <Draggable
      draggableId={String(task._id)}
      index={index}
    >
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-task-card ${
            snapshot.isDragging ? "is-dragging" : ""
          }`}
        >
          {/* CARD HEADER */}

          <div className="task-card-top">
            <span
              className={`task-priority ${getPriorityClass(
                priority
              )}`}
            >
              {priority}
            </span>

            <button
              type="button"
              className="task-more-btn"
              aria-label="Task options"
            >
              <FaEllipsisV />
            </button>
          </div>

          {/* TITLE */}

          <h3 className="task-card-title">
            {task?.title || "Untitled Task"}
          </h3>

          {/* DESCRIPTION */}

          <p className="task-card-description">
            {task?.description?.trim()
              ? task.description
              : "No description available for this task."}
          </p>

          {/* PROJECT */}

          <div className="task-project-info">
            <span className="task-project-icon">
              <FaFolderOpen />
            </span>

            <span className="task-project-name">
              {projectName}
            </span>
          </div>

          {/* PROGRESS */}

          {task?.status === STATUS.PROGRESS && (
            <div className="task-progress">
              <div className="task-progress-header">
                <span>Progress</span>

                <strong>{progress}%</strong>
              </div>

              <div className="task-progress-track">
                <div
                  className="task-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* META */}

          <div className="task-card-meta">
            {dueDate && (
              <div className="task-meta-item">
                <FaCalendarAlt />

                <span>{dueDate}</span>
              </div>
            )}

            <div className="task-assignee">
              <span className="assignee-avatar">
                {initials || <FaUser />}
              </span>

              <span>{assigneeName}</span>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="task-card-actions">
            <button
              type="button"
              className="task-edit-action"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(task);
              }}
            >
              <FaPen />
              <span>Edit</span>
            </button>

            <button
              type="button"
              className="task-delete-action"
              aria-label="Delete task"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(task._id);
              }}
            >
              <FaTrashAlt />
            </button>
          </div>
        </article>
      )}
    </Draggable>
  );
}

/* ============================================================
   KANBAN COLUMN
============================================================ */

function KanbanColumn({
  id,
  title,
  tasks,
  variant,
  icon,
  onEdit,
  onDelete,
  onCreate,
}) {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`kanban-column ${variant} ${
            snapshot.isDraggingOver
              ? "is-dragging-over"
              : ""
          }`}
        >
          {/* COLUMN HEADER */}

          <header className="kanban-column-header">
            <div className="column-title-group">
              <span className="column-status-icon">
                {icon}
              </span>

              <h2>{title}</h2>

              <span className="column-count">
                {tasks.length}
              </span>
            </div>

            <button
              type="button"
              className="column-menu-btn"
              aria-label={`${title} options`}
            >
              <FaEllipsisV />
            </button>
          </header>

          {/* COLUMN BODY */}

          <div className="kanban-column-body">
            {tasks.length === 0 ? (
              <div className="kanban-empty-state">
                <div className="empty-state-icon">
                  <FaTasks />
                </div>

                <h3>No tasks yet</h3>

                <p>
                  Drag a task here or create a new one.
                </p>

                <button
                  type="button"
                  className="empty-add-task"
                  onClick={onCreate}
                >
                  <FaPlus />
                  Add Task
                </button>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}

            {provided.placeholder}
          </div>

          {/* COLUMN FOOTER */}

          {tasks.length > 0 && (
            <button
              type="button"
              className="column-add-task"
              onClick={onCreate}
            >
              <FaPlus />
              Add Task
            </button>
          )}
        </section>
      )}
    </Droppable>
  );
}

/* ============================================================
   MAIN KANBAN BOARD
============================================================ */

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

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const [taskForm, setTaskForm] = useState({
    ...EMPTY_FORM,
  });

  /* ==========================================================
     FETCH DATA
  ========================================================== */

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const [taskResponse, projectResponse] =
        await Promise.all([
          axios.get(`${API_URL}/api/tasks`),
          axios.get(`${API_URL}/api/projects`),
        ]);

      setTasks(
        Array.isArray(taskResponse.data)
          ? taskResponse.data
          : []
      );

      setProjects(
        Array.isArray(projectResponse.data)
          ? projectResponse.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch Kanban data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ==========================================================
     FILTER TASKS
  ========================================================== */

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const title =
        task?.title?.toLowerCase() || "";

      const description =
        task?.description?.toLowerCase() || "";

      const project =
        task?.project?.name?.toLowerCase() ||
        task?.project?.title?.toLowerCase() ||
        "";

      const assignee =
        task?.assignee?.name?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        project.includes(query) ||
        assignee.includes(query);

      const matchesPriority =
        priorityFilter === "All" ||
        task?.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        task?.status === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    tasks,
    search,
    priorityFilter,
    statusFilter,
  ]);

  /* ==========================================================
     COLUMN DATA
  ========================================================== */

  const todo = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.status === STATUS.TODO
      ),
    [filteredTasks]
  );

  const progress = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.status === STATUS.PROGRESS
      ),
    [filteredTasks]
  );

  const review = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.status === STATUS.REVIEW
      ),
    [filteredTasks]
  );

  const completed = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.status === STATUS.COMPLETED
      ),
    [filteredTasks]
  );

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const statistics = useMemo(() => {
    return {
      total: tasks.length,

      active: tasks.filter(
        (task) => task.status === STATUS.PROGRESS
      ).length,

      review: tasks.filter(
        (task) => task.status === STATUS.REVIEW
      ).length,

      completed: tasks.filter(
        (task) => task.status === STATUS.COMPLETED
      ).length,
    };
  }, [tasks]);

  /* ==========================================================
     FORM HELPERS
  ========================================================== */

  const updateForm = (field, value) => {
    setTaskForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingTask(null);
    setTaskForm({ ...EMPTY_FORM });
  };

  /* ==========================================================
     CREATE
  ========================================================== */

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  /* ==========================================================
     EDIT
  ========================================================== */

  const openEditModal = (task) => {
    setEditingTask(task);

    setTaskForm({
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "Medium",
      status: task?.status || STATUS.TODO,
      dueDate: task?.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
      project: task?.project?._id || "",
      assignee: task?.assignee?._id || "",
    });

    setShowModal(true);
  };

  /* ==========================================================
     CLOSE MODAL
  ========================================================== */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  /* ==========================================================
     SAVE TASK
  ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

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

      await fetchTasks();
    } catch (error) {
      console.error(
        "Failed to save task:",
        error
      );

      window.alert(
        "Failed to save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     DELETE TASK
  ========================================================== */

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/tasks/${id}`
      );

      await fetchTasks();
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      window.alert(
        "Failed to delete task."
      );
    }
  };

  /* ==========================================================
     DRAG & DROP
  ========================================================== */

  const onDragEnd = async (result) => {
    const {
      destination,
      source,
      draggableId,
    } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = tasks.find(
      (task) =>
        String(task._id) === String(draggableId)
    );

    if (!movedTask) return;

    const newStatus = destination.droppableId;

    /* Optimistic update */

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        String(task._id) === String(draggableId)
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    try {
      await axios.put(
        `${API_URL}/api/tasks/${movedTask._id}`,
        {
          ...movedTask,
          status: newStatus,
        }
      );
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error
      );

      await fetchTasks();
    }
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="kanban-loading-screen">
        <div className="kanban-loading-card">
          <div className="kanban-loading-spinner">
            <FaSpinner />
          </div>

          <h2>Loading your workspace</h2>

          <p>
            Preparing your Kanban board...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="kanban-page">
      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div
        className="kanban-background"
        aria-hidden="true"
      >
        <div className="kanban-bg-grid" />

        <div className="kanban-bg-orb kanban-bg-orb-1" />
        <div className="kanban-bg-orb kanban-bg-orb-2" />
        <div className="kanban-bg-orb kanban-bg-orb-3" />

        <div className="kanban-bg-glow kanban-bg-glow-1" />
        <div className="kanban-bg-glow kanban-bg-glow-2" />

        <div className="kanban-bg-noise" />
      </div>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN APPLICATION
      ===================================================== */}

      <div className="kanban-main">
        <Navbar />

        <main className="kanban-container">
          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <section className="kanban-page-header">
            <div className="kanban-title-section">
              <div className="kanban-title-icon">
                <FaLayerGroup />
              </div>

              <div>
                <div className="kanban-breadcrumb">
                  <span>Workspace</span>

                  <FaArrowRight />

                  <span>Tasks</span>
                </div>

                <h1>Kanban Board</h1>

                <p>
                  Visualize, organize and manage
                  your project tasks.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="create-task-btn"
              onClick={openCreateModal}
            >
              <span className="create-task-icon">
                <FaPlus />
              </span>

              <span>Create Task</span>
            </button>
          </section>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <section className="kanban-statistics">
            <div className="kanban-stat-card purple">
              <div className="stat-icon">
                <FaTasks />
              </div>

              <div className="stat-content">
                <span>Total Tasks</span>

                <strong>{statistics.total}</strong>

                <small>
                  All workspace tasks
                </small>
              </div>
            </div>

            <div className="kanban-stat-card blue">
              <div className="stat-icon">
                <FaClock />
              </div>

              <div className="stat-content">
                <span>In Progress</span>

                <strong>{statistics.active}</strong>

                <small>Currently active</small>
              </div>
            </div>

            <div className="kanban-stat-card orange">
              <div className="stat-icon">
                <FaEye />
              </div>

              <div className="stat-content">
                <span>In Review</span>

                <strong>{statistics.review}</strong>

                <small>Awaiting review</small>
              </div>
            </div>

            <div className="kanban-stat-card green">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>

              <div className="stat-content">
                <span>Completed</span>

                <strong>
                  {statistics.completed}
                </strong>

                <small>
                  Successfully completed
                </small>
              </div>
            </div>
          </section>

          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <section className="kanban-toolbar">
            <div className="kanban-search">
              <FaSearch />

              <input
                type="text"
                placeholder="Search tasks, projects or assignees..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="kanban-filter-group">
              <div className="kanban-select-wrapper">
                <FaFilter />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value={STATUS.TODO}>
                    Todo
                  </option>

                  <option value={STATUS.PROGRESS}>
                    In Progress
                  </option>

                  <option value={STATUS.REVIEW}>
                    Review
                  </option>

                  <option value={STATUS.COMPLETED}>
                    Completed
                  </option>
                </select>
              </div>

              <div className="kanban-select-wrapper">
                <FaTasks />

                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Priorities
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
              </div>
            </div>

            <div className="kanban-toolbar-count">
              <span>Showing</span>

              <strong>
                {filteredTasks.length}
              </strong>

              <span>
                {filteredTasks.length === 1
                  ? "task"
                  : "tasks"}
              </span>
            </div>

            <button
              type="button"
              className="kanban-sort-btn"
            >
              <FaSortAmountDown />
              <span>Sort</span>
            </button>
          </section>

          {/* ==================================================
              BOARD
          ================================================== */}

          <DragDropContext onDragEnd={onDragEnd}>
            <section className="kanban-board">
              <KanbanColumn
                id={STATUS.TODO}
                title="To Do"
                tasks={todo}
                variant="todo"
                icon={<FaTasks />}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onCreate={openCreateModal}
              />

              <KanbanColumn
                id={STATUS.PROGRESS}
                title="In Progress"
                tasks={progress}
                variant="progress"
                icon={<FaClock />}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onCreate={openCreateModal}
              />

              <KanbanColumn
                id={STATUS.REVIEW}
                title="In Review"
                tasks={review}
                variant="review"
                icon={<FaEye />}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onCreate={openCreateModal}
              />

              <KanbanColumn
                id={STATUS.COMPLETED}
                title="Completed"
                tasks={completed}
                variant="completed"
                icon={<FaCheckCircle />}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onCreate={openCreateModal}
              />
            </section>
          </DragDropContext>
        </main>
      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="kanban-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="kanban-task-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="kanban-modal-header">
              <div>
                <span className="modal-eyebrow">
                  TASK MANAGEMENT
                </span>

                <h2>
                  {editingTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>

                <p>
                  {editingTask
                    ? "Update the task details below."
                    : "Add a new task to your workspace."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="kanban-task-form"
            >
              {/* TITLE */}

              <div className="form-group">
                <label htmlFor="task-title">
                  Task Title
                </label>

                <input
                  id="task-title"
                  type="text"
                  required
                  placeholder="Enter task title"
                  value={taskForm.title}
                  onChange={(event) =>
                    updateForm(
                      "title",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* DESCRIPTION */}

              <div className="form-group">
                <label htmlFor="task-description">
                  Description
                </label>

                <textarea
                  id="task-description"
                  rows="4"
                  placeholder="Describe what needs to be done..."
                  value={taskForm.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* PRIORITY / STATUS */}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-priority">
                    Priority
                  </label>

                  <select
                    id="task-priority"
                    value={taskForm.priority}
                    onChange={(event) =>
                      updateForm(
                        "priority",
                        event.target.value
                      )
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
                </div>

                <div className="form-group">
                  <label htmlFor="task-status">
                    Status
                  </label>

                  <select
                    id="task-status"
                    value={taskForm.status}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value
                      )
                    }
                  >
                    <option value={STATUS.TODO}>
                      Todo
                    </option>

                    <option value={STATUS.PROGRESS}>
                      In Progress
                    </option>

                    <option value={STATUS.REVIEW}>
                      Review
                    </option>

                    <option value={STATUS.COMPLETED}>
                      Completed
                    </option>
                  </select>
                </div>
              </div>

              {/* DATE / PROJECT */}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-due-date">
                    Due Date
                  </label>

                  <input
                    id="task-due-date"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(event) =>
                      updateForm(
                        "dueDate",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="task-project">
                    Project
                  </label>

                  <select
                    id="task-project"
                    value={taskForm.project}
                    onChange={(event) =>
                      updateForm(
                        "project",
                        event.target.value
                      )
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
                        {project.name ||
                          project.title ||
                          "Untitled Project"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ASSIGNEE */}

              <div className="form-group">
                <label htmlFor="task-assignee">
                  Assignee ID
                </label>

                <input
                  id="task-assignee"
                  type="text"
                  placeholder="Enter User ID"
                  value={taskForm.assignee}
                  onChange={(event) =>
                    updateForm(
                      "assignee",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* ACTIONS */}

              <div className="kanban-modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaPlus />

                      {editingTask
                        ? "Update Task"
                        : "Create Task"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;