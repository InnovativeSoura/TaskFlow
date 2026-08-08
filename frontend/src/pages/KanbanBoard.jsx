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

import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/KanbanBoard.css";

/* ============================================================
   STATUS
============================================================ */

const STATUS = {
  TODO: "Todo",
  PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
};

/* ============================================================
   PRIORITIES
============================================================ */

const PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

/* ============================================================
   EMPTY TASK FORM
============================================================ */

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: PRIORITIES.MEDIUM,
  status: STATUS.TODO,
  dueDate: "",
  project: "",
  assignee: "",
};

/* ============================================================
   HELPER FUNCTIONS
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
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const getPriorityClass = (
  priority = PRIORITIES.MEDIUM
) => {
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
    task?.priority ||
    PRIORITIES.MEDIUM;

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

          {task?.status ===
            STATUS.PROGRESS && (
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
    <Droppable
      droppableId={id}
    >
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
          <header className="kanban-column-header">
            <div className="column-title-group">
              <span className="column-status-icon">
                {icon}
              </span>

              <h2>
                {title}
              </h2>

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
                  Drag a task here or
                  create a new one.
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

  const [
    editingTask,
    setEditingTask,
  ] = useState(null);

  const [saving, setSaving] =
    useState(false);

  const [taskForm, setTaskForm] =
    useState({
      ...EMPTY_FORM,
    });

  /* ==========================================================
     FETCH TASKS + PROJECTS
  ========================================================== */

  const fetchTasks = useCallback(
    async () => {
      try {
        setLoading(true);

        const [
          taskResponse,
          projectResponse,
        ] = await Promise.all([
          api.get("/tasks"),
          api.get("/projects"),
        ]);

        const taskData =
          taskResponse?.data;

        const projectData =
          projectResponse?.data;

        setTasks(
          Array.isArray(taskData)
            ? taskData
            : Array.isArray(
                taskData?.tasks
              )
            ? taskData.tasks
            : []
        );

        setProjects(
          Array.isArray(projectData)
            ? projectData
            : Array.isArray(
                projectData?.projects
              )
            ? projectData.projects
            : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch Kanban data:",
          error
        );

        setTasks([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
            task?.title?.toLowerCase() ||
            "";

          const description =
            task?.description?.toLowerCase() ||
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
            priorityFilter === "All" ||
            task?.priority ===
              priorityFilter;

          const matchesStatus =
            statusFilter === "All" ||
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
     COLUMN DATA
  ========================================================== */

  const todo = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task.status ===
          STATUS.TODO
      ),
    [filteredTasks]
  );

  const progress = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task.status ===
          STATUS.PROGRESS
      ),
    [filteredTasks]
  );

  const review = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task.status ===
          STATUS.REVIEW
      ),
    [filteredTasks]
  );

  const completed = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task.status ===
          STATUS.COMPLETED
      ),
    [filteredTasks]
  );

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const statistics =
    useMemo(() => {
      return {
        total: tasks.length,

        active: tasks.filter(
          (task) =>
            task.status ===
            STATUS.PROGRESS
        ).length,

        review: tasks.filter(
          (task) =>
            task.status ===
            STATUS.REVIEW
        ).length,

        completed: tasks.filter(
          (task) =>
            task.status ===
            STATUS.COMPLETED
        ).length,
      };
    }, [tasks]);

  /* ==========================================================
     FORM HELPERS
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

  const resetForm = () => {
    setEditingTask(null);

    setTaskForm({
      ...EMPTY_FORM,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (
    task
  ) => {
    setEditingTask(task);

    setTaskForm({
      title:
        task?.title || "",

      description:
        task?.description || "",

      priority:
        task?.priority ||
        PRIORITIES.MEDIUM,

      status:
        task?.status ||
        STATUS.TODO,

      dueDate:
        task?.dueDate
          ? String(
              task.dueDate
            ).substring(0, 10)
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

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
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

      {/* =====================================================
          PREMIUM ANIMATED BACKGROUND
          JSX ONLY — NO CSS FILE CHANGES
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
                  Visualize, organize
                  and manage your
                  project tasks.
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
                {filteredTasks.length ===
                1
                  ? "task"
                  : "tasks"}
              </span>
            </div>

            <button
              type="button"
              className="kanban-sort-btn"
            >
              <FaSortAmountDown />

              <span>
                Sort
              </span>
            </button>

          </section>

          {/* ==================================================
              BOARD
          ================================================== */}

          <DragDropContext
            onDragEnd={() => {}}
          >
            <section className="kanban-board">

              <KanbanColumn
                id={STATUS.TODO}
                title="To Do"
                tasks={todo}
                variant="todo"
                icon={<FaTasks />}
                onEdit={
                  openEditModal
                }
                onDelete={() => {}}
                onCreate={
                  openCreateModal
                }
              />

              <KanbanColumn
                id={STATUS.PROGRESS}
                title="In Progress"
                tasks={progress}
                variant="progress"
                icon={<FaClock />}
                onEdit={
                  openEditModal
                }
                onDelete={() => {}}
                onCreate={
                  openCreateModal
                }
              />

              <KanbanColumn
                id={STATUS.REVIEW}
                title="In Review"
                tasks={review}
                variant="review"
                icon={<FaEye />}
                onEdit={
                  openEditModal
                }
                onDelete={() => {}}
                onCreate={
                  openCreateModal
                }
              />

              <KanbanColumn
                id={STATUS.COMPLETED}
                title="Completed"
                tasks={completed}
                variant="completed"
                icon={<FaCheckCircle />}
                onEdit={
                  openEditModal
                }
                onDelete={() => {}}
                onCreate={
                  openCreateModal
                }
              />

            </section>
          </DragDropContext>

        </main>
      </div>

    </div>
  );
}

export default KanbanBoard;