import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import {
  FaPlus,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

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

  /* ===========================================================
      CONFIG
  =========================================================== */

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const { user } = useAuth();

  /* ===========================================================
      STATES
  =========================================================== */

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  /* ===========================================================
      FILTERS
  =========================================================== */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Newest");

  /* ===========================================================
      VIEW
  =========================================================== */

  const [viewMode, setViewMode] =
    useState("kanban");

  /* ===========================================================
      PAGINATION
  =========================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const TASKS_PER_PAGE = 12;

  /* ===========================================================
      MODALS
  =========================================================== */

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  /* ===========================================================
      PAGE ANIMATION
  =========================================================== */

  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: .45,
      },
    },
  };

  /* ===========================================================
      FETCH TASKS
  =========================================================== */

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

    } catch (err) {

      console.error(
        "Unable to fetch tasks",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchTasks();

  }, []);

  /* ===========================================================
      CREATE TASK
  =========================================================== */

  const handleCreate = () => {

    setSelectedTask(null);

    setModalOpen(true);

  };

  /* ===========================================================
      EDIT TASK
  =========================================================== */

  const handleEdit = (task) => {

    setSelectedTask(task);

    setModalOpen(true);

  };

  /* ===========================================================
      DELETE CONFIRM
  =========================================================== */

  const confirmDelete = (task) => {

    setSelectedTask(task);

    setDeleteModalOpen(true);

  };

  /* ===========================================================
      SAVE TASK
  =========================================================== */

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

    } catch (err) {

      console.error(err);

    } finally {

      setSaving(false);

    }

  };

  /* ===========================================================
      DELETE TASK
  =========================================================== */

  const handleDelete = async () => {

    if (!selectedTask) return;

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

    } catch (err) {

      console.error(err);

    } finally {

      setDeleting(false);

    }

  };

  /* ===========================================================
      UPDATE STATUS
  =========================================================== */

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

    } catch (err) {

      console.error(err);

    }

  };
    /* ===========================================================
      CLEAR FILTERS
  =========================================================== */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setSortBy("Newest");
  };

  /* ===========================================================
      FILTER + SORT
  =========================================================== */

  const filteredTasks = useMemo(() => {
    let data = [...tasks];

    /* ---------------- Search ---------------- */

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (task) =>
          task.title?.toLowerCase().includes(keyword) ||
          task.description
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    /* ---------------- Status ---------------- */

    if (statusFilter !== "All") {
      data = data.filter(
        (task) => task.status === statusFilter
      );
    }

    /* ---------------- Priority ---------------- */

    if (priorityFilter !== "All") {
      data = data.filter(
        (task) =>
          task.priority === priorityFilter
      );
    }

    /* ---------------- Sorting ---------------- */

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
        const priorityMap = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        data.sort(
          (a, b) =>
            (priorityMap[b.priority] || 0) -
            (priorityMap[a.priority] || 0)
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

  /* ===========================================================
      DASHBOARD STATISTICS
  =========================================================== */

  const stats = useMemo(() => {

    const completed = filteredTasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const progress = filteredTasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const review = filteredTasks.filter(
      (task) => task.status === "Review"
    ).length;

    const pending = filteredTasks.filter(
      (task) =>
        task.status === "Pending" ||
        task.status === "Todo"
    ).length;

    const critical = filteredTasks.filter(
      (task) =>
        task.priority === "Critical"
    ).length;

    const overdue = filteredTasks.filter((task) => {

      if (!task.dueDate) return false;

      return (
        new Date(task.dueDate) < new Date() &&
        task.status !== "Completed"
      );

    }).length;

    return {

      total: filteredTasks.length,

      completed,

      progress,

      review,

      pending,

      critical,

      overdue,

    };

  }, [filteredTasks]);

  /* ===========================================================
      COMPLETION %
  =========================================================== */

  const completion =
    stats.total === 0
      ? 0
      : Math.round(
          (stats.completed /
            stats.total) *
            100
        );

  /* ===========================================================
      PAGINATION
  =========================================================== */

  const totalPages = Math.ceil(
    filteredTasks.length /
      TASKS_PER_PAGE
  );

  const paginatedTasks =
    filteredTasks.slice(
      (currentPage - 1) *
        TASKS_PER_PAGE,
      currentPage *
        TASKS_PER_PAGE
    );

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);
    /* ===========================================================
      RETURN
  =========================================================== */

  return (

    <MainLayout>

      <motion.div
        className="tasks-page"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >

        {/* =====================================================
            HERO SECTION
        ====================================================== */}

        <section className="tasks-hero">

          <div className="tasks-hero-content">

            <div className="hero-left">

              <PageHeader
                title={`Welcome back, ${user?.name || "User"}`}
                subtitle="Organize, prioritize and complete your work efficiently."
              />

              <div className="hero-chips">

                <span className="hero-chip hero-blue">

                  <FaTasks />

                  {stats.total} Tasks

                </span>

                <span className="hero-chip hero-orange">

                  <FaSpinner />

                  {stats.progress} In Progress

                </span>

                <span className="hero-chip hero-green">

                  <FaCheckCircle />

                  {stats.completed} Completed

                </span>

                <span className="hero-chip hero-red">

                  <FaExclamationTriangle />

                  {stats.overdue} Overdue

                </span>

              </div>

            </div>

            <div className="hero-right">

              <button
                className="primary-btn"
                onClick={handleCreate}
              >

                <FaPlus />

                New Task

              </button>

            </div>

          </div>

        </section>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <motion.div

          className="stats-grid"

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: .15,
          }}

        >

          <StatCard
            title="Total Tasks"
            value={stats.total}
            color="blue"
            icon={<FaTasks />}
            subtitle="Current workspace"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            color="green"
            icon={<FaCheckCircle />}
            subtitle="Successfully finished"
          />

          <StatCard
            title="In Progress"
            value={stats.progress}
            color="orange"
            icon={<FaSpinner />}
            subtitle="Currently active"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            color="red"
            icon={<FaClock />}
            subtitle="Waiting to start"
          />

          <StatCard
            title="Critical"
            value={stats.critical}
            color="purple"
            icon={<FaExclamationTriangle />}
            subtitle="Needs attention"
          />

        </motion.div>

        {/* =====================================================
            PROGRESS CARD
        ====================================================== */}

        <motion.div

          className="dashboard-card progress-card"

          initial={{
            opacity: 0,
            y: 25,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: .25,
          }}

        >

          <div className="progress-header">

            <div>

              <h2>

                Workspace Progress

              </h2>

              <p>

                Overall completion across all active tasks

              </p>

            </div>

            <div className="progress-percentage">

              {completion}%

            </div>

          </div>

          <div className="progress-track">

            <motion.div

              className="progress-fill"

              initial={{
                width: 0,
              }}

              animate={{
                width: `${completion}%`,
              }}

              transition={{
                duration: 1,
              }}

            />

          </div>

        </motion.div>
                {/* =====================================================
            FILTER TOOLBAR
        ====================================================== */}

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
          onClearFilters={clearFilters}
        />

        {/* =====================================================
            VIEW TOGGLE
        ====================================================== */}

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

        {/* =====================================================
            PAGE CONTENT
        ====================================================== */}

        <AnimatePresence mode="wait">

          {/* =========================
              LOADING
          ========================= */}

          {loading ? (

            <motion.div
              className="page-loader"
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

              <div className="spinner" />

              <p>
                Loading your tasks...
              </p>

            </motion.div>

          ) :

          /* =========================
              EMPTY
          ========================= */

          filteredTasks.length === 0 ? (

            <motion.div
              className="empty-state"
              key="empty"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              <div className="empty-icon">

                <FaTasks />

              </div>

              <h2>

                No Tasks Found

              </h2>

              <p>

                Try changing your filters
                or create your first task.

              </p>

              <button
                className="primary-btn"
                onClick={handleCreate}
              >

                <FaPlus />

                Create Task

              </button>

            </motion.div>

          ) :

          /* =========================
              KANBAN
          ========================= */

          viewMode === "kanban" ? (

            <motion.div
              key="kanban"
              initial={{
                opacity: 0,
                y: 20,
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
                onUpdateStatus={
                  updateStatus
                }
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />

            </motion.div>

          ) :

          /* =========================
              LIST VIEW
          ========================= */

          (

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
                    y: -6,
                    scale: 1.01,
                  }}
                >

                  <div className="task-card-left">

                    <h3>

                      {task.title}

                    </h3>

                    <p>

                      {task.description ||
                        "No description available."}

                    </p>

                  </div>

                  <div className="task-card-right">

                    <span
                      className={`status-badge ${task.status
                        ?.toLowerCase()
                        .replace(/\s/g, "")}`}
                    >
                      {task.status}
                    </span>

                    <span
                      className={`priority-badge ${task.priority?.toLowerCase()}`}
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
                {/* =====================================================
            PAGINATION
        ====================================================== */}

        {viewMode === "list" &&
          totalPages > 1 && (

            <motion.div
              className="pagination"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                Previous
              </button>

              <div className="page-number">

                Page

                <strong>

                  {currentPage}

                </strong>

                of

                <strong>

                  {totalPages}

                </strong>

              </div>

              <button
                className="page-btn"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
              >
                Next
              </button>

            </motion.div>

          )}

        {/* =====================================================
            TASK MODAL
        ====================================================== */}

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

        {/* =====================================================
            DELETE MODAL
        ====================================================== */}

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