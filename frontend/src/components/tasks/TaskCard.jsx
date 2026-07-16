import { memo } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";



import {
  FaCalendarAlt,
  FaChartLine,
  FaEdit,
  FaFolderOpen,
  FaTrash,
  FaUser,
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
    transform:
      CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priority = (
    task.priority || "Medium"
  )
    .replace(/\s+/g, "-")
    .toLowerCase();

  const status = (
    task.status || "Pending"
  )
    .replace(/\s+/g, "-")
    .toLowerCase();

  const progress =
    task.progress ?? 0;

  const handleEdit = (e) => {
    e.stopPropagation();

    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();

    if (onDelete) {
      onDelete(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${status} ${
        isDragging ? "dragging" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Header */}

      <div className="task-card-header">

        <h3 className="task-title">
          {task.title}
        </h3>

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

      {/* Description */}

      <p className="task-description">
        {task.description ||
          "No description provided."}
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

      {/* Progress */}

      <div className="task-progress">

        <div className="progress-header">

          <span>
            <FaChartLine />
            {" "}Progress
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
            <FaUser />
          </div>

          <span className="assignee-name">
            {task.assignee?.name ||
              "Unassigned"}
          </span>

        </div>

        {canManage && (
          <div className="task-actions">

            <button
              type="button"
              className="icon-btn"
              onClick={handleEdit}
              title="Edit Task"
            >
              <FaEdit />
            </button>

            <button
              type="button"
              className="icon-btn delete"
              onClick={handleDelete}
              title="Delete Task"
            >
              <FaTrash />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default memo(TaskCard);