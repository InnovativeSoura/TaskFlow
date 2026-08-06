import { motion, AnimatePresence } from "framer-motion";

import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";

const KanbanColumn = ({
  id,
  title,
  color,
  icon,
  tasks = [],
  onEdit,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <motion.section
      layout
      ref={setNodeRef}
      className={`kanban-column ${
        isOver ? "drag-over" : ""
      }`}
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
    >
      {/* ===============================
          COLUMN HEADER
      =============================== */}

      <div
        className="kanban-column-header"
        style={{
          borderTop: `4px solid ${color}`,
        }}
      >
        <div className="column-header-left">
          <div
            className="column-icon"
            style={{
              background: color,
            }}
          >
            {icon}
          </div>

          <div>
            <h3>{title}</h3>

            <p>
              {tasks.length}{" "}
              {tasks.length === 1
                ? "Task"
                : "Tasks"}
            </p>
          </div>
        </div>

        <div
          className="column-counter"
          style={{
            color,
            borderColor: color,
          }}
        >
          {tasks.length}
        </div>
      </div>

      {/* ===============================
          COLUMN BODY
      =============================== */}

      <SortableContext
        items={tasks.map(
          (task) => task._id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        <div className="kanban-column-body">
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <motion.div
                className="kanban-empty"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <div
                  className="kanban-empty-icon"
                  style={{
                    background: `${color}20`,
                    color,
                  }}
                >
                  {icon}
                </div>

                <h4>No Tasks</h4>

                <p>
                  Drag tasks here or create
                  a new one.
                </p>

                {/* Keep Drop Zone Active */}

                <div
                  style={{
                    height: 60,
                    width: "100%",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* ===============================
          COLUMN FOOTER
      =============================== */}

      <div className="kanban-column-footer">
        <div className="footer-left">
          <span
            className="footer-dot"
            style={{
              background: color,
            }}
          />

          <span>
            {tasks.length}{" "}
            {tasks.length === 1
              ? "task"
              : "tasks"}
          </span>
        </div>

        <div className="footer-right">
          {tasks.length > 0
            ? `${Math.round(
                (tasks.length /
                  Math.max(tasks.length, 1)) *
                  100
              )}%`
            : "0%"}
        </div>
      </div>
    </motion.section>
  );
};

export default KanbanColumn;