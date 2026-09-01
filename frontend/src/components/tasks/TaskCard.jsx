import { memo } from "react";
import { motion } from "framer-motion";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  FaCalendarAlt,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaUserCircle,
  FaGripVertical,
  FaExclamationTriangle,
} from "react-icons/fa";

const priorityColors = {
  Low: "#22c55e",
  Medium: "#3b82f6",
  High: "#f59e0b",
  Critical: "#ef4444",
};

function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const priority = task.priority || "Medium";
  const status = task.status || "Pending";
  const progress = task.progress ?? 0;

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  const overdue = dueDate && dueDate < new Date() && status !== "Completed";

  const assignee = task.assignee?.name || "Unassigned";

  const initials =
    assignee !== "Unassigned"
      ? assignee
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "";

  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={style}
      className={`task-card ${isDragging ? "dragging" : ""}`}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      {...attributes}
      {...listeners}
    >
      {/* Left Accent */}

      <div
        className="task-priority-strip"
        style={{
          background: priorityColors[priority],
        }}
      />

      <div className="task-card-header">
        <div className="task-title-group">
          <FaGripVertical className="drag-icon" />

          <h3>{task.title}</h3>
        </div>

        <div className="task-chip-group">
          <span
            className="priority-chip"
            style={{
              background: priorityColors[priority],
            }}
          >
            {priority}
          </span>

          <span className="status-chip">{status}</span>
        </div>
      </div>

      <p className="task-description">
        {task.description || "No description available."}
      </p>

      <div className="task-meta">
        {task.project && (
          <div className="meta-item">
            <FaFolderOpen />

            <span>{task.project.title || task.project.name}</span>
          </div>
        )}

        {dueDate && (
          <div className={`meta-item ${overdue ? "meta-danger" : ""}`}>
            <FaCalendarAlt />

            <span>{dueDate.toLocaleDateString()}</span>

            {overdue && <FaExclamationTriangle />}
          </div>
        )}
      </div>

      <div className="task-progress">
        <div className="progress-top">
          <span>
            <FaChartLine />
            Progress
          </span>

          <span>{progress}%</span>
        </div>

        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.8,
            }}
          />
        </div>
      </div>

      <div className="task-footer">
        <div className="assignee">
          <div className="avatar">{initials ? initials : <FaUserCircle />}</div>

          <div>
            <strong>{assignee}</strong>

            <small>Assignee</small>
          </div>
        </div>

        <div className="task-actions">
          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <FaEdit />
          </button>

          <button
            className="action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(TaskCard);
