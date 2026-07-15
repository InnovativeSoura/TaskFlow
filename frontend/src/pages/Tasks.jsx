import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import MainLayout from "../layouts/MainLayout";

import TaskFilters from "../components/tasks/TaskFilters";
import TaskModal from "../components/tasks/TaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaUser,
  FaFolderOpen,
  FaChartLine,
} from "react-icons/fa";

import "../styles/Tasks.css";

/* ==========================================
   TASK CARD
========================================== */

function TaskCard({
  task,
  onEdit,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  };

  const priority =
    (task.priority || "Medium")
      .toLowerCase();

  const status =
    (
      task.status || "Todo"
    )
      .replace(/\s+/g, "-")
      .toLowerCase();

  const progress =
    task.progress ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${status}`}
    >
      <div className="task-card-header">

        <h3 className="task-title">
          {task.title}
        </h3>

        <div className="task-badges">

          <span
            className={`badge priority-${priority}`}
          >
            {task.priority}
          </span>

          <span
            className={`badge status-${status}`}
          >
            {task.status}
          </span>

        </div>

      </div>

      <p className="task-description">
        {task.description ||
          "No description"}
      </p>

      <div className="task-meta">

        {task.project && (
          <div className="task-project">
            <FaFolderOpen />

            <span>
              {task.project.title ||
                task.project.name}
            </span>
          </div>
        )}

        {task.dueDate && (
          <div className="task-date">
            <FaCalendarAlt />

            <span>
              {new Date(
                task.dueDate
              ).toLocaleDateString()}
            </span>
          </div>
        )}

      </div>

      <div className="task-progress">

        <div className="progress-header">

          <span>
            <FaChartLine />
            {" "}Progress
          </span>

          <span>
            {progress}%
          </span>

        </div>

        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="task-footer">

        <div className="assignee">

          <div className="assignee-avatar">
            <FaUser />
          </div>

          <span className="assignee-name">
            {task.assignee?.name ||
              "Unassigned"}
          </span>

        </div>

        <div className="task-actions">

          <button
            className="icon-btn"
            onClick={() =>
              onEdit(task)
            }
          >
            <FaEdit />
          </button>

          <button
            className="icon-btn delete"
            onClick={() =>
              onDelete(task)
            }
          >
            <FaTrash />
          </button>

        </div>

      </div>

    </div>
  );
}

/* ==========================================
   COLUMN
========================================== */

function Column({
  title,
  tasks,
  onEdit,
  onDelete,
}) {
  return (
    <div className="kanban-column">

      <div className="column-header">

        <div className="column-title">
          {title}
        </div>

        <div className="column-count">
          {tasks.length}
        </div>

      </div>

      <SortableContext
        items={tasks.map(
          (t) => t._id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >

        <div className="column-body">

          {tasks.length === 0 ? (

            <div className="tasks-empty">
              No Tasks
            </div>

          ) : (

            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))

          )}

        </div>

      </SortableContext>

    </div>
  );
}
function Tasks() {
  const API_URL = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("token");

  /* ===========================
      STATE
  =========================== */

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

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

  /* ===========================
      FETCH
  =========================== */

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
      CREATE / UPDATE
  =========================== */

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
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ===========================
      DELETE
  =========================== */

  const handleDelete = (
    task
  ) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete =
    async () => {
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

        fetchTasks();

        setDeleteModalOpen(false);

        setSelectedTask(null);
      } catch (err) {
        console.error(err);
      } finally {
        setDeleting(false);
      }
    };

  /* ===========================
      EDIT
  =========================== */

  const handleEdit = (
    task
  ) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const createTask = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  /* ===========================
      STATUS UPDATE
  =========================== */

  const updateStatus =
    async (
      id,
      status
    ) => {
      try {
        await axios.patch(
          `${API_URL}/api/tasks/${id}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error(err);
      }
    };

  /* ===========================
      DRAG
  =========================== */

  const handleDragEnd = ({
    active,
    over,
  }) => {
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

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

    updateStatus(
      taskId,
      newStatus
    );
  };

  /* ===========================
      FILTERS
  =========================== */

  const filteredTasks =
    useMemo(() => {
      let data = [...tasks];

      if (search) {
        const value =
          search.toLowerCase();

        data = data.filter(
          (task) =>
            task.title
              ?.toLowerCase()
              .includes(value) ||
            task.description
              ?.toLowerCase()
              .includes(value)
        );
      }

      if (
        statusFilter !== "All"
      ) {
        data = data.filter(
          (task) =>
            task.status ===
            statusFilter
        );
      }

      if (
        priorityFilter !==
        "All"
      ) {
        data = data.filter(
          (task) =>
            task.priority ===
            priorityFilter
        );
      }

      switch (sortBy) {
        case "Oldest":
          data.sort(
            (a, b) =>
              new Date(
                a.createdAt
              ) -
              new Date(
                b.createdAt
              )
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
          const order = {
            Critical: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };

          data.sort(
            (a, b) =>
              (order[
                b.priority
              ] || 0) -
              (order[
                a.priority
              ] || 0)
          );
          break;
        }

        case "Due Date":
          data.sort(
            (a, b) =>
              new Date(
                a.dueDate ||
                  0
              ) -
              new Date(
                b.dueDate ||
                  0
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

  /* ===========================
      STATISTICS
  =========================== */

  const totalTasks =
    filteredTasks.length;

  const completedTasks =
    filteredTasks.filter(
      (t) =>
        t.status ===
        "Completed"
    ).length;

  const inProgressTasks =
    filteredTasks.filter(
      (t) =>
        t.status ===
        "In Progress"
    ).length;

  const pendingTasks =
    filteredTasks.filter(
      (t) =>
        t.status === "Todo" ||
        t.status ===
          "Pending"
    ).length;
    return (
  <MainLayout>
    <div className="tasks-page">

      {/* ===========================
          HEADER
      =========================== */}

      <div className="tasks-header">

        <div className="tasks-header-left">

          <h1>Task Management</h1>

          <p>
            Organize, track and manage your
            team's work efficiently.
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

      {/* ===========================
          STATISTICS
      =========================== */}

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

      {/* ===========================
          FILTERS
      =========================== */}

      <TaskFilters
        search={search}
        setSearch={setSearch}

        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}

        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}

        sortBy={sortBy}
        setSortBy={setSortBy}

        totalTasks={totalTasks}
      />

      {/* ===========================
          LOADING
      =========================== */}

      {loading ? (

        <div className="task-loader" />

      ) : (

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <div className="kanban-board">

            <div id="Todo">

              <Column
                title="Todo"
                tasks={filteredTasks.filter(
                  (task) =>
                    task.status === "Todo" ||
                    task.status === "Pending"
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            </div>

            <div id="In Progress">

              <Column
                title="In Progress"
                tasks={filteredTasks.filter(
                  (task) =>
                    task.status ===
                    "In Progress"
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            </div>

            <div id="Review">

              <Column
                title="Review"
                tasks={filteredTasks.filter(
                  (task) =>
                    task.status ===
                    "Review"
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            </div>

            <div id="Completed">

              <Column
                title="Completed"
                tasks={filteredTasks.filter(
                  (task) =>
                    task.status ===
                    "Completed"
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            </div>

          </div>
                  </DndContext>

      )}

      {/* ===========================
          CREATE / EDIT TASK MODAL
      =========================== */}

      <TaskModal
        open={modalOpen}
        task={selectedTask}

        onClose={() => {
          if (saving) return;

          setModalOpen(false);
          setSelectedTask(null);
        }}

        onSave={handleSave}

        projects={[]}
        users={[]}
      />


      {/* ===========================
          DELETE TASK MODAL
      =========================== */}

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