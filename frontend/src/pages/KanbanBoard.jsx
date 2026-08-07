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
  FaTimes,
  FaChevronDown,
  FaGripVertical,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../../styles/KanbanBoard.css";

/* ============================================================
   KANBAN STATUS
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
   COLUMN CONFIGURATION
============================================================ */

const KANBAN_COLUMNS = [
  {
    id: STATUS.TODO,
    title: "To Do",
    shortTitle: "To Do",
    variant: "todo",
    icon: <FaTasks />,
    description: "Tasks waiting to be started",
  },
  {
    id: STATUS.PROGRESS,
    title: "In Progress",
    shortTitle: "In Progress",
    variant: "progress",
    icon: <FaClock />,
    description: "Currently being worked on",
  },
  {
    id: STATUS.REVIEW,
    title: "In Review",
    shortTitle: "In Review",
    variant: "review",
    icon: <FaEye />,
    description: "Waiting for review",
  },
  {
    id: STATUS.COMPLETED,
    title: "Completed",
    shortTitle: "Completed",
    variant: "completed",
    icon: <FaCheckCircle />,
    description: "Successfully completed",
  },
];

/* ============================================================
   RESPONSE HELPERS
============================================================ */

/*
 * Backend responses may be:
 *
 * [
 *   {...},
 *   {...}
 * ]
 *
 * OR:
 *
 * {
 *   success: true,
 *   tasks: [...]
 * }
 *
 * OR:
 *
 * {
 *   success: true,
 *   data: [...]
 * }
 *
 * This helper keeps the Kanban page compatible with
 * the different response structures.
 */

const extractArray = (response, keys = []) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(data[key])) {
      return data[key];
    }
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
};

/* ============================================================
   PROJECT NAME
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

/* ============================================================
   ASSIGNEE NAME
============================================================ */

const getAssigneeName = (task) => {
  if (!task?.assignee) {
    return "Unassigned";
  }

  if (typeof task.assignee === "string") {
    return "Assigned User";
  }

  return task.assignee.name || "Unassigned";
};

/* ============================================================
   ASSIGNEE ID
============================================================ */

const getAssigneeId = (task) => {
  if (!task?.assignee) {
    return "";
  }

  if (typeof task.assignee === "string") {
    return task.assignee;
  }

  return task.assignee._id || "";
};

/* ============================================================
   PROJECT ID
============================================================ */

const getProjectId = (task) => {
  if (!task?.project) {
    return "";
  }

  if (typeof task.project === "string") {
    return task.project;
  }

  return task.project._id || "";
};

/* ============================================================
   USER INITIALS
============================================================ */

const getInitials = (name = "") => {
  const cleanedName = String(name)
    .trim()
    .replace(/\s+/g, " ");

  if (!cleanedName) {
    return "";
  }

  const words = cleanedName
    .split(" ")
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

/* ============================================================
   PRIORITY CSS CLASS
============================================================ */

const getPriorityClass = (
  priority = PRIORITIES.MEDIUM
) => {
  return String(priority)
    .toLowerCase()
    .replace(/\s+/g, "-");
};

/* ============================================================
   DATE FORMATTER
============================================================ */

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
   DATE STATUS
============================================================ */

const getDueDateStatus = (date) => {
  if (!date) {
    return "normal";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "normal";
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  parsedDate.setHours(0, 0, 0, 0);

  if (parsedDate < today) {
    return "overdue";
  }

  if (
    parsedDate.getTime() ===
    today.getTime()
  ) {
    return "today";
  }

  return "normal";
};

/* ============================================================
   MAIN TASK CARD
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

  const dueDateStatus =
    getDueDateStatus(task?.dueDate);

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
          className={`kanban-task-card ${
            snapshot.isDragging
              ? "is-dragging"
              : ""
          }`}
        >
          {/* =================================================
              DRAG HANDLE
          ================================================= */}

          <div
            className="task-drag-handle"
            {...provided.dragHandleProps}
            title="Drag task"
          >
            <FaGripVertical />
          </div>

          {/* =================================================
              CARD TOP
          ================================================= */}

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

          {/* =================================================
              TITLE
          ================================================= */}

          <h3 className="task-card-title">
            {task?.title ||
              "Untitled Task"}
          </h3>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="task-card-description">
            {task?.description?.trim()
              ? task.description
              : "No description available for this task."}
          </p>

          {/* =================================================
              PROJECT
          ================================================= */}

          <div className="task-project-info">
            <span className="task-project-icon">
              <FaFolderOpen />
            </span>

            <span className="task-project-name">
              {projectName}
            </span>
          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

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

          {/* =================================================
              META
          ================================================= */}

          <div className="task-card-meta">
            {dueDate && (
              <div
                className={`task-meta-item due-${dueDateStatus}`}
              >
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

          {/* =================================================
              ACTIONS
          ================================================= */}

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
    task?.assignedTo?.name ||
    "Unassigned"
  );
};

const getInitials = (name = "") => {
  if (!name || name === "Unassigned") {
    return "";
  }

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const getPriorityClass = (priority = "Medium") => {
  return String(priority)
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const formatDueDate = (date) => {
  if (!date) return null;

  try {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const getTaskId = (task) => {
  return task?._id || task?.id;
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
  const priority = task?.priority || "Medium";

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

  const taskId = getTaskId(task);

  return (
    <Draggable
      draggableId={String(taskId)}
      index={index}
    >
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={[
            "kanban-task-card",
            snapshot.isDragging
              ? "is-dragging"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* ================================================
              CARD TOP
          ================================================= */}

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
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <FaEllipsisV />
            </button>
          </div>

          {/* ================================================
              TITLE
          ================================================= */}

          <h3 className="task-card-title">
            {task?.title ||
              "Untitled Task"}
          </h3>

          {/* ================================================
              DESCRIPTION
          ================================================= */}

          <p className="task-card-description">
            {task?.description?.trim()
              ? task.description
              : "No description available for this task."}
          </p>

          {/* ================================================
              PROJECT
          ================================================= */}

          <div className="task-project-info">
            <span className="task-project-icon">
              <FaFolderOpen />
            </span>

            <span className="task-project-name">
              {projectName}
            </span>
          </div>

          {/* ================================================
              PROGRESS
          ================================================= */}

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

          {/* ================================================
              META
          ================================================= */}

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

          {/* ================================================
              ACTIONS
          ================================================= */}

          <div className="task-card-actions">
            <button
              type="button"
              className="task-edit-action"
              onClick={(event) => {
                event.stopPropagation();

                if (onEdit) {
                  onEdit(task);
                }
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

                if (
                  onDelete &&
                  taskId
                ) {
                  onDelete(taskId);
                }
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
   MAIN KANBAN BOARD
============================================================ */

function KanbanBoard() {
  const { user, token, loading: authLoading, isAuthenticated } =
    useAuth();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const [taskForm, setTaskForm] = useState({
    ...EMPTY_FORM,
  });

  /* ==========================================================
     FETCH TASKS + PROJECTS
     
     IMPORTANT:
     Use the configured `api` instance.
     
     DO NOT use:
       axios.get(...)
     
     `api` automatically attaches:
       Authorization: Bearer <token>
  ========================================================== */

  const fetchKanbanData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setTasks([]);
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      console.log("📋 Fetching Kanban data...");
      console.log("👤 User:", user?._id || user?.id);
      console.log(
        "🔐 Authentication:",
        token ? "Token available" : "Token missing"
      );

      const [taskResponse, projectResponse] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);

      /* ======================================================
         NORMALIZE TASK RESPONSE
         
         Backend may return:
           []
         
         OR:
           { success: true, tasks: [] }
         
         OR:
           { success: true, data: [] }
      ====================================================== */

      const taskPayload = taskResponse?.data;

      let receivedTasks = [];

      if (Array.isArray(taskPayload)) {
        receivedTasks = taskPayload;
      } else if (Array.isArray(taskPayload?.tasks)) {
        receivedTasks = taskPayload.tasks;
      } else if (Array.isArray(taskPayload?.data)) {
        receivedTasks = taskPayload.data;
      }

      /* ======================================================
         NORMALIZE PROJECT RESPONSE
      ====================================================== */

      const projectPayload = projectResponse?.data;

      let receivedProjects = [];

      if (Array.isArray(projectPayload)) {
        receivedProjects = projectPayload;
      } else if (Array.isArray(projectPayload?.projects)) {
        receivedProjects = projectPayload.projects;
      } else if (Array.isArray(projectPayload?.data)) {
        receivedProjects = projectPayload.data;
      }

      setTasks(receivedTasks);
      setProjects(receivedProjects);

      console.log(
        `✅ Kanban loaded: ${receivedTasks.length} tasks`
      );

      console.log(
        `📁 Projects loaded: ${receivedProjects.length}`
      );
    } catch (error) {
      console.error(
        "❌ Failed to fetch Kanban data:",
        error
      );

      /*
       * Axios interceptor already handles 401.
       * Do not manually remove the token here.
       */

      if (error.response?.status === 401) {
        console.warn(
          "⚠️ Kanban request was unauthorized."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    token,
    user,
  ]);

  /* ==========================================================
     INITIAL DATA LOAD
  ========================================================== */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchKanbanData();
  }, [
    authLoading,
    fetchKanbanData,
  ]);

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
        (task) =>
          task?.status === STATUS.TODO
      ),
    [filteredTasks]
  );

  const progress = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task?.status === STATUS.PROGRESS
      ),
    [filteredTasks]
  );

  const review = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task?.status === STATUS.REVIEW
      ),
    [filteredTasks]
  );

  const completed = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task?.status === STATUS.COMPLETED
      ),
    [filteredTasks]
  );

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const statistics = useMemo(() => {
    const total = tasks.length;

    const active = tasks.filter(
      (task) =>
        task?.status === STATUS.PROGRESS
    ).length;

    const reviewCount = tasks.filter(
      (task) =>
        task?.status === STATUS.REVIEW
    ).length;

    const completedCount = tasks.filter(
      (task) =>
        task?.status === STATUS.COMPLETED
    ).length;

    const completionRate =
      total > 0
        ? Math.round(
            (completedCount / total) * 100
          )
        : 0;

    return {
      total,
      active,
      review: reviewCount,
      completed: completedCount,
      completionRate,
    };
  }, [tasks]);

  /* ==========================================================
     FORM HELPERS
  ========================================================== */

  const updateForm = useCallback(
    (field, value) => {
      setTaskForm((current) => ({
        ...current,
        [field]: value,
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setEditingTask(null);

    setTaskForm({
      ...EMPTY_FORM,
    });
  }, []);

  /* ==========================================================
     CREATE TASK MODAL
  ========================================================== */

  const openCreateModal = useCallback(() => {
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  /* ==========================================================
     EDIT TASK MODAL
  ========================================================== */

  const openEditModal = useCallback((task) => {
    if (!task) return;

    setEditingTask(task);

    setTaskForm({
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "Medium",
      status: task?.status || STATUS.TODO,

      dueDate: task?.dueDate
        ? String(task.dueDate).substring(0, 10)
        : "",

      project:
        task?.project?._id ||
        task?.project?.id ||
        "",

      assignee:
        task?.assignee?._id ||
        task?.assignee?.id ||
        "",
    });

    setShowModal(true);
  }, []);

  /* ==========================================================
     CLOSE MODAL
  ========================================================== */

  const closeModal = useCallback(() => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  }, [
    saving,
    resetForm,
  ]);

  /* ==========================================================
     CREATE / UPDATE TASK
  ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const payload = {
        title: taskForm.title.trim(),
        description:
          taskForm.description.trim(),
        priority: taskForm.priority,
        status: taskForm.status,
        dueDate: taskForm.dueDate || null,
        project: taskForm.project || null,
        assignee: taskForm.assignee || null,
      };

      console.log(
        editingTask
          ? "✏️ Updating task..."
          : "➕ Creating task..."
      );

      if (editingTask?._id) {
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

      await fetchKanbanData();
    } catch (error) {
      console.error(
        "❌ Failed to save task:",
        error
      );

      window.alert(
        error.response?.data?.message ||
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
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/tasks/${id}`
      );

      /*
       * Optimistic local removal.
       * This makes the UI feel instant.
       */

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) =>
            String(task._id) !== String(id)
        )
      );
    } catch (error) {
      console.error(
        "❌ Failed to delete task:",
        error
      );

      window.alert(
        error.response?.data?.message ||
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

    if (!destination) {
      return;
    }

    /*
     * Nothing changed.
     */

    if (
      destination.droppableId ===
        source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = tasks.find(
      (task) =>
        String(task?._id) ===
        String(draggableId)
    );

    if (!movedTask) {
      return;
    }

    const newStatus =
      destination.droppableId;

    /*
     * Optimistic status update.
     */

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        String(task?._id) ===
        String(draggableId)
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    try {
      await api.put(
        `/tasks/${movedTask._id}`,
        {
          title: movedTask.title,
          description:
            movedTask.description || "",
          priority:
            movedTask.priority || "Medium",
          status: newStatus,
          dueDate:
            movedTask.dueDate || null,
          project:
            movedTask.project?._id ||
            movedTask.project ||
            null,
          assignee:
            movedTask.assignee?._id ||
            movedTask.assignee ||
            null,
        }
      );

      console.log(
        `✅ Task moved to ${newStatus}`
      );
    } catch (error) {
      console.error(
        "❌ Failed to update task status:",
        error
      );

      /*
       * Roll back optimistic update.
       */

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          String(task?._id) ===
          String(draggableId)
            ? {
                ...task,
                status:
                  source.droppableId,
              }
            : task
        )
      );
    }
  };

  /* ==========================================================
     AUTH LOADING
  ========================================================== */

  if (authLoading) {
    return (
      <div className="kanban-loading-screen">
        <div className="kanban-loading-card">
          <div className="kanban-loading-spinner">
            <FaSpinner />
          </div>

          <h2>
            Verifying your session
          </h2>

          <p>
            Preparing your workspace...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     NOT AUTHENTICATED
  ========================================================== */

  if (!isAuthenticated) {
    return (
      <div className="kanban-loading-screen">
        <div className="kanban-loading-card">
          <div className="kanban-loading-spinner">
            <FaUser />
          </div>

          <h2>
            Authentication required
          </h2>

          <p>
            Please sign in to access your
            Kanban workspace.
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     DATA LOADING
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

      {/* =====================================================
          PREMIUM ANIMATED BACKGROUND
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

        {/* ===================================================
            NAVBAR
        =================================================== */}

        <Navbar />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="kanban-container">

          {/* =================================================
              PAGE HERO
          ================================================= */}

          <section className="kanban-page-header">

            <div className="kanban-title-section">

              <div className="kanban-title-icon">
                <FaLayerGroup />
              </div>

              <div className="kanban-title-content">

                <div className="kanban-breadcrumb">

                  <span>
                    Workspace
                  </span>

                  <FaArrowRight />

                  <span>
                    Tasks
                  </span>

                  <FaArrowRight />

                  <strong>
                    Kanban
                  </strong>

                </div>

                <h1>
                  Kanban Board
                </h1>

                <p>
                  Visualize, organize and manage
                  your project workflow in one place.
                </p>

              </div>

            </div>

            {/* =================================================
                CREATE TASK
            ================================================= */}

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

          {/* =================================================
              WORKSPACE INSIGHT
          ================================================= */}

          <section className="kanban-workspace-summary">

            <div className="workspace-summary-left">

              <span className="workspace-summary-label">
                WORKSPACE OVERVIEW
              </span>

              <h2>
                Your team's workflow
              </h2>

              <p>
                Track progress from planning to
                completion with a visual workflow.
              </p>

            </div>

            <div className="workspace-completion">

              <div className="workspace-completion-header">

                <span>
                  Completion rate
                </span>

                <strong>
                  {statistics.completionRate}%
                </strong>

              </div>

              <div className="workspace-completion-track">

                <div
                  className="workspace-completion-fill"
                  style={{
                    width: `${statistics.completionRate}%`,
                  }}
                />

              </div>

              <small>
                {statistics.completed} of{" "}
                {statistics.total} tasks completed
              </small>

            </div>

          </section>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="kanban-statistics">

            {/* TOTAL */}

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

            {/* IN PROGRESS */}

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

            {/* REVIEW */}

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

            {/* COMPLETED */}

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

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <section className="kanban-toolbar">

            {/* SEARCH */}

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
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

            {/* FILTERS */}

            <div className="kanban-filter-group">

              {/* STATUS */}

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
                    To Do
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

              {/* PRIORITY */}

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

            {/* RESULT COUNT */}

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

            {/* SORT */}

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

          {/* =================================================
              FILTER ACTIVE STATE
          ================================================= */}

          {(search ||
            priorityFilter !== "All" ||
            statusFilter !== "All") && (

            <div className="kanban-filter-status">

              <div className="filter-status-left">

                <FaFilter />

                <span>
                  Filters active
                </span>

                {search && (
                  <span className="active-filter-chip">
                    Search: "{search}"
                  </span>
                )}

                {statusFilter !== "All" && (
                  <span className="active-filter-chip">
                    Status: {statusFilter}
                  </span>
                )}

                {priorityFilter !== "All" && (
                  <span className="active-filter-chip">
                    Priority: {priorityFilter}
                  </span>
                )}

              </div>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                }}
              >
                Clear filters
              </button>

            </div>

          )}

          {/* =================================================
              KANBAN BOARD
          ================================================= */}

          <DragDropContext
            onDragEnd={onDragEnd}
          >

            <section className="kanban-board">

              {/* =================================================
                  TODO
              ================================================= */}

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

              {/* =================================================
                  IN PROGRESS
              ================================================= */}

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

              {/* =================================================
                  REVIEW
              ================================================= */}

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

              {/* =================================================
                  COMPLETED
              ================================================= */}

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
          CREATE / EDIT TASK MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="kanban-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            className="kanban-task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kanban-modal-title"
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="kanban-modal-header">

              <div className="kanban-modal-heading">

                <span className="modal-eyebrow">
                  TASK MANAGEMENT
                </span>

                <h2 id="kanban-modal-title">
                  {editingTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>

                <p>
                  {editingTask
                    ? "Update the task details and workflow status."
                    : "Create a task and add it to your workspace workflow."}
                </p>

              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close task modal"
              >
                ×
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="kanban-task-form"
            >

              {/* =================================================
                  TASK TITLE
              ================================================= */}

              <div className="form-group">

                <label htmlFor="task-title">
                  Task Title
                  <span className="required-mark">
                    *
                  </span>
                </label>

                <input
                  id="task-title"
                  name="title"
                  type="text"
                  required
                  maxLength={120}
                  placeholder="Enter task title"
                  value={taskForm.title}
                  onChange={(event) =>
                    updateForm(
                      "title",
                      event.target.value
                    )
                  }
                  autoComplete="off"
                />

                <div className="form-field-hint">
                  {taskForm.title.length}/120
                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="form-group">

                <label htmlFor="task-description">
                  Description
                </label>

                <textarea
                  id="task-description"
                  name="description"
                  rows={4}
                  maxLength={1000}
                  placeholder="Describe what needs to be done..."
                  value={taskForm.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                />

                <div className="form-field-hint">
                  {taskForm.description.length}/1000
                </div>

              </div>

              {/* =================================================
                  PRIORITY + STATUS
              ================================================= */}

              <div className="form-row">

                {/* PRIORITY */}

                <div className="form-group">

                  <label htmlFor="task-priority">
                    Priority
                  </label>

                  <div className="form-select-container">

                    <select
                      id="task-priority"
                      name="priority"
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

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label htmlFor="task-status">
                    Status
                  </label>

                  <div className="form-select-container">

                    <select
                      id="task-status"
                      name="status"
                      value={taskForm.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target.value
                        )
                      }
                    >
                      <option value={STATUS.TODO}>
                        To Do
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

              </div>

              {/* =================================================
                  DUE DATE + PROJECT
              ================================================= */}

              <div className="form-row">

                {/* DUE DATE */}

                <div className="form-group">

                  <label htmlFor="task-due-date">
                    Due Date
                  </label>

                  <input
                    id="task-due-date"
                    name="dueDate"
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

                {/* PROJECT */}

                <div className="form-group">

                  <label htmlFor="task-project">
                    Project
                  </label>

                  <div className="form-select-container">

                    <select
                      id="task-project"
                      name="project"
                      value={taskForm.project}
                      onChange={(event) =>
                        updateForm(
                          "project",
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        No Project
                      </option>

                      {projects.map(
                        (project) => (
                          <option
                            key={
                              project._id ||
                              project.id
                            }
                            value={
                              project._id ||
                              project.id
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

              </div>

              {/* =================================================
                  ASSIGNEE
              ================================================= */}

              <div className="form-group">

                <label htmlFor="task-assignee">
                  Assignee
                </label>

                <input
                  id="task-assignee"
                  name="assignee"
                  type="text"
                  placeholder="Enter User ID"
                  value={taskForm.assignee}
                  onChange={(event) =>
                    updateForm(
                      "assignee",
                      event.target.value
                    )
                  }
                  autoComplete="off"
                />

                <div className="form-field-hint">
                  Enter the MongoDB user ID for the
                  task assignee.
                </div>

              </div>

              {/* =================================================
                  TASK PREVIEW
              ================================================= */}

              <div className="kanban-form-preview">

                <div className="form-preview-icon">
                  <FaTasks />
                </div>

                <div className="form-preview-content">

                  <span>
                    TASK PREVIEW
                  </span>

                  <strong>
                    {taskForm.title.trim() ||
                      "Untitled task"}
                  </strong>

                  <small>
                    {taskForm.status} ·{" "}
                    {taskForm.priority}
                  </small>

                </div>

              </div>

              {/* =================================================
                  MODAL ACTIONS
              ================================================= */}

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
                  disabled={
                    saving ||
                    !taskForm.title.trim()
                  }
                >
                  {saving ? (
                    <>
                      <FaSpinner className="spin" />

                      <span>
                        {editingTask
                          ? "Updating..."
                          : "Creating..."}
                      </span>
                    </>
                  ) : (
                    <>
                      {editingTask ? (
                        <FaPen />
                      ) : (
                        <FaPlus />
                      )}

                      <span>
                        {editingTask
                          ? "Update Task"
                          : "Create Task"}
                      </span>
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