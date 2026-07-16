import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import MainLayout from "../layouts/MainLayout";

import TaskFilters from "../components/tasks/TaskFilters";
import TaskModal from "../components/tasks/TaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";
import KanbanBoard from "../components/tasks/KanbanBoard";

import "../styles/Tasks.css";

function Tasks() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  /* ==========================================
      STATE
  ========================================== */

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [priorityFilter, setPriorityFilter] =
    useState("All");
  const [sortBy, setSortBy] =
    useState("Newest");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  /* ==========================================
      FETCH TASKS
  ========================================== */

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(
        "Fetch Tasks:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
      CREATE / UPDATE
  ========================================== */

  const handleSave = async (
    formData
  ) => {
    try {
      setSaving(true);

      if (selectedTask) {
        await axios.put(
          `${API_URL}/api/tasks/${selectedTask._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/tasks`,
          formData,
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
      console.error(
        "Save Task:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
      EDIT
  ========================================== */

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const createTask = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  /* ==========================================
      DELETE
  ========================================== */

  const handleDelete = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
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
    } catch (error) {
      console.error(
        "Delete Task:",
        error
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ==========================================
      UPDATE STATUS
  ========================================== */

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await axios.patch(
        `${API_URL}/api/tasks/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? {
                ...task,
                status,
              }
            : task
        )
      );
    } catch (error) {
      console.error(
        "Update Status:",
        error
      );
    }
  };
    /* ==========================================
      FILTER + SORT
  ========================================== */

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
          task.priority ===
          priorityFilter
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
          a.title.localeCompare(
            b.title
          )
        );
        break;

      case "Z-A":
        data.sort((a, b) =>
          b.title.localeCompare(
            a.title
          )
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
            (priorityOrder[
              b.priority
            ] || 0) -
            (priorityOrder[
              a.priority
            ] || 0)
        );
        break;
      }

      case "Due Date":
        data.sort(
          (a, b) =>
            new Date(
              a.dueDate || 0
            ) -
            new Date(
              b.dueDate || 0
            )
        );
        break;

      default:
        data.sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
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

  /* ==========================================
      STATISTICS
  ========================================== */

  const totalTasks =
    filteredTasks.length;

  const completedTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  const inProgressTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    ).length;

  const pendingTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
          "Pending" ||
        task.status === "Todo"
    ).length;

  const reviewTasks =
    filteredTasks.filter(
      (task) =>
        task.status === "Review"
    ).length;

  /* ==========================================
      RETURN
  ========================================== */

  return (
    <MainLayout>
      <div className="tasks-page">

        {/* ==========================
            HEADER
        ========================== */}

        <div className="tasks-header">

          <div className="tasks-header-left">

            <h1>
              Task Management
            </h1>

            <p>
              Organize, track and
              manage your team's
              work efficiently.
            </p>

          </div>

          <div className="tasks-header-right">

            <button
              className="btn-task btn-primary"
              onClick={createTask}
            >
              + Create Task
            </button>

          </div>

        </div>

        {/* ==========================
            STATISTICS
        ========================== */}

        <div className="task-stats-grid">

          <div className="task-stat-card">
            <div className="task-stat-title">
              Total Tasks
            </div>

            <div className="task-stat-value">
              {totalTasks}
            </div>
          </div>

          <div className="task-stat-card">
            <div className="task-stat-title">
              Completed
            </div>

            <div className="task-stat-value">
              {completedTasks}
            </div>
          </div>

          <div className="task-stat-card">
            <div className="task-stat-title">
              In Progress
            </div>

            <div className="task-stat-value">
              {inProgressTasks}
            </div>
          </div>

          <div className="task-stat-card">
            <div className="task-stat-title">
              Pending
            </div>

            <div className="task-stat-value">
              {pendingTasks}
            </div>
          </div>

        </div>

        {/* ==========================
            FILTERS
        ========================== */}

        <TaskFilters
          search={search}
          setSearch={setSearch}
          statusFilter={
            statusFilter
          }
          setStatusFilter={
            setStatusFilter
          }
          priorityFilter={
            priorityFilter
          }
          setPriorityFilter={
            setPriorityFilter
          }
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* ==========================
            CONTENT
        ========================== */}

        {loading ? (
          <div className="task-loader" />
        ) : (
                    <KanbanBoard
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateStatus={updateStatus}
          />
        )}

        {/* ==========================
            CREATE / EDIT MODAL
        ========================== */}

        <TaskModal
          open={modalOpen}
          task={selectedTask}
          onSave={handleSave}
          onClose={() => {
            if (saving) return;

            setModalOpen(false);
            setSelectedTask(null);
          }}
          projects={[]}
          users={[]}
        />

        {/* ==========================
            DELETE MODAL
        ========================== */}

        <DeleteTaskModal
          open={deleteModalOpen}
          task={selectedTask}
          loading={deleting}
          onClose={() => {
            if (deleting) return;

            setDeleteModalOpen(false);
            setSelectedTask(null);
          }}
          onConfirm={confirmDelete}
        />

      </div>
    </MainLayout>
  );
}

export default Tasks;