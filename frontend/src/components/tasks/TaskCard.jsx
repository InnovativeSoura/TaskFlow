import { memo } from "react";
import { motion } from "framer-motion";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  FaCalendarAlt,
  FaChartLine,
  FaEdit,
  FaFolderOpen,
  FaTrash,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";

const TaskCard = ({
  task,
  canManage = true,
  onEdit,
  onDelete,
}) => {
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
    opacity: isDragging ? 0.55 : 1,
  };

  const priority = (task.priority || "Medium")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const status = (task.status || "Pending")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const progress = task.progress ?? 0;

  const dueDate = task.dueDate
    ? new Date(task.dueDate)
    : null;

  const isOverdue =
    dueDate &&
    dueDate < new Date() &&
    status !== "completed";

  const assigneeName =
    task.assignee?.name || "Unassigned";

  const initials =
    assigneeName !== "Unassigned"
      ? assigneeName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : null;

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(task);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
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
        scale: 0.95,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`task-card ${status} ${
        isDragging ? "dragging" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      {/* ==========================
          HEADER
      ========================== */}

      <div className="task-card-header">

        <div className="task-title-wrapper">

          <h3 className="task-title">
            {task.title}
          </h3>

          {isOverdue && (
            <div className="task-overdue">

              <FaExclamationTriangle />

              <span>
                Overdue
              </span>

            </div>
          )}

        </div>

        <div className="task-badges">

          <span
            className={`badge priority-${priority}`}
          >
            {task.priority || "Medium"}
          </span>

          <span
            className={`badge status-${status}`}
          >
            {task.status || "Pending"}
          </span>

        </div>

      </div>

      {/* ==========================
          DESCRIPTION
      ========================== */}

      <p className="task-description">
        {task.description ||
          "No description provided for this task."}
      </p>

      {/* ==========================
          META INFORMATION
      ========================== */}

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

          <div
            className={`task-date ${
              isOverdue ? "text-danger" : ""
            }`}
          >

            <FaCalendarAlt />

            <span>
              {dueDate.toLocaleDateString()}
            </span>

          </div>

        )}

      </div>
            {/* ==========================
          PROGRESS
      ========================== */}

      <div className="task-progress">

        <div className="progress-header">

          <span>
            <FaChartLine />
            {" "}
            Progress
          </span>

          <span>{progress}%</span>

        </div>

        <div className="progress-track">

          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.8,
            }}
          />

        </div>

      </div>

      {/* ==========================
          FOOTER
      ========================== */}

      <div className="task-footer">

        <div className="assignee">

          <div className="assignee-avatar">

            {task.assignee?.avatar ? (

              <img
                src={task.assignee.avatar}
                alt={assigneeName}
              />

            ) : initials ? (

              <span>
                {initials}
              </span>

            ) : (

              <FaUser />

            )}

          </div>

          <div>

            <div className="assignee-name">
              {assigneeName}
            </div>

            <small className="text-muted">
              Assigned User
            </small>

          </div>

        </div>

        {canManage && (

          <div className="task-actions">

            <button
              type="button"
              className="icon-btn"
              title="Edit Task"
              onClick={handleEdit}
            >
              <FaEdit />
            </button>

            <button
              type="button"
              className="icon-btn delete"
              title="Delete Task"
              onClick={handleDelete}
            >
              <FaTrash />
            </button>

          </div>

        )}

      </div>

    </motion.div>
  );
};

export default memo(TaskCard);