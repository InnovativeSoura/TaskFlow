import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import MainLayout from "../layouts/MainLayout";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

import TaskFilters from "../components/tasks/TaskFilters";
import TaskModal from "../components/tasks/TaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";
import KanbanBoard from "../components/tasks/KanbanBoard";

import { useAuth } from "../context/AuthContext";

import "../styles/Tasks.css";

function Tasks() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const { user } = useAuth();

  /* =====================================================
      DATA
  ====================================================== */

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
      FILTERS
  ====================================================== */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  /* =====================================================
      VIEW
  ====================================================== */

  const [viewMode, setViewMode] = useState("kanban");

  /* =====================================================
      MODALS
  ====================================================== */

  const [modalOpen, setModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] =
    useState(false);

  /* =====================================================
      ANIMATION
  ====================================================== */

  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
      },
    },
  };
    /* =====================================================
      FETCH TASKS
  ====================================================== */

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(data.tasks || data || []);
    } catch (error) {
      console.error("Task Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* =====================================================
      CREATE / UPDATE TASK
  ====================================================== */

  const handleSave = async (taskData) => {
    try {
      setSaving(true);

      if (selectedTask) {
        await axios.put(
          `${API_URL}/api/tasks/${selectedTask._id}`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/tasks`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setModalOpen(false);
      setSelectedTask(null);

      fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
      EDIT TASK
  ====================================================== */

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  /* =====================================================
      CREATE TASK
  ====================================================== */

  const handleCreate = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  /* =====================================================
      DELETE CONFIRM
  ====================================================== */

  const confirmDelete = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  /* =====================================================
      DELETE TASK
  ====================================================== */

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await axios.delete(
        `${API_URL}/api/tasks/${selectedTask._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeleteModalOpen(false);
      setSelectedTask(null);

      fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
      UPDATE STATUS
  ====================================================== */

  const updateStatus = async (
    taskId,
    newStatus
  ) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: newStatus,
              }
            : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
    /* =====================================================
      FILTER + SORT
  ====================================================== */

  const filteredTasks = useMemo(() => {
    let data = [...tasks];

    /* Search */

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (task) =>
          task.title
            ?.toLowerCase()
            .includes(keyword) ||
          task.description
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    /* Status */

    if (statusFilter !== "All") {
      data = data.filter(
        (task) =>
          task.status === statusFilter
      );
    }

    /* Priority */

    if (priorityFilter !== "All") {
      data = data.filter(
        (task) =>
          task.priority === priorityFilter
      );
    }

    /* Sorting */

    switch (sortBy) {
      case "Oldest":
        data.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "A-Z":
        data.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "Z-A":
        data.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      case "Priority": {
        const priorityOrder = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        data.sort(
          (a, b) =>
            (priorityOrder[b.priority] || 0) -
            (priorityOrder[a.priority] || 0)
        );

        break;
      }

      case "Due Date":
        data.sort(
          (a, b) =>
            new Date(a.dueDate || 0) -
            new Date(b.dueDate || 0)
        );
        break;

      default:
        data.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    }

    return data;
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  /* =====================================================
      DASHBOARD STATISTICS
  ====================================================== */

  const stats = useMemo(() => {
    return {
      total: filteredTasks.length,

      completed: filteredTasks.filter(
        (task) =>
          task.status === "Completed"
      ).length,

      inProgress: filteredTasks.filter(
        (task) =>
          task.status === "In Progress"
      ).length,

      pending: filteredTasks.filter(
        (task) =>
          task.status === "Pending" ||
          task.status === "Todo"
      ).length,

      review: filteredTasks.filter(
        (task) =>
          task.status === "Review"
      ).length,

      critical: filteredTasks.filter(
        (task) =>
          task.priority === "Critical"
      ).length,
    };
  }, [filteredTasks]);

  /* =====================================================
      PAGINATION
  ====================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const tasksPerPage = 12;

  const totalPages = Math.ceil(
    filteredTasks.length / tasksPerPage
  );

  const paginatedTasks =
    filteredTasks.slice(
      (currentPage - 1) * tasksPerPage,
      currentPage * tasksPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  /* =====================================================
      COMPLETION %
  ====================================================== */

  const completion =
    stats.total === 0
      ? 0
      : Math.round(
          (stats.completed / stats.total) *
            100
        );
        return (
  <MainLayout>
    <motion.div
      className="tasks-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ==========================================
          HERO
      ========================================== */}

      <div className="tasks-hero">

        <div className="tasks-hero-left">

          <PageHeader
            title={`Welcome back, ${user?.name || "User"}`}
            subtitle="Manage your work efficiently with TaskFlow"
          />

          <div className="hero-badges">

            <span className="hero-chip">
              📋 {stats.total} Tasks
            </span>

            <span className="hero-chip">
              🚀 {stats.inProgress} In Progress
            </span>

            <span className="hero-chip">
              ✅ {stats.completed} Completed
            </span>

          </div>

        </div>

        <div className="hero-actions">

          <button
            className="primary-btn"
            onClick={handleCreate}
          >
            + New Task
          </button>

        </div>

      </div>

      {/* ==========================================
          STATISTICS
      ========================================== */}

      <motion.div
        className="stats-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .2 }}
      >

        <StatCard
          title="Total Tasks"
          value={stats.total}
          color="blue"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          color="green"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="orange"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          color="red"
        />

        <StatCard
          title="Critical"
          value={stats.critical}
          color="purple"
        />

      </motion.div>

      {/* ==========================================
          PROGRESS
      ========================================== */}

      <motion.div
        className="dashboard-card progress-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >

        <div className="card-header">

          <h2>Overall Completion</h2>

          <span>{completion}%</span>

        </div>

        <div className="progress-bar">

          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${completion}%`,
            }}
            transition={{
              duration: .8,
            }}
          />

        </div>

      </motion.div>

      {/* ==========================================
          FILTERS
      ========================================== */}

      <TaskFilters
        search={search}
        setSearch={setSearch}

        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}

        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}

        sortBy={sortBy}
        setSortBy={setSortBy}

        totalTasks={filteredTasks.length}
      />

      {/* ==========================================
          VIEW TOGGLE
      ========================================== */}

      <div className="task-toolbar">

        <div className="view-toggle">

          <button
            className={
              viewMode === "kanban"
                ? "active"
                : ""
            }
            onClick={() =>
              setViewMode("kanban")
            }
          >
            Kanban
          </button>

          <button
            className={
              viewMode === "list"
                ? "active"
                : ""
            }
            onClick={() =>
              setViewMode("list")
            }
          >
            List
          </button>

        </div>

      </div>
            {/* ==========================================
          CONTENT
      ========================================== */}

      <AnimatePresence mode="wait">

        {loading ? (

          <motion.div
            className="page-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="spinner" />
          </motion.div>

        ) : filteredTasks.length === 0 ? (

          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <h2>No Tasks Found</h2>

            <p>
              Create your first task to get started.
            </p>

            <button
              className="primary-btn"
              onClick={handleCreate}
            >
              Create Task
            </button>

          </motion.div>

        ) : viewMode === "kanban" ? (

          <motion.div
            key="kanban"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
          >

            <KanbanBoard
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={confirmDelete}
              onStatusChange={updateStatus}
            />

          </motion.div>

        ) : (

          <motion.div
            key="list"
            className="task-list"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >

            {paginatedTasks.map((task) => (

              <motion.div
                key={task._id}
                className="task-card"
                whileHover={{
                  y: -4,
                  scale: 1.01,
                }}
              >

                <div className="task-card-left">

                  <h3>{task.title}</h3>

                  <p>
                    {task.description ||
                      "No description"}
                  </p>

                </div>

                <div className="task-card-right">

                  <span
                    className={`badge ${task.status
                      ?.toLowerCase()
                      .replace(/\s/g, "")}`}
                  >
                    {task.status}
                  </span>

                  <span
                    className={`priority ${task.priority?.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(task)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      confirmDelete(task)
                    }
                  >
                    Delete
                  </button>

                </div>

              </motion.div>

            ))}

          </motion.div>

        )}

      </AnimatePresence>

      {/* ==========================================
          PAGINATION
      ========================================== */}

      {viewMode === "list" &&
        totalPages > 1 && (

          <div className="pagination">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) =>
                  prev - 1
                )
              }
            >
              Previous
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  prev + 1
                )
              }
            >
              Next
            </button>

          </div>

      )}

      {/* ==========================================
          MODALS
      ========================================== */}

      <TaskModal
        open={modalOpen}
        task={selectedTask}
        loading={saving}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSave}
      />

      <DeleteTaskModal
        open={deleteModalOpen}
        task={selectedTask}
        loading={deleting}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDelete}
      />

    </motion.div>

  </MainLayout>
);

}

export default Tasks;