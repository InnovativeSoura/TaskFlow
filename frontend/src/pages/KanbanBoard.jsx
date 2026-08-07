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

import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

import "../../styles/KanbanBoard.css";

/* ============================================================
   TASK CARD
============================================================ */

function TaskCard({
  task,
  index,
  onEdit,
  onDelete,
}) {
  const priority =
    task?.priority || "Medium";

  const priorityClass = priority
    .toLowerCase()
    .replace(/\s+/g, "-");

  const projectName =
    task?.project?.name ||
    task?.project?.title ||
    "General";

  const assigneeName =
    task?.assignee?.name ||
    "Unassigned";

  const dueDate = task?.dueDate
    ? new Date(task.dueDate).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : null;

  const initials = assigneeName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Draggable
      draggableId={String(task._id)}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-task-card ${
            snapshot.isDragging
              ? "is-dragging"
              : ""
          }`}
        >
          {/* ========================================
              CARD TOP
          ======================================== */}

          <div className="task-card-top">
            <span
              className={`task-priority ${priorityClass}`}
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

          {/* ========================================
              TITLE
          ======================================== */}

          <h3 className="task-card-title">
            {task?.title || "Untitled Task"}
          </h3>

          {/* ========================================
              DESCRIPTION
          ======================================== */}

          <p className="task-card-description">
            {task?.description?.trim()
              ? task.description
              : "No description available for this task."}
          </p>

          {/* ========================================
              PROJECT
          ======================================== */}

          <div className="task-project-info">
            <span className="task-project-icon">
              <FaFolderOpen />
            </span>

            <span className="task-project-name">
              {projectName}
            </span>
          </div>

          {/* ========================================
              PROGRESS
          ======================================== */}

          {task?.status === "In Progress" && (
            <div className="task-progress">
              <div className="task-progress-header">
                <span>Progress</span>
                <strong>
                  {task?.progress ?? 0}%
                </strong>
              </div>

              <div className="task-progress-track">
                <div
                  className="task-progress-fill"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        Number(task?.progress ?? 0),
                        0
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ========================================
              META
          ======================================== */}

          <div className="task-card-meta">
            {dueDate && (
              <div className="task-meta-item">
                <FaCalendarAlt />

                <span>
                  {dueDate}
                </span>
              </div>
            )}

            <div className="task-assignee">
              <span className="assignee-avatar">
                {initials || <FaUser />}
              </span>

              <span>
                {assigneeName}
              </span>
            </div>
          </div>

          {/* ========================================
              ACTIONS
          ======================================== */}

          <div className="task-card-actions">
            <button
              type="button"
              className="task-edit-action"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <FaPen />
              Edit
            </button>

            <button
              type="button"
              className="task-delete-action"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
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
          className={`kanban-column ${variant} ${
            snapshot.isDraggingOver
              ? "is-dragging-over"
              : ""
          }`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {/* ======================================
              COLUMN HEADER
          ====================================== */}

          <div className="kanban-column-header">
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
          </div>

          {/* ======================================
              TASKS
          ====================================== */}

          <div className="kanban-column-body">
            {tasks.length === 0 ? (
              <div className="kanban-empty-state">
                <div className="empty-state-icon">
                  <FaTasks />
                </div>

                <h3>No tasks yet</h3>

                <p>
                  Drag a task here or create
                  a new one.
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

          {/* ======================================
              ADD TASK
          ====================================== */}

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

  const [loading, setLoading] =
    useState(true);

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

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

  /* ==========================================================
     FETCH TASKS
  ========================================================== */

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const [taskRes, projectRes] =
        await Promise.all([
          axios.get(
            `${API_URL}/api/tasks`
          ),

          axios.get(
            `${API_URL}/api/projects`
          ),
        ]);

      setTasks(
        Array.isArray(taskRes.data)
          ? taskRes.data
          : []
      );

      setProjects(
        Array.isArray(projectRes.data)
          ? projectRes.data
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
     FILTERED TASKS
  ========================================================== */

  const filteredTasks = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return tasks.filter((task) => {
      const title =
        task?.title
          ?.toLowerCase() || "";

      const description =
        task?.description
          ?.toLowerCase() || "";

      const project =
        task?.project?.name
          ?.toLowerCase() ||
        task?.project?.title
          ?.toLowerCase() ||
        "";

      const assignee =
        task?.assignee?.name
          ?.toLowerCase() || "";

      const searchMatch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        project.includes(query) ||
        assignee.includes(query);

      const priorityMatch =
        priorityFilter === "All" ||
        task?.priority ===
          priorityFilter;

      const statusMatch =
        statusFilter === "All" ||
        task?.status === statusFilter;

      return (
        searchMatch &&
        priorityMatch &&
        statusMatch
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

  const todo = filteredTasks.filter(
    (task) => task.status === "Todo"
  );

  const progress = filteredTasks.filter(
    (task) =>
      task.status === "In Progress"
  );

  const review = filteredTasks.filter(
    (task) => task.status === "Review"
  );

  const completed = filteredTasks.filter(
    (task) =>
      task.status === "Completed"
  );

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const totalTasks = tasks.length;

  const activeTasks =
    tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length;

  const reviewTasks =
    tasks.filter(
      (task) =>
        task.status === "Review"
    ).length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  /* ==========================================================
     RESET FORM
  ========================================================== */

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

  /* ==========================================================
     CREATE MODAL
  ========================================================== */

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  /* ==========================================================
     EDIT MODAL
  ========================================================== */

  const openEditModal = (task) => {
    setEditingTask(task);

    setTaskForm({
      title: task?.title || "",
      description:
        task?.description || "",
      priority:
        task?.priority || "Medium",
      status:
        task?.status || "Todo",
      dueDate: task?.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
      project:
        task?.project?._id || "",
      assignee:
        task?.assignee?._id || "",
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
     FORM SUBMIT
  ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      alert(
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
    const confirmed =
      window.confirm(
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

      alert(
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
      destination.droppableId ===
        source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = tasks.find(
      (task) =>
        String(task._id) ===
        String(draggableId)
    );

    if (!movedTask) return;

    const newStatus =
      destination.droppableId;

    /* ==========================================
       Optimistic UI update
    ========================================== */

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        String(task._id) ===
        String(draggableId)
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
     LOADING SCREEN
  ========================================================== */

  if (loading) {
    return (
      <div className="kanban-loading-screen">
        <div className="kanban-loading-card">
          <div className="kanban-loading-spinner">
            <FaSpinner />
          </div>

          <h2>
            Loading your workspace
          </h2>

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
      <Sidebar />

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
                  Workspace
                  <FaArrowRight />
                  Tasks
                </div>

                <h1>
                  Kanban Board
                </h1>

                <p>
                  Visualize, organize and
                  manage your project tasks.
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

              <span>
                Create Task
              </span>
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
                <span>
                  Total Tasks
                </span>

                <strong>
                  {totalTasks}
                </strong>

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
                <span>
                  In Progress
                </span>

                <strong>
                  {activeTasks}
                </strong>

                <small>
                  Currently active
                </small>
              </div>
            </div>

            <div className="kanban-stat-card orange">
              <div className="stat-icon">
                <FaEye />
              </div>

              <div className="stat-content">
                <span>
                  In Review
                </span>

                <strong>
                  {reviewTasks}
                </strong>

                <small>
                  Awaiting review
                </small>
              </div>
            </div>

            <div className="kanban-stat-card green">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>

              <div className="stat-content">
                <span>
                  Completed
                </span>

                <strong>
                  {completedTasks}
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
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
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
              </div>

              <div className="kanban-select-wrapper">
                <FaTasks />

                <select
                  value={priorityFilter}
                  onChange={(e) =>
                    setPriorityFilter(
                      e.target.value
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
              <span>
                Showing
              </span>

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
              Sort
            </button>

          </section>

          {/* ==================================================
              BOARD
          ================================================== */}

          <DragDropContext
            onDragEnd={onDragEnd}
          >
            <section className="kanban-board">

              <KanbanColumn
                id="Todo"
                title="To Do"
                tasks={todo}
                variant="todo"
                icon={<FaTasks />}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onCreate={openCreateModal}
              />

              <KanbanColumn
                id="In Progress"
                title="In Progress"
                tasks={progress}
                variant="progress"
                icon={<FaClock />}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onCreate={openCreateModal}
              />

              <KanbanColumn
                id="Review"
                title="In Review"
                tasks={review}
                variant="review"
                icon={<FaEye />}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onCreate={openCreateModal}
              />

              <KanbanColumn
                id="Completed"
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

        {/* ====================================================
            CREATE / EDIT MODAL
        ==================================================== */}

        {showModal && (
          <div
            className="kanban-modal-overlay"
            onClick={closeModal}
          >
            <div
              className="kanban-task-modal"
              onClick={(e) =>
                e.stopPropagation()
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
                  <label>
                    Task Title
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Enter task title"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        title:
                          e.target.value,
                      })
                    }
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="form-group">
                  <label>
                    Description
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Describe what needs to be done..."
                    value={
                      taskForm.description
                    }
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        description:
                          e.target.value,
                      })
                    }
                  />
                </div>

                {/* PRIORITY / STATUS */}

                <div className="form-row">

                  <div className="form-group">
                    <label>
                      Priority
                    </label>

                    <select
                      value={
                        taskForm.priority
                      }
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
                  </div>

                  <div className="form-group">
                    <label>
                      Status
                    </label>

                    <select
                      value={
                        taskForm.status
                      }
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
                  </div>

                </div>

                {/* DATE / PROJECT */}

                <div className="form-row">

                  <div className="form-group">
                    <label>
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={
                        taskForm.dueDate
                      }
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          dueDate:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Project
                    </label>

                    <select
                      value={
                        taskForm.project
                      }
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

                      {projects.map(
                        (project) => (
                          <option
                            key={
                              project._id
                            }
                            value={
                              project._id
                            }
                          >
                            {project.name ||
                              project.title ||
                              "Untitled Project"}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                </div>

                {/* ASSIGNEE */}

                <div className="form-group">
                  <label>
                    Assignee ID
                  </label>

                  <input
                    type="text"
                    placeholder="Enter User ID"
                    value={
                      taskForm.assignee
                    }
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        assignee:
                          e.target.value,
                      })
                    }
                  />
                </div>

                {/* MODAL ACTIONS */}

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
    </div>
  );
}

export default KanbanBoard;