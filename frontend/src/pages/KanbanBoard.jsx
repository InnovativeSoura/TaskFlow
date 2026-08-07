import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

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

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../../styles/KanbanBoard.css";

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS = {
  TODO: "Todo",
  PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
};

const PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

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
   HELPERS
============================================================ */

const getProjectName = (task) => {
  if (!task?.project) {
    return "General";
  }

  if (typeof task.project === "string") {
    return "Project";
  }

  return (
    task.project.name ||
    task.project.title ||
    "General"
  );
};

const getAssigneeName = (task) => {
  if (!task?.assignee) {
    return "Unassigned";
  }

  if (typeof task.assignee === "string") {
    return "Assigned User";
  }

  return task.assignee.name || "Unassigned";
};

const getInitials = (name = "") => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "";
  }

  return words
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

const getTaskArray = (response) => {
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

const getProjectArray = (response) => {
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
    task?.priority || PRIORITIES.MEDIUM;

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
        <motion.article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-task-card ${
            snapshot.isDragging
              ? "is-dragging"
              : ""
          }`}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          whileHover={
            snapshot.isDragging
              ? {}
              : {
                  y: -3,
                }
          }
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
              onClick={(event) =>
                event.stopPropagation()
              }
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
        </motion.article>
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
        <motion.section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`kanban-column ${variant} ${
            snapshot.isDraggingOver
              ? "is-dragging-over"
              : ""
          }`}
          animate={{
            scale: snapshot.isDraggingOver
              ? 1.008
              : 1,
          }}
          transition={{
            duration: 0.18,
          }}
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
        </motion.section>
      )}
    </Droppable>
  );
}

/* ============================================================
   ANIMATED BACKGROUND
============================================================ */

function AnimatedKanbanBackground() {
  const particles = [
    ["7%", "18%"],
    ["14%", "72%"],
    ["21%", "42%"],
    ["29%", "82%"],
    ["37%", "20%"],
    ["44%", "66%"],
    ["51%", "12%"],
    ["58%", "78%"],
    ["65%", "35%"],
    ["72%", "88%"],
    ["79%", "22%"],
    ["86%", "58%"],
    ["93%", "31%"],
    ["11%", "50%"],
    ["27%", "13%"],
    ["63%", "54%"],
    ["88%", "75%"],
    ["48%", "91%"],
  ];

  return (
    <div
      className="kanban-background"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* PURPLE ORB */}

      <motion.div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          borderRadius: "50%",
          top: -220,
          left: "8%",
          background:
            "radial-gradient(circle, rgba(124,92,255,.20) 0%, rgba(124,92,255,.08) 38%, transparent 72%)",
          filter: "blur(14px)",
        }}
        animate={{
          x: [0, 80, 20, 0],
          y: [0, 70, 20, 0],
          scale: [1, 1.1, 0.96, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* BLUE ORB */}

      <motion.div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          borderRadius: "50%",
          right: -230,
          top: "5%",
          background:
            "radial-gradient(circle, rgba(59,130,246,.15) 0%, rgba(59,130,246,.055) 38%, transparent 72%)",
          filter: "blur(18px)",
        }}
        animate={{
          x: [0, -70, -25, 0],
          y: [0, 100, 35, 0],
          scale: [1, 0.94, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* VIOLET BOTTOM ORB */}

      <motion.div
        style={{
          position: "absolute",
          width: 540,
          height: 540,
          borderRadius: "50%",
          bottom: -250,
          left: "35%",
          background:
            "radial-gradient(circle, rgba(168,85,247,.12) 0%, rgba(168,85,247,.04) 40%, transparent 72%)",
          filter: "blur(20px)",
        }}
        animate={{
          x: [0, -90, 60, 0],
          y: [0, -50, -20, 0],
          scale: [1, 1.08, 0.94, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* PARTICLES */}

      {particles.map(
        ([left, top], index) => (
          <motion.span
            key={`${left}-${top}`}
            style={{
              position: "absolute",
              left,
              top,
              width:
                index % 3 === 0
                  ? 4
                  : 3,
              height:
                index % 3 === 0
                  ? 4
                  : 3,
              borderRadius: "50%",
              background:
                index % 2 === 0
                  ? "rgba(124,92,255,.48)"
                  : "rgba(96,165,250,.38)",
              boxShadow:
                "0 0 14px rgba(124,92,255,.35)",
            }}
            animate={{
              x: [
                0,
                index % 2 === 0
                  ? 8
                  : -8,
                0,
              ],
              y: [
                0,
                -18,
                8,
                0,
              ],
              opacity: [
                0.12,
                0.7,
                0.25,
                0.12,
              ],
              scale: [
                0.7,
                1.25,
                0.8,
                0.7,
              ],
            }}
            transition={{
              duration:
                5 + (index % 5),
              delay:
                index * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      )}

      {/* GRID */}

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(
              rgba(124,92,255,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(124,92,255,.035) 1px,
              transparent 1px
            )
          `,
          backgroundSize:
            "48px 48px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 88%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 88%)",
        }}
        animate={{
          backgroundPosition: [
            "0px 0px",
            "48px 48px",
            "0px 0px",
          ],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* ATMOSPHERIC OVERLAY */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,.12) 0%, rgba(248,249,255,.035) 48%, rgba(238,241,250,.14) 100%)",
        }}
      />
    </div>
  );
}

/* ============================================================
   MAIN KANBAN BOARD
============================================================ */

function KanbanBoard() {
  const { token, isAuthenticated } =
    useAuth();

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

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingTask,
    setEditingTask,
  ] = useState(null);

  const [saving, setSaving] =
    useState(false);

  const [
    taskForm,
    setTaskForm,
  ] = useState({
    ...EMPTY_FORM,
  });

  /* ==========================================================
     FETCH DATA
  ========================================================== */

  const fetchTasks = useCallback(
    async () => {
      if (!token) {
        setTasks([]);
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [
          taskResponse,
          projectResponse,
        ] = await Promise.all([
          api.get("/tasks"),
          api.get("/projects"),
        ]);

        setTasks(
          getTaskArray(taskResponse)
        );

        setProjects(
          getProjectArray(
            projectResponse
          )
        );
      } catch (error) {
        console.error(
          "Failed to fetch Kanban data:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          console.warn(
            "Kanban request rejected: authentication token is missing or invalid."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    fetchTasks,
  ]);

  /* ==========================================================
     FILTER TASKS
  ========================================================== */

  const filteredTasks =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return tasks.filter(
        (task) => {
          const title =
            task?.title
              ?.toLowerCase() || "";

          const description =
            task?.description
              ?.toLowerCase() || "";

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
     FORM
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
      title: task?.title || "",
      description:
        task?.description || "",
      priority:
        task?.priority ||
        PRIORITIES.MEDIUM,
      status:
        task?.status ||
        STATUS.TODO,
      dueDate: task?.dueDate
        ? String(
            task.dueDate
          ).substring(0, 10)
        : "",
      project:
        typeof task?.project ===
        "object"
          ? task.project?._id ||
            ""
          : task?.project || "",
      assignee:
        typeof task?.assignee ===
        "object"
          ? task.assignee?._id ||
            ""
          : task?.assignee || "",
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
     CREATE / UPDATE
  ========================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!token) {
      window.alert(
        "Your session has expired. Please log in again."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...taskForm,
      };

      if (
        !payload.project
      ) {
        delete payload.project;
      }

      if (
        !payload.assignee
      ) {
        delete payload.assignee;
      }

      if (
        editingTask
      ) {
        await api.put(
          `/tasks/${editingTask._id}`,
          payload
        );
      } else {
        await api.post(
          "/tasks",
          payload
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
        error.response?.data
          ?.message ||
          "Failed to save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const deleteTask = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/tasks/${id}`
      );

      await fetchTasks();
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      window.alert(
        error.response?.data
          ?.message ||
          "Failed to delete task."
      );
    }
  };

  /* ==========================================================
     DRAG & DROP
  ========================================================== */

  const onDragEnd = async (
    result
  ) => {
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
          String(task._id) ===
          String(draggableId)
      );

    if (!movedTask) {
      return;
    }

    const newStatus =
      destination.droppableId;

    const previousTasks = [
      ...tasks,
    ];

    setTasks(
      (currentTasks) =>
        currentTasks.map(
          (task) =>
            String(task._id) ===
            String(draggableId)
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
          status: newStatus,
          project:
            typeof movedTask.project ===
            "object"
              ? movedTask.project?._id
              : movedTask.project,
          assignee:
            typeof movedTask.assignee ===
            "object"
              ? movedTask.assignee?._id
              : movedTask.assignee,
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

      window.alert(
        error.response?.data
          ?.message ||
          "Failed to update task status."
      );
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
          ANIMATED BACKGROUND
      ===================================================== */}

      <AnimatedKanbanBackground />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN APPLICATION
      ===================================================== */}

      <div
        className="kanban-main"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
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

            <motion.button
              type="button"
              className="create-task-btn"
              onClick={
                openCreateModal
              }
              whileHover={{
                y: -2,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span className="create-task-icon">
                <FaPlus />
              </span>

              <span>
                Create Task
              </span>
            </motion.button>
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
            onDragEnd={onDragEnd}
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
                onDelete={
                  deleteTask
                }
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
                onDelete={
                  deleteTask
                }
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
                onDelete={
                  deleteTask
                }
                onCreate={
                  openCreateModal
                }
              />

              <KanbanColumn
                id={STATUS.COMPLETED}
                title="Completed"
                tasks={completed}
                variant="completed"
                icon={
                  <FaCheckCircle />
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
                onClick={
                  closeModal
                }
                disabled={saving}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="kanban-task-form"
            >
              <div className="form-group">
                <label htmlFor="task-title">
                  Task Title
                </label>

                <input
                  id="task-title"
                  type="text"
                  required
                  placeholder="Enter task title"
                  value={
                    taskForm.title
                  }
                  onChange={(event) =>
                    updateForm(
                      "title",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-description">
                  Description
                </label>

                <textarea
                  id="task-description"
                  rows="4"
                  placeholder="Describe what needs to be done..."
                  value={
                    taskForm.description
                  }
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-priority">
                    Priority
                  </label>

                  <select
                    id="task-priority"
                    value={
                      taskForm.priority
                    }
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
                    value={
                      taskForm.status
                    }
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value
                      )
                    }
                  >
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="task-due-date">
                    Due Date
                  </label>

                  <input
                    id="task-due-date"
                    type="date"
                    value={
                      taskForm.dueDate
                    }
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
                    value={
                      taskForm.project
                    }
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

              <div className="form-group">
                <label htmlFor="task-assignee">
                  Assignee ID
                </label>

                <input
                  id="task-assignee"
                  type="text"
                  placeholder="Enter User ID"
                  value={
                    taskForm.assignee
                  }
                  onChange={(event) =>
                    updateForm(
                      "assignee",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="kanban-modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={
                    closeModal
                  }
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