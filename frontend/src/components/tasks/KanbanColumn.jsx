import { motion, AnimatePresence } from "framer-motion";

import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  FaClipboardList,
  FaSpinner,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

import TaskCard from "./TaskCard";

/* ==========================================
   COLUMN ICONS
========================================== */

const columnIcons = {
  Pending: <FaClipboardList />,
  "In Progress": <FaSpinner />,
  Review: <FaSearch />,
  Completed: <FaCheckCircle />,
};

/* ==========================================
   COLUMN COLORS
========================================== */

const columnColors = {
  Pending: "#6366f1",
  "In Progress": "#f59e0b",
  Review: "#06b6d4",
  Completed: "#10b981",
};

const KanbanColumn = ({
  id,
  title,
  tasks = [],
  canManage = true,
  onEdit,
  onDelete,
}) => {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
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
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
    >
      {/* ==========================
          COLUMN HEADER
      ========================== */}

      <div className="column-header">

        <div className="column-title">

          <div
            className="column-icon"
            style={{
              background: columnColors[id],
            }}
          >
            {columnIcons[id]}
          </div>

          <div>

            <h3>{title}</h3>

            <small>
              {tasks.length} Task
              {tasks.length !== 1 && "s"}
            </small>

          </div>

        </div>

        <div className="column-count">
          {tasks.length}
        </div>

      </div>

      {/* ==========================
          TASK LIST
      ========================== */}

      <SortableContext
        items={tasks.map(
          (task) => task._id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        <div className="column-body">

          <AnimatePresence mode="popLayout">

            {tasks.length > 0 ? (

              tasks.map((task) => (

                <TaskCard
                  key={task._id}
                  task={task}
                  canManage={canManage}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />

              ))

            ) : (

              <motion.div
                layout
                className="tasks-empty"
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
                  className="empty-icon"
                  style={{
                    color: columnColors[id],
                  }}
                >
                  {columnIcons[id]}
                </div>

                <h4>No Tasks Yet</h4>

                <p>
                  Drag and drop tasks here
                  or create a new one.
                </p>

                {/* Keeps column droppable */}

                <div
                  style={{
                    width: "100%",
                    height: 40,
                  }}
                />

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </SortableContext>

      {/* ==========================
          FOOTER
      ========================== */}

      <motion.div
        className="column-footer"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >

        <span>
          {tasks.length} /
          {" "}
          {tasks.length === 1
            ? "Task"
            : "Tasks"}
        </span>

        <div
          className="column-footer-line"
          style={{
            background: columnColors[id],
          }}
        />

      </motion.div>

    </motion.section>
  );
};

export default KanbanColumn;