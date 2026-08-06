import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import {
  FaTasks,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaChartLine,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

import TaskFilters from "../components/tasks/TaskFilters";
import KanbanBoard from "../components/tasks/KanbanBoard";
import TaskModal from "../components/tasks/TaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

import { useAuth } from "../context/AuthContext";

import "../styles/Tasks.css";

function Tasks() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const { user } = useAuth();

  /* =========================================================
      TASK DATA
  ========================================================= */

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
      FILTERS
  ========================================================= */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState("Newest");

  /* =========================================================
      VIEW MODE
  ========================================================= */

  const [viewMode, setViewMode] = useState("kanban");

  /* =========================================================
      MODALS
  ========================================================= */

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =========================================================
      PAGINATION
  ========================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 10;

  /* =========================================================
      PAGE ANIMATION
  ========================================================= */

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

  /* =========================================================
      FETCH TASKS
  ========================================================= */

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
      console.error("Task Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* =========================================================
      FILTERED TASKS
  ========================================================= */

  const filteredTasks = useMemo(() => {
    let data = [...tasks];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (task) =>
          task.title?.toLowerCase().includes(keyword) ||
          task.description?.toLowerCase().includes(keyword)
      );
    }

    if (status !== "All") {
      data = data.filter((task) => task.status === status);
    }

    if (priority !== "All") {
      data = data.filter(
        (task) => task.priority === priority
      );
    }

    switch (sort) {
      case "Oldest":
        data.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "Priority": {
        const order = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        data.sort(
          (a, b) =>
            (order[b.priority] || 0) -
            (order[a.priority] || 0)
        );

        break;
      }

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
    status,
    priority,
    sort,
  ]);

  /* =========================================================
      DASHBOARD STATS
  ========================================================= */

  const stats = useMemo(() => {
    return {
      total: filteredTasks.length,

      completed: filteredTasks.filter(
        (task) => task.status === "Completed"
      ).length,

      progress: filteredTasks.filter(
        (task) => task.status === "In Progress"
      ).length,

      pending: filteredTasks.filter(
        (task) =>
          task.status === "Pending" ||
          task.status === "Todo"
      ).length,

      review: filteredTasks.filter(
        (task) => task.status === "Review"
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
    /* =========================================================
      PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    filteredTasks.length / tasksPerPage
  );

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, priority, sort]);

  /* =========================================================
      CREATE TASK
  ========================================================= */

  const handleCreate = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  /* =========================================================
      EDIT TASK
  ========================================================= */

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  /* =========================================================
      SAVE TASK
  ========================================================= */

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

  /* =========================================================
      DELETE
  ========================================================= */

  const confirmDelete = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

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

  /* =========================================================
      UPDATE STATUS
  ========================================================= */

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

  /* =========================================================
      CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setPriority("All");
    setSort("Newest");
  };

  /* =========================================================
      HERO SUMMARY
  ========================================================= */

  const heroCards = [
    {
      icon: <FaTasks />,
      label: "Tasks",
      value: stats.total,
    },
    {
      icon: <FaSpinner />,
      label: "In Progress",
      value: stats.progress,
    },
    {
      icon: <FaCheckCircle />,
      label: "Completed",
      value: stats.completed,
    },
    {
      icon: <FaExclamationTriangle />,
      label: "Critical",
      value: stats.critical,
    },
  ];

  /* =========================================================
      STAT CARDS
  ========================================================= */

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      color: "blue",
      subtitle: "Workspace Tasks",
      icon: <FaTasks />,
    },
    {
      title: "Completed",
      value: stats.completed,
      color: "green",
      subtitle: "Finished",
      icon: <FaCheckCircle />,
    },
    {
      title: "In Progress",
      value: stats.progress,
      color: "orange",
      subtitle: "Currently Active",
      icon: <FaSpinner />,
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "red",
      subtitle: "Waiting",
      icon: <FaClock />,
    },
    {
      title: "Critical",
      value: stats.critical,
      color: "purple",
      subtitle: "Needs Attention",
      icon: <FaExclamationTriangle />,
    },
  ];
    /* =========================================================
      RENDER
  ========================================================= */

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

          <div className="hero-overlay" />

          <div className="hero-left">

            <span className="hero-badge">
              Workspace Overview
            </span>

            <PageHeader
              title={`Welcome back, ${user?.name || "User"}`}
              subtitle="Organize, prioritize and complete your work with your premium TaskFlow workspace."
            />

            <div className="hero-summary">

              {heroCards.map((item) => (

                <motion.div
                  key={item.label}
                  className="hero-summary-card"
                  whileHover={{
                    y: -5,
                  }}
                >

                  <div className="summary-icon">
                    {item.icon}
                  </div>

                  <div>

                    <h3>{item.value}</h3>

                    <span>{item.label}</span>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

          <div className="hero-right">

            <motion.div
              className="hero-workspace-card"
              initial={{
                opacity: 0,
                scale: .95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
            >

              <h5>Workspace Score</h5>

              <h2>{completion}%</h2>

              <div className="workspace-progress">

                <motion.div
                  className="workspace-progress-fill"
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

              <div className="workspace-mini-grid">

                <div>

                  <strong>
                    {stats.completed}
                  </strong>

                  <span>Completed</span>

                </div>

                <div>

                  <strong>
                    {stats.progress}
                  </strong>

                  <span>Active</span>

                </div>

                <div>

                  <strong>
                    {stats.pending}
                  </strong>

                  <span>Pending</span>

                </div>

                <div>

                  <strong>
                    {stats.review}
                  </strong>

                  <span>Review</span>

                </div>

              </div>

              <button
                className="hero-create-btn"
                onClick={handleCreate}
              >

                <FaPlus />

                Create New Task

              </button>

            </motion.div>

          </div>

        </section>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <section className="stats-grid">

          {statCards.map((card) => (

            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              color={card.color}
              icon={card.icon}
            />

          ))}

        </section>

        {/* =====================================================
            WORKSPACE PROGRESS
        ====================================================== */}

        <motion.section
          className="workspace-progress-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
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

            <h3>
              {completion}%
            </h3>

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

        </motion.section>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <TaskFilters
          search={search}
          setSearch={setSearch}

          status={status}
          setStatus={setStatus}

          priority={priority}
          setPriority={setPriority}

          sort={sort}
          setSort={setSort}

          totalTasks={filteredTasks.length}

          onClearFilters={clearFilters}
        />

        {/* =====================================================
            VIEW SWITCHER
        ====================================================== */}

        <div className="view-switcher">

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
                {/* =====================================================
            CONTENT
        ====================================================== */}

        <AnimatePresence mode="wait">

          {loading ? (

            <motion.div
              key="loader"
              className="tasks-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

              <div className="loader-spinner" />

              <p>Loading your workspace...</p>

            </motion.div>

          ) : filteredTasks.length === 0 ? (

            <motion.div
              key="empty"
              className="empty-workspace"
              initial={{
                opacity: 0,
                scale: .95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >

              <div className="empty-icon">

                <FaTasks />

              </div>

              <h2>
                No Tasks Found
              </h2>

              <p>
                Create your first task and start managing your
                workflow professionally.
              </p>

              <button
                className="primary-btn"
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
                onUpdateStatus={updateStatus}
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />

            </motion.div>

          ) : (

            <motion.div
              key="list"
              className="tasks-list-grid"
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
                  className="task-list-card"
                  whileHover={{
                    y: -6,
                  }}
                >

                  <div className="list-card-left">

                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {task.description ||
                        "No description available"}
                    </p>

                  </div>

                  <div className="list-card-right">

                    <span
                      className={`status-badge status-${(
                        task.status || ""
                      )
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                    >
                      {task.status}
                    </span>

                    <span
                      className={`priority-badge priority-${(
                        task.priority || ""
                      ).toLowerCase()}`}
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

            <div className="pagination">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (

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

              ))}

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
              >
                Next
              </button>

            </div>

          )}

        {/* =====================================================
            MODALS
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