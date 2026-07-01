import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import "./Tasks.css";

/* ===========================
   TASK CARD (DRAGGABLE)
=========================== */
function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <span className={`priority ${task.priority.toLowerCase()}`}>
        {task.priority}
      </span>
    </div>
  );
}

/* ===========================
   COLUMN
=========================== */
function Column({ title, tasks }) {
  return (
    <div className="kanban-column">
      <h2>{title}</h2>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

/* ===========================
   MAIN COMPONENT
=========================== */
function Tasks() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const token = localStorage.getItem("token");

  /* ===========================
     FETCH TASKS
  =========================== */
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===========================
     UPDATE STATUS API
  =========================== */
  const updateStatus = async (id, status) => {
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
     DRAG END
  =========================== */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

    updateStatus(taskId, newStatus);
  };

  /* ===========================
     GROUP TASKS
  =========================== */
  const pending = tasks.filter((t) => t.status === "Pending");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const completed = tasks.filter((t) => t.status === "Completed");

  return (
    <div className="tasks-page">
      <Sidebar />

      <div className="tasks-main">
        <Navbar />

        <div className="tasks-content">
          <h1>Kanban Board</h1>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="kanban-board">

              <div id="Pending">
                <Column title="Pending" tasks={pending} />
              </div>

              <div id="In Progress">
                <Column title="In Progress" tasks={inProgress} />
              </div>

              <div id="Completed">
                <Column title="Completed" tasks={completed} />
              </div>

            </div>
          </DndContext>

        </div>
      </div>
    </div>
  );
}

export default Tasks;