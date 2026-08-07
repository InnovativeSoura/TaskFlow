// src/pages/KanbanBoard.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEllipsisV,
  FaEye,
  FaFilter,
  FaFolderOpen,
  FaLayerGroup,
  FaPen,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTasks,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../../styles/KanbanBoard.css";

/* ============================================================
   STATUS CONSTANTS
============================================================ */

const STATUS = Object.freeze({
  TODO: "Todo",
  PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
});

/* ============================================================
   PRIORITY CONSTANTS
============================================================ */

const PRIORITY = Object.freeze({
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
});

/* ============================================================
   EMPTY TASK FORM
============================================================ */

const EMPTY_TASK_FORM = Object.freeze({
  title: "",
  description: "",
  priority: PRIORITY.MEDIUM,
  status: STATUS.TODO,
  dueDate: "",
  project: "",
  assignee: "",
});

/* ============================================================
   COLUMN CONFIGURATION
============================================================ */

const KANBAN_COLUMNS = [
  {
    id: STATUS.TODO,
    title: "To Do",
    variant: "todo",
    icon: <FaTasks />,
  },
  {
    id: STATUS.PROGRESS,
    title: "In Progress",
    variant: "progress",
    icon: <FaClock />,
  },
  {
    id: STATUS.REVIEW,
    title: "In Review",
    variant: "review",
    icon: <FaEye />,
  },
  {
    id: STATUS.COMPLETED,
    title: "Completed",
    variant: "completed",
    icon: <FaCheckCircle />,
  },
];

/* ============================================================
   HELPERS
============================================================ */

const getProjectName = (task) => {
  return (
    task?.project?.name ||
    task?.project?.title ||
    "General"
  );
};

const getAssigneeName = (task) => {
  return (
    task?.assignee?.name ||
    "Unassigned"
  );
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

const getPriorityClass = (priority = PRIORITY.MEDIUM) => {
  return priority
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const formatDueDate = (date) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

const normalizeTasksResponse = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.tasks)) {
    return data.tasks;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const normalizeProjectsResponse = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.projects)) {
    return data.projects;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

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
    task?.priority || PRIORITY.MEDIUM;

  const projectName =
    getProjectName(task);

  const assigneeName =
    getAssigneeName(task);

  const dueDate =
    formatDueDate(task?.dueDate);

  const initials =
    getInitials(assigneeName);

  const progress = Math.min(
    Math.max(
      Number(task?.progress ?? 0),
      0
    ),
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
            snapshot.isDragging
              ? "is-dragging"
              : ""
          }`}
        >
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

          <h3 className="task-card-title">
            {task?.title ||
              "Untitled Task"}
          </h3>

          <p className="task-card-description">
            {task?.description?.trim()
              ? task.description
              : "No description available for this task."}
          </p>

          <div className="task-project-info">
            <span className="task-project-icon">
              <FaFolderOpen />
            </span>

            <span className="task-project-name">
              {projectName}
            </span>
          </div>

          {task?.status === STATUS.PROGRESS && (
            <div className="task-progress">
              <div className="task-progress-header">
                <span>Progress</span>

                <strong>
                  {progress}%
                </strong>
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
                {initials || (
                  <FaUser />
                )}
              </span>

              <span>
                {assigneeName}
              </span>
            </div>
          </div>

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

              <span>
                Edit
              </span>
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
  column,
  tasks,
  onEdit,
  onDelete,
  onCreate,
}) {
  return (
    <Droppable
      droppableId={column.id}
    >
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`kanban-column ${column.variant} ${
            snapshot.isDraggingOver
              ? "is-dragging-over"
              : ""
          }`}
        >
          <header className="kanban-column-header">
            <div className="column-title-group">
              <span className="column-status-icon">
                {column.icon}
              </span>

              <h2>
                {column.title}
              </h2>

              <span className="column-count">
                {tasks.length}
              </span>
            </div>

            <button
              type="button"
              className="column-menu-btn"
              aria-label={`${column.title} options`}
            >
              <FaEllipsisV />
            </button>
          </header>

          <div className="kanban-column-body">
            {tasks.length === 0 ? (
              <div className="kanban-empty-state">
                <div className="empty-state-icon">
                  <FaTasks />
                </div>

                <h3>
                  No tasks yet
                </h3>

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
              tasks.map(
                (task, index) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )
              )
            )}

            {provided.placeholder}
          </div>

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
  const {
    token,
    isAuthenticated,
  } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [taskForm, setTaskForm] =
    useState({
      ...EMPTY_TASK_FORM,
    });

  /* ==========================================================
     AUTHENTICATION CHECK
  ========================================================== */

  const authenticated =
    Boolean(
      isAuthenticated &&
      token
    );

  /* ==========================================================
     FETCH TASKS + PROJECTS
  ========================================================== */

  const fetchKanbanData =
    useCallback(async () => {
      if (!authenticated) {
        setTasks([]);
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        /*
         * IMPORTANT:
         *
         * We intentionally use `api`
         * instead of raw axios.
         *
         * src/api/axios.js automatically
         * attaches:
         *
         * Authorization:
         * Bearer <token>
         */

        const [
          taskResponse,
          projectResponse,
        ] = await Promise.all([
          api.get("/tasks"),
          api.get("/projects"),
        ]);

        setTasks(
          normalizeTasksResponse(
            taskResponse
          )
        );

        setProjects(
          normalizeProjectsResponse(
            projectResponse
          )
        );
      } catch (error) {
        console.error(
          "Failed to fetch Kanban data:",
          error
        );

        if (
          error?.response?.status ===
          401
        ) {
          setErrorMessage(
            "Your session has expired. Please log in again."
          );
        } else {
          setErrorMessage(
            error?.response?.data
              ?.message ||
              "Unable to load Kanban data."
          );
        }
      } finally {
        setLoading(false);
      }
    }, [authenticated]);

  /* ==========================================================
     INITIAL DATA LOAD
  ========================================================== */

  useEffect(() => {
    fetchKanbanData();
  }, [fetchKanbanData]);

  /* ==========================================================
     FILTER TASKS
  ========================================================== */

  const filteredTasks =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return tasks.filter(
        (task) => {
          const title =
            task?.title
              ?.toLowerCase() ||
            "";

          const description =
            task?.description
              ?.toLowerCase() ||
            "";

          const project =
            getProjectName(task)
              .toLowerCase();

          const assignee =
            getAssigneeName(task)
              .toLowerCase();

          const matchesSearch =
            !query ||
            title.includes(query) ||
            description.includes(query) ||
            project.includes(query) ||
            assignee.includes(query);

          const matchesPriority =
            priorityFilter ===
              "All" ||
            task?.priority ===
              priorityFilter;

          const matchesStatus =
            statusFilter ===
              "All" ||
            task?.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesPriority &&
            matchesStatus
          );
        }
      );
    }, [
      tasks,
      search,
      priorityFilter,
      statusFilter,
    ]);

  /* ==========================================================
     COLUMN TASKS
  ========================================================== */

  const columnTasks =
    useMemo(() => {
      return KANBAN_COLUMNS.reduce(
        (result, column) => {
          result[column.id] =
            filteredTasks.filter(
              (task) =>
                task?.status ===
                column.id
            );

          return result;
        },
        {}
      );
    }, [filteredTasks]);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const statistics =
    useMemo(() => {
      return {
        total: tasks.length,

        active: tasks.filter(
          (task) =>
            task?.status ===
            STATUS.PROGRESS
        ).length,

        review: tasks.filter(
          (task) =>
            task?.status ===
            STATUS.REVIEW
        ).length,

        completed: tasks.filter(
          (task) =>
            task?.status ===
            STATUS.COMPLETED
        ).length,
      };
    }, [tasks]);

  /* ==========================================================
     FORM UPDATE
  ========================================================== */

  const updateForm = (
    field,
    value
  ) => {
    setTaskForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  };

  /* ==========================================================
     RESET FORM
  ========================================================== */

  const resetForm = () => {
    setEditingTask(null);

    setTaskForm({
      ...EMPTY_TASK_FORM,
    });
  };

  /* ==========================================================
     CREATE MODAL
  ========================================================== */

  const openCreateModal =
    () => {
      resetForm();
      setShowModal(true);
    };

  /* ==========================================================
     EDIT MODAL
  ========================================================== */

  const openEditModal =
    (task) => {
      setEditingTask(task);

      setTaskForm({
        title:
          task?.title || "",

        description:
          task?.description || "",

        priority:
          task?.priority ||
          PRIORITY.MEDIUM,

        status:
          task?.status ||
          STATUS.TODO,

        dueDate:
          task?.dueDate
            ? String(
                task.dueDate
              ).substring(
                0,
                10
              )
            : "",

        project:
          task?.project?._id ||
          task?.project ||
          "",

        assignee:
          task?.assignee?._id ||
          task?.assignee ||
          "",
      });

      setShowModal(true);
    };

  /* ==========================================================
     CLOSE MODAL
  ========================================================== */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  /* ==========================================================
     SAVE TASK
  ========================================================== */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!authenticated) {
        setErrorMessage(
          "You must be logged in to save a task."
        );
        return;
      }

      try {
        setSaving(true);
        setErrorMessage("");

        if (editingTask) {
          await api.put(
            `/tasks/${editingTask._id}`,
            taskForm
          );
        } else {
          await api.post(
            "/tasks",
            taskForm
          );
        }

        setShowModal(false);
        resetForm();

        await fetchKanbanData();
      } catch (error) {
        console.error(
          "Failed to save task:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            "Failed to save task."
        );
      } finally {
        setSaving(false);
      }
    };

  /* ==========================================================
     DELETE TASK
  ========================================================== */

  const deleteTask =
    async (taskId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this task?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setErrorMessage("");

        await api.delete(
          `/tasks/${taskId}`
        );

        await fetchKanbanData();
      } catch (error) {
        console.error(
          "Failed to delete task:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            "Failed to delete task."
        );
      }
    };

  /* ==========================================================
     DRAG & DROP
  ========================================================== */

  const onDragEnd =
    async (result) => {
      const {
        destination,
        source,
        draggableId,
      } = result;

      if (!destination) {
        return;
      }

      if (
        destination.droppableId ===
          source.droppableId &&
        destination.index ===
          source.index
      ) {
        return;
      }

      const movedTask =
        tasks.find(
          (task) =>
            String(
              task._id
            ) ===
            String(
              draggableId
            )
        );

      if (!movedTask) {
        return;
      }

      const newStatus =
        destination.droppableId;

      const previousTasks =
        [...tasks];

      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (task) =>
              String(
                task._id
              ) ===
              String(
                draggableId
              )
                ? {
                    ...task,
                    status:
                      newStatus,
                  }
                : task
          )
      );

      try {
        await api.put(
          `/tasks/${movedTask._id}`,
          {
            ...movedTask,
            status:
              newStatus,
          }
        );
      } catch (error) {
        console.error(
          "Failed to update task status:",
          error
        );

        setTasks(
          previousTasks
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            "Failed to move task."
        );
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
     MAIN RENDER
  ========================================================== */

  return (
    <div className="kanban-page">
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

      <Sidebar />

      <div className="kanban-main">
        <Navbar />

        <main className="kanban-container">
          {errorMessage && (
            <div className="kanban-error-banner">
              <strong>
                Unable to continue
              </strong>

              <span>
                {errorMessage}
              </span>
            </div>
          )}

          <section className="kanban-page-header">
            <div className="kanban-title-section">
              <div className="kanban-title-icon">
                <FaLayerGroup />
              </div>

              <div>
                <div className="kanban-breadcrumb">
                  <span>
                    Workspace
                  </span>

                  <FaArrowRight />

                  <span>
                    Tasks
                  </span>
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
              onClick={
                openCreateModal
              }
            >
              <span className="create-task-icon">
                <FaPlus />
              </span>

              <span>
                Create Task
              </span>
            </button>
          </section>

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
                  {statistics.total}
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
                  {statistics.active}
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
                  {statistics.review}
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
                  {statistics.completed}
                </strong>

                <small>
                  Successfully completed
                </small>
              </div>
            </div>
          </section>

          <section className="kanban-toolbar">
            <div className="kanban-search">
              <FaSearch />

              <input
                type="text"
                placeholder="Search tasks, projects or assignees..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
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
                  value={
                    statusFilter
                  }
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Status
                  </option>

                  <option
                    value={
                      STATUS.TODO
                    }
                  >
                    Todo
                  </option>

                  <option
                    value={
                      STATUS.PROGRESS
                    }
                  >
                    In Progress
                  </option>

                  <option
                    value={
                      STATUS.REVIEW
                    }
                  >
                    Review
                  </option>

                  <option
                    value={
                      STATUS.COMPLETED
                    }
                  >
                    Completed
                  </option>
                </select>
              </div>

              <div className="kanban-select-wrapper">
                <FaTasks />

                <select
                  value={
                    priorityFilter
                  }
                  onChange={(event) =>
                    setPriorityFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Priorities
                  </option>

                  <option
                    value={
                      PRIORITY.LOW
                    }
                  >
                    Low
                  </option>

                  <option
                    value={
                      PRIORITY.MEDIUM
                    }
                  >
                    Medium
                  </option>

                  <option
                    value={
                      PRIORITY.HIGH
                    }
                  >
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
                {filteredTasks.length ===
                1
                  ? "task"
                  : "tasks"}
              </span>
            </div>
          </section>

          <DragDropContext
            onDragEnd={
              onDragEnd
            }
          >
            <section className="kanban-board">
              {KANBAN_COLUMNS.map(
                (column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={
                      columnTasks[
                        column.id
                      ] || []
                    }
                    onEdit={
                      openEditModal
                    }
                    onDelete={
                      deleteTask
                    }
                    onCreate={
                      openCreateModal
                    }
                  />
                )
              )}
            </section>
          </DragDropContext>
        </main>
      </div>
    </div>
  );
}

export default KanbanBoard;