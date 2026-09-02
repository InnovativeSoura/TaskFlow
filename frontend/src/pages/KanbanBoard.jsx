import { useCallback, useEffect, useMemo, useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import {
  FaArchive,
  FaBars,
  FaBell,
  FaBolt,
  FaCalendarAlt,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaClock,
  FaCog,
  FaEllipsisV,
  FaFilter,
  FaFlag,
  FaFolderOpen,
  FaGripVertical,
  FaLayerGroup,
  FaList,
  FaPlus,
  FaRocket,
  FaSearch,
  FaSlidersH,
  FaTasks,
  FaThLarge,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import api from "../api/axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import TaskModal from "../components/tasks/TaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

import "../styles/KanbanBoard.css";

const COLUMNS = [
  {
    id: "To Do",
    title: "To Do",
    shortTitle: "To Do",
    icon: FaTasks,
    className: "todo",
    description: "Tasks waiting to be started.",
  },

  {
    id: "In Progress",
    title: "In Progress",
    shortTitle: "In Progress",
    icon: FaRocket,
    className: "progress",
    description: "Tasks currently being worked on.",
  },

  {
    id: "Review",
    title: "In Review",
    shortTitle: "In Review",
    icon: FaClock,
    className: "review",
    description: "Tasks waiting for review.",
  },

  {
    id: "Completed",
    title: "Completed",
    shortTitle: "Completed",
    icon: FaCheckCircle,
    className: "completed",
    description: "Successfully completed tasks.",
  },
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const normalizeStatus = (status) => {
  if (!status) return "To Do";

  if (status === "Pending") {
    return "To Do";
  }

  if (status === "Review") {
    return "Review";
  }

  if (status === "In Review") {
    return "Review";
  }

  return status;
};

const getTaskId = (task) => {
  return task?._id || task?.id;
};

const getProjectName = (task) => {
  if (!task?.project) return "No project";

  if (typeof task.project === "string") {
    return "Project";
  }

  return task.project.title || task.project.name || "Untitled Project";
};

const getAssigneeName = (task) => {
  if (!task?.assignedTo) {
    return "Unassigned";
  }

  if (typeof task.assignedTo === "string") {
    return "Assigned";
  }

  return task.assignedTo.name || task.assignedTo.username || "User";
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (date) => {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (date, status) => {
  if (!date || status === "Completed") {
    return false;
  }

  const due = new Date(date);
  const today = new Date();

  due.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);

  return due < today;
};

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] = useState([]);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [priorityFilter, setPriorityFilter] = useState("All");

  const [sortBy, setSortBy] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  const [viewMode, setViewMode] = useState("board");

  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks");

      const incomingTasks = response?.data?.tasks || response?.data?.data || [];

      const normalizedTasks = incomingTasks.map((task) => ({
        ...task,
        status: normalizeStatus(task.status),
      }));

      setTasks(normalizedTasks);
    } catch (error) {
      console.error("Kanban load tasks:", error);

      toast.error(error?.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      const response = await api.get("/projects");

      const data = response?.data?.projects || response?.data?.data || [];

      setProjects(data);
    } catch (error) {
      console.error("Kanban load projects:", error);

      setProjects([]);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await api.get("/users");

      const data = response?.data?.users || response?.data?.data || [];

      setUsers(data);
    } catch (error) {
      console.error("Kanban load users:", error);

      setUsers([]);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadProjects();
    loadUsers();
  }, [loadTasks, loadProjects, loadUsers]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((task) => {
        const title = task.title?.toLowerCase() || "";

        const description = task.description?.toLowerCase() || "";

        const project = getProjectName(task).toLowerCase();

        const assignee = getAssigneeName(task).toLowerCase();

        return (
          title.includes(searchValue) ||
          description.includes(searchValue) ||
          project.includes(searchValue) ||
          assignee.includes(searchValue)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (task) => normalizeStatus(task.status) === statusFilter,
      );
    }

    if (priorityFilter !== "All") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortBy === "dueSoon") {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;

        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

        return aDate - bDate;
      }

      if (sortBy === "priority") {
        const priorityOrder = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  const getColumnTasks = useCallback(
    (columnId) => {
      return filteredTasks.filter(
        (task) => normalizeStatus(task.status) === columnId,
      );
    },
    [filteredTasks],
  );

  const stats = useMemo(() => {
    const total = tasks.length;

    const todo = tasks.filter(
      (task) => normalizeStatus(task.status) === "To Do",
    ).length;

    const progress = tasks.filter(
      (task) => normalizeStatus(task.status) === "In Progress",
    ).length;

    const review = tasks.filter(
      (task) => normalizeStatus(task.status) === "Review",
    ).length;

    const completed = tasks.filter(
      (task) => normalizeStatus(task.status) === "Completed",
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      todo,
      progress,
      review,
      completed,
      completionRate,
    };
  }, [tasks]);

  const handleCreateTask = () => {
    setSelectedTask(null);

    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);

    setTaskModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);

    setDeleteModalOpen(true);
  };

  const handleSaveTask = async (form) => {
    try {
      setSaving(true);

      const payload = {
        title: form.title,

        description: form.description || "",

        project: form.project || null,

        assignedTo: form.assignee || null,

        priority: form.priority || "Medium",

        status: normalizeStatus(form.status),

        progress: Number(form.progress || 0),

        dueDate: form.dueDate || null,
      };

      if (selectedTask) {
        const response = await api.put(
          `/tasks/${getTaskId(selectedTask)}`,
          payload,
        );

        const updatedTask = response?.data?.task;

        if (updatedTask) {
          setTasks((prev) =>
            prev.map((task) =>
              getTaskId(task) === getTaskId(selectedTask)
                ? {
                    ...updatedTask,
                    status: normalizeStatus(updatedTask.status),
                  }
                : task,
            ),
          );
        } else {
          await loadTasks();
        }

        toast.success("Task updated successfully.");
      } else {
        const response = await api.post("/tasks", payload);

        const createdTask = response?.data?.task;

        if (createdTask) {
          setTasks((prev) => [
            {
              ...createdTask,
              status: normalizeStatus(createdTask.status),
            },
            ...prev,
          ]);
        } else {
          await loadTasks();
        }

        toast.success("Task created successfully.");
      }

      setTaskModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Save task:", error);

      toast.error(error?.response?.data?.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask) return;

    try {
      setSaving(true);

      await api.delete(`/tasks/${getTaskId(selectedTask)}`);

      setTasks((prev) =>
        prev.filter((task) => getTaskId(task) !== getTaskId(selectedTask)),
      );

      toast.success("Task deleted successfully.");

      setDeleteModalOpen(false);

      setSelectedTask(null);
    } catch (error) {
      console.error("Delete task:", error);

      toast.error(error?.response?.data?.message || "Unable to delete task.");
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const newStatus = destination.droppableId;

    const task = tasks.find(
      (item) => String(getTaskId(item)) === String(draggableId),
    );

    if (!task) {
      return;
    }

    const currentStatus = normalizeStatus(task.status);

    if (currentStatus === newStatus) {
      return;
    }

    setTasks((prev) =>
      prev.map((item) =>
        String(getTaskId(item)) === String(draggableId)
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );

    try {
      await api.patch(`/tasks/${draggableId}/status`, {
        status: newStatus,
      });

      toast.success(`Moved to ${newStatus}.`, {
        autoClose: 1400,
      });
    } catch (error) {
      console.error("Move task:", error);

      /* Rollback */

      setTasks((prev) =>
        prev.map((item) =>
          String(getTaskId(item)) === String(draggableId)
            ? {
                ...item,
                status: currentStatus,
              }
            : item,
        ),
      );

      toast.error(error?.response?.data?.message || "Unable to move task.");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setSortBy("newest");
  };

  return (
    <div className="kanban-page">
      <div className="kanban-background">
        <div className="kanban-grid" />

        <div className="kanban-orb kanban-orb-one" />

        <div className="kanban-orb kanban-orb-two" />

        <div className="kanban-orb kanban-orb-three" />

        <div className="kanban-stars" />
      </div>

      <Sidebar />

      <div className="kanban-content-shell">
        <Navbar />

        <main className="kanban-main">
          <section className="kanban-hero">
            <div className="kanban-hero-left">
              <motion.div
                className="kanban-hero-icon"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
              >
                <FaLayerGroup />
              </motion.div>

              <div className="kanban-hero-copy">
                <div className="kanban-breadcrumb">
                  <span>WORKSPACE</span>

                  <b>›</b>

                  <strong>TASKS</strong>
                </div>

                <h1>Kanban Board</h1>

                <p>Visualize, organize and manage your project tasks.</p>
              </div>
            </div>

            <motion.button
              className="kanban-create-button"
              type="button"
              onClick={handleCreateTask}
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span className="create-button-icon">
                <FaPlus />
              </span>

              <span>Create Task</span>
            </motion.button>
          </section>

          <section className="kanban-stats">
            <StatCard
              icon={FaTasks}
              title="Total Tasks"
              value={stats.total}
              description="All workspace tasks"
              className="purple"
            />

            <StatCard
              icon={FaBolt}
              title="In Progress"
              value={stats.progress}
              description="Currently active"
              className="blue"
            />

            <StatCard
              icon={FaClock}
              title="In Review"
              value={stats.review}
              description="Awaiting review"
              className="orange"
            />

            <StatCard
              icon={FaCheckCircle}
              title="Completed"
              value={stats.completed}
              description="Successfully completed"
              className="green"
            />
          </section>

          <section className="kanban-toolbar">
            <div className="toolbar-search">
              <FaSearch />

              <input
                type="text"
                placeholder="Search tasks, projects or assignees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="toolbar-control">
              <FaFilter />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>

                <option value="To Do">To Do</option>

                <option value="In Progress">In Progress</option>

                <option value="Review">In Review</option>

                <option value="Completed">Completed</option>
              </select>

              <FaChevronDown />
            </div>

            <div className="toolbar-control">
              <FaFlag />

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>

                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>

              <FaChevronDown />
            </div>

            <div className="toolbar-count">
              Showing
              <strong>{filteredTasks.length}</strong>
              tasks
            </div>

            <div className="toolbar-control sort-control">
              <FaSlidersH />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort: Newest</option>

                <option value="oldest">Sort: Oldest</option>

                <option value="dueSoon">Sort: Due Date</option>

                <option value="priority">Sort: Priority</option>
              </select>

              <FaChevronDown />
            </div>

            <button
              type="button"
              className={`toolbar-icon-button ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters((prev) => !prev)}
              title="More filters"
            >
              <FaSlidersH />
            </button>

            <div className="toolbar-view-toggle">
              <button
                type="button"
                className={viewMode === "board" ? "active" : ""}
                onClick={() => setViewMode("board")}
              >
                <FaThLarge />
              </button>

              <button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                <FaList />
              </button>
            </div>
          </section>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="advanced-filters"
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
              >
                <div>
                  <span>
                    <FaArchive />
                    Completion
                  </span>

                  <strong>{stats.completionRate}%</strong>
                </div>

                <div>
                  <span>
                    <FaCalendarAlt />
                    Active tasks
                  </span>

                  <strong>{stats.todo + stats.progress + stats.review}</strong>
                </div>

                <div>
                  <span>
                    <FaCheck />
                    Completed
                  </span>

                  <strong>{stats.completed}</strong>
                </div>

                <button type="button" onClick={resetFilters}>
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {viewMode === "board" ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <section className="kanban-board">
                {COLUMNS.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={getColumnTasks(column.id)}
                    loading={loading}
                    onCreate={handleCreateTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </section>
            </DragDropContext>
          ) : (
            <TaskListView
              tasks={filteredTasks}
              loading={loading}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </main>
      </div>

      <TaskModal
        open={taskModalOpen}
        task={selectedTask}
        projects={projects}
        users={users}
        loading={saving}
        onClose={() => {
          if (!saving) {
            setTaskModalOpen(false);
            setSelectedTask(null);
          }
        }}
        onSave={handleSaveTask}
      />

      <DeleteTaskModal
        open={deleteModalOpen}
        task={selectedTask}
        loading={saving}
        onClose={() => {
          if (!saving) {
            setDeleteModalOpen(false);
            setSelectedTask(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function StatCard({ icon: Icon, title, value, description, className }) {
  return (
    <motion.div
      className={`kanban-stat-card ${className}`}
      whileHover={{
        y: -3,
      }}
    >
      <div className="stat-card-icon">
        <Icon />
      </div>

      <div className="stat-card-content">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>

      <div className="stat-card-glow" />
    </motion.div>
  );
}

function KanbanColumn({ column, tasks, loading, onCreate, onEdit, onDelete }) {
  const Icon = column.icon;

  return (
    <div className={`kanban-column ${column.className}`}>
      <div className="column-top-line" />

      {/* HEADER */}

      <div className="column-header">
        <div className="column-title">
          <div className="column-icon">
            <Icon />
          </div>

          <h3>{column.shortTitle}</h3>

          <span className="column-count">{tasks.length}</span>
        </div>

        <button type="button" className="column-menu" title="Column options">
          <FaEllipsisV />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`column-drop-area ${
              snapshot.isDraggingOver ? "dragging-over" : ""
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {loading ? (
              <ColumnLoading />
            ) : tasks.length ? (
              tasks.map((task, index) => (
                <Draggable
                  key={String(getTaskId(task))}
                  draggableId={String(getTaskId(task))}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <TaskCard
                      task={task}
                      provided={provided}
                      snapshot={snapshot}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  )}
                </Draggable>
              ))
            ) : (
              <EmptyColumn column={column} onCreate={onCreate} />
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function TaskCard({ task, provided, snapshot, onEdit, onDelete }) {
  const priority = task.priority || "Medium";

  const status = normalizeStatus(task.status);

  const assignee = getAssigneeName(task);

  const dueDate = formatDate(task.dueDate);

  const overdue = isOverdue(task.dueDate, status);

  return (
    <motion.article
      className={`kanban-task-card ${snapshot.isDragging ? "is-dragging" : ""}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      layout
    >
      <div className="task-card-top">
        <span className={`task-priority priority-${priority.toLowerCase()}`}>
          <FaFlag />

          {priority}
        </span>

        <div className="task-card-actions">
          <button
            type="button"
            title="Edit task"
            onClick={(e) => {
              e.stopPropagation();

              onEdit(task);
            }}
          >
            <FaCog />
          </button>

          <button
            type="button"
            title="Delete task"
            onClick={(e) => {
              e.stopPropagation();

              onDelete(task);
            }}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <h4 className="task-card-title">{task.title || "Untitled Task"}</h4>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-project">
        <FaFolderOpen />

        <span>{getProjectName(task)}</span>
      </div>

      <div className="task-card-progress">
        <div className="progress-header">
          <span>Progress</span>

          <strong>{task.progress || 0}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, Number(task.progress || 0)),
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="task-card-footer">
        <div className="task-assignee">
          <div className="assignee-avatar">{getInitials(assignee)}</div>

          <span>{assignee}</span>
        </div>

        {dueDate && (
          <div className={`task-due ${overdue ? "overdue" : ""}`}>
            <FaCalendarAlt />

            {dueDate}
          </div>
        )}
      </div>

      <div className="task-drag-handle">
        <FaGripVertical />
      </div>
    </motion.article>
  );
}

function EmptyColumn({ column, onCreate }) {
  const Icon = column.icon;

  return (
    <div className="empty-column">
      <motion.div
        className="empty-icon"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon />

        <span />
      </motion.div>

      <h4>No tasks yet</h4>

      <p>Drag a task here or create a new one.</p>

      <button type="button" className="empty-add-button" onClick={onCreate}>
        <FaPlus />
        Add Task
      </button>
    </div>
  );
}

function ColumnLoading() {
  return (
    <div className="column-loading">
      <span />
      <span />
      <span />

      <p>Loading tasks...</p>
    </div>
  );
}

function TaskListView({ tasks, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="task-list-loading">
        <FaTasks />
        Loading tasks...
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="task-list-empty">
        <div>
          <FaTasks />
        </div>

        <h3>No tasks found</h3>

        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="task-list-view">
      <div className="task-list-header">
        <span>Task</span>

        <span>Status</span>

        <span>Priority</span>

        <span>Assignee</span>

        <span>Due</span>

        <span>Actions</span>
      </div>

      {tasks.map((task) => {
        const status = normalizeStatus(task.status);

        const assignee = getAssigneeName(task);

        return (
          <motion.div className="task-list-row" key={getTaskId(task)} layout>
            <div className="list-task-name">
              <div className="list-task-icon">
                <FaTasks />
              </div>

              <div>
                <strong>{task.title}</strong>

                <small>{getProjectName(task)}</small>
              </div>
            </div>

            <div>
              <span
                className={`list-status status-${status
                  .toLowerCase()
                  .replace(/\s/g, "-")}`}
              >
                {status === "Review" ? "In Review" : status}
              </span>
            </div>

            <div>
              <span
                className={`task-priority priority-${(
                  task.priority || "Medium"
                ).toLowerCase()}`}
              >
                <FaFlag />

                {task.priority || "Medium"}
              </span>
            </div>

            <div className="list-assignee">
              <div className="assignee-avatar">{getInitials(assignee)}</div>

              {assignee}
            </div>

            <div>{formatDate(task.dueDate) || "—"}</div>

            <div className="list-actions">
              <button type="button" onClick={() => onEdit(task)}>
                <FaCog />
              </button>

              <button type="button" onClick={() => onDelete(task)}>
                <FaTimes />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
