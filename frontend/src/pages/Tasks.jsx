import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import {
  FaPlus,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
  FaRocket,
  FaThLarge,
  FaList,
} from "react-icons/fa";

import { FaArrowTrendUp } from "react-icons/fa6";

import MainLayout from "../layouts/MainLayout";

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
  ===================================================== */

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
      FILTERS
  ===================================================== */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  /* =====================================================
      VIEW
  ===================================================== */

  const [viewMode, setViewMode] = useState("kanban");

  /* =====================================================
      MODALS
  ===================================================== */

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =====================================================
      PAGE ANIMATION
  ===================================================== */

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
  ===================================================== */

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* =====================================================
      CREATE / UPDATE
  ===================================================== */

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

  /* =====================================================
      EDIT
  ===================================================== */

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  /* =====================================================
      CREATE
  ===================================================== */

  const handleCreate = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  /* =====================================================
      DELETE
  ===================================================== */

  const confirmDelete = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

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
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
      UPDATE STATUS
  ===================================================== */

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

  /* =====================================================
      FILTER + SORT
  ===================================================== */

  const filteredTasks = useMemo(() => {
    let data = [...tasks];

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

    if (statusFilter !== "All") {
      data = data.filter(
        (task) =>
          task.status === statusFilter
      );
    }

    if (priorityFilter !== "All") {
      data = data.filter(
        (task) =>
          task.priority === priorityFilter
      );
    }

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
      STATISTICS
  ===================================================== */

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

  const completion =
    stats.total === 0
      ? 0
      : Math.round(
          (stats.completed / stats.total) *
            100
        );

  const productivityScore = Math.min(
    100,
    Math.round(
      completion * 0.7 +
      (stats.inProgress /
        Math.max(stats.total, 1)) *
        30
    )
  );

  /* =====================================================
      PAGINATION
  ===================================================== */

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
      JSX
  ===================================================== */

  return (
    <MainLayout>
  <motion.div
    className="tasks-page"
    variants={pageVariants}
    initial="hidden"
    animate="visible"
  >

    {/* =====================================================
                        PREMIUM HERO
    ====================================================== */}

    <section className="tasks-hero">

      <div className="hero-overlay" />

      <div className="hero-left">

        <span className="hero-badge">
          <FaRocket />
          Premium Workspace
        </span>

        <h1>
          Welcome back,
          <span>
            {" "}
            {user?.name || "User"}
          </span>
        </h1>

        <p>
          Manage projects, organize tasks,
          collaborate with your team and
          increase productivity with your
          intelligent TaskFlow workspace.
        </p>

        <motion.button
          className="create-task-btn"
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={handleCreate}
        >
          <FaPlus />
          Create New Task
        </motion.button>

      </div>

      <div className="hero-right">

        <div className="workspace-summary">

          <div>

            <small>
              Workspace Score
            </small>

            <h2>
              {productivityScore}%
            </h2>

          </div>

          <FaArrowTrendUp />

        </div>

        <div className="workspace-progress">

          <div className="workspace-progress-track">

            <motion.div
              className="workspace-progress-fill"
              initial={{
                width: 0,
              }}
              animate={{
                width: `${productivityScore}%`,
              }}
              transition={{
                duration: 1,
              }}
            />

          </div>

        </div>

        <div className="workspace-stats">

          <div>

            <span>
              Completed
            </span>

            <strong>
              {stats.completed}
            </strong>

          </div>

          <div>

            <span>
              Active
            </span>

            <strong>
              {stats.inProgress}
            </strong>

          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {stats.pending}
            </strong>

          </div>

        </div>

      </div>

    </section>

    {/* =====================================================
                        STATISTICS
    ====================================================== */}

    <section className="tasks-stats">

      <StatCard
        title="Tasks"
        value={stats.total}
        subtitle="Total Tasks"
        icon={<FaTasks />}
        color="blue"
      />

      <StatCard
        title="Completed"
        value={stats.completed}
        subtitle="Finished"
        icon={<FaCheckCircle />}
        color="green"
      />

      <StatCard
        title="In Progress"
        value={stats.inProgress}
        subtitle="Running"
        icon={<FaChartLine />}
        color="orange"
      />

      <StatCard
        title="Pending"
        value={stats.pending}
        subtitle="Waiting"
        icon={<FaClock />}
        color="purple"
      />

      <StatCard
        title="Critical"
        value={stats.critical}
        subtitle="High Priority"
        icon={<FaExclamationTriangle />}
        color="red"
      />

    </section>

    {/* =====================================================
                        ANALYTICS
    ====================================================== */}

    <section className="task-insights">

      <motion.div
        className="insight-card"
        whileHover={{
          y: -5,
        }}
      >

        <FaChartLine />

        <div>

          <h2>
            {completion}%
          </h2>

          <p>
            Overall Completion
          </p>

        </div>

      </motion.div>

      <motion.div
        className="insight-card"
        whileHover={{
          y: -5,
        }}
      >

        <FaClock />

        <div>

          <h2>
            {stats.pending}
          </h2>

          <p>
            Pending Tasks
          </p>

        </div>

      </motion.div>

      <motion.div
        className="insight-card"
        whileHover={{
          y: -5,
        }}
      >

        <FaExclamationTriangle />

        <div>

          <h2>
            {stats.critical}
          </h2>

          <p>
            Critical Tasks
          </p>

        </div>

      </motion.div>

    </section>

    {/* =====================================================
                        FILTERS
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
    />

    {/* =====================================================
                        TOOLBAR
    ====================================================== */}

    <section className="tasks-toolbar">

      <div className="tasks-count">

        <strong>
          {filteredTasks.length}
        </strong>

        {" "}
        Task
        {filteredTasks.length !== 1 && "s"}

      </div>

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
          <FaThLarge />
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
          <FaList />
        </button>

      </div>

    </section>

    {/* =====================================================
                        CONTENT
    ====================================================== */}

    <AnimatePresence mode="wait">

      {loading ? (

        <motion.div
          className="tasks-loading"
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

          <div className="loader" />

          <p>
            Loading Tasks...
          </p>

        </motion.div>

      ) : filteredTasks.length === 0 ? (

        <motion.div
          className="tasks-empty"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <FaTasks className="empty-icon" />

          <h2>
            No Tasks Found
          </h2>

          <p>
            Create your first task and
            start organizing your workflow.
          </p>

          <button
            className="create-task-btn"
            onClick={handleCreate}
          >

            <FaPlus />

            Create Task

          </button>

        </motion.div>

      ) : viewMode === "kanban" ? (

        <motion.div
          key="kanban"
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
        >
                    {paginatedTasks.map((task) => (

            <motion.div
              key={task._id}
              className="task-card"
              whileHover={{
                y: -5,
                scale: 1.01,
              }}
              layout
            >

              <div className="task-card-left">

                <div className="task-title-row">

                  <h3>
                    {task.title}
                  </h3>

                  <span
                    className={`task-status ${task.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {task.status}
                  </span>

                </div>

                <p>
                  {task.description ||
                    "No description available."}
                </p>

                <div className="task-meta">

                  <span
                    className={`priority-badge ${task.priority?.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  {task.dueDate && (

                    <span className="task-date">

                      Due :

                      {" "}

                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}

                    </span>

                  )}

                </div>

              </div>

              <div className="task-card-actions">

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
    ===================================================== */}

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

        {Array.from(
          {
            length: totalPages,
          },
          (_, index) => (

            <button
              key={index}
              className={
                currentPage === index + 1
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCurrentPage(index + 1)
              }
            >
              {index + 1}
            </button>

          )
        )}

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

    {/* =====================================================
                        MODALS
    ===================================================== */}

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