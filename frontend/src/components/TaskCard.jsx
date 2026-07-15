import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaUser,
  FaFolderOpen,
  FaChartLine,
} from "react-icons/fa";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({
  task,
  canManage = true,
  onEdit,
  onDelete,
}) {
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
  };

  const priority =
    (task.priority || "Medium").toLowerCase();

  const status =
    (task.status || "Todo")
      .replace(/\s+/g, "-")
      .toLowerCase();

  const progress =
    typeof task.progress === "number"
      ? task.progress
      : 0;

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
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
      transition={{
        duration: 0.25,
      }}
      className={`task-card ${
        status === "completed"
          ? "completed"
          : status === "in-progress"
          ? "in-progress"
          : status === "review"
          ? "review"
          : "todo"
      } ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      {/* Header */}

      <div className="task-card-header">
        <h4 className="task-title">
          {task.title}
        </h4>

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

      {/* Description */}

      <p className="task-description">
        {task.description ||
          "No description available."}
      </p>

      {/* Meta */}

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

        {dueDate && (
          <div className="task-date">
            <FaCalendarAlt />

            <span>{dueDate}</span>
          </div>
        )}
      </div>

      {/* Progress */}

      <div className="task-progress">
        <div className="progress-header">
          <span>
            <FaChartLine /> Progress
          </span>

          <span>{progress}%</span>
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

      {/* Footer */}

      <div className="task-footer">
        <div className="assignee">
          <div className="assignee-avatar">
            {task.assignee?.avatar ? (
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="assignee-avatar"
              />
            ) : (
              <FaUser />
            )}
          </div>

          <div className="assignee-name">
            {task.assignee?.name ||
              "Unassigned"}
          </div>
        </div>

        {canManage && (
          <div className="task-actions">
            <button
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <FaEdit />
            </button>

            <button
              className="icon-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TaskCard;