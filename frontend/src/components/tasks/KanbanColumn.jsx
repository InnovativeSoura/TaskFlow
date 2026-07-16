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
    <motion.div
      layout
      ref={setNodeRef}
      className={`kanban-column ${
        isOver ? "drag-over" : ""
      }`}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      {/* ===========================
          HEADER
      =========================== */}

      <div className="column-header">
        <div className="column-title">
          {columnIcons[id]}
          <span>{title}</span>
        </div>

        <div className="column-count">
          {tasks.length}
        </div>
      </div>

      {/* ===========================
          TASK LIST
      =========================== */}

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
                <div className="empty-icon">
                  {columnIcons[id]}
                </div>

                <h4>No Tasks</h4>

                <p>
                  Drag a task here or create a
                  new task.
                </p>

                {/* Keeps empty columns droppable */}
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                  }}
                />
              </motion.div>

            )}

          </AnimatePresence>

        </div>
      </SortableContext>
    </motion.div>
  );
};

export default KanbanColumn;